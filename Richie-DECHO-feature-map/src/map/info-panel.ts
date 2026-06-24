import { Canvas, Color, Engine, FadeInOut, ScreenElement } from 'excalibur';
import type { CheckpointConfig } from './checkpoint-config';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { THEME, themeColorHex, hexToRgba, mixHex } from '../theme';
import { wrapText, lerp, clamp } from './geometry';

/** A rectangle in screen coordinates, used for button hit-testing. */
interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const CARD_W = 540;
const CARD_H = 320;
const PAD = 32;
/** Max characters per description line; keep in sync with the card width. */
const DESC_MAX_CHARS = 52;
const LINE_H = 22;
/** Scrim opacity when fully open (0–1). */
const SCRIM_MAX_ALPHA = 0.55;

/**
 * Full-screen overlay showing a checkpoint's details and a "travel" button.
 * Hidden until {@link show}; {@link hide} fades it out. It is one canvas
 * (scrim + card + text + buttons); clicks are hit-tested against the button
 * rectangles, and the scrim closes the panel.
 */
export class InfoPanel extends ScreenElement {
  private engine!: Engine;
  private config: CheckpointConfig | null = null;
  private accentHex: string = THEME.accent.cyan;
  private isOpen = false;
  /** Open/close progress: 0 = hidden, 1 = fully visible. */
  private anim = 0;
  private animTarget = 0;
  private descLines: string[] = [];
  /** Which button the pointer is over, and the eased glow amount (0–1) per button. */
  private hovered: 'travel' | 'close' | null = null;
  private travelHoverT = 0;
  private closeHoverT = 0;

  private readonly cardX = (GAME_WIDTH - CARD_W) / 2;
  private readonly cardY = (GAME_HEIGHT - CARD_H) / 2;
  private readonly travelRect: Rect = { x: 0, y: 0, w: 200, h: 44 };
  private readonly closeRect: Rect = { x: 0, y: 0, w: 110, h: 44 };

  constructor() {
    super({ x: 0, y: 0, width: GAME_WIDTH, height: GAME_HEIGHT, z: 100 });
    this.travelRect.x = this.cardX + PAD;
    this.travelRect.y = this.cardY + CARD_H - PAD - this.travelRect.h;
    this.closeRect.x = this.cardX + CARD_W - PAD - this.closeRect.w;
    this.closeRect.y = this.cardY + CARD_H - PAD - this.closeRect.h;
  }

  override onInitialize(engine: Engine): void {
    this.engine = engine;
    this.graphics.use(
      new Canvas({
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        cache: false,
        smoothing: true,
        draw: (ctx) => this.draw(ctx),
      }),
    );
    this.setPointerEnabled(false);
    this.graphics.isVisible = false;

    this.on('pointerup', (evt) => {
      if (!this.isOpen) {
        return;
      }
      evt.cancel(); // don't let the click fall through to a checkpoint behind the panel
      const { x, y } = evt.screenPos;
      if (this.inRect(x, y, this.travelRect)) {
        this.travel();
      } else {
        this.hide(); // close button or clicking the scrim dismisses
      }
    });

    this.on('pointermove', (evt) => {
      if (!this.isOpen) {
        return;
      }
      const { x, y } = evt.screenPos;
      if (this.inRect(x, y, this.travelRect)) {
        this.hovered = 'travel';
      } else if (this.inRect(x, y, this.closeRect)) {
        this.hovered = 'close';
      } else {
        this.hovered = null;
      }
      engine.canvas.style.cursor = this.hovered ? 'pointer' : 'default';
    });
  }

  /** Opens the panel for the given checkpoint. */
  show(config: CheckpointConfig): void {
    this.config = config;
    this.accentHex = themeColorHex(config.theme);
    this.descLines = wrapText(config.description, DESC_MAX_CHARS);
    this.isOpen = true;
    this.animTarget = 1;
    this.hovered = null;
    this.travelHoverT = 0;
    this.closeHoverT = 0;
    this.setPointerEnabled(true);
    this.graphics.isVisible = true;
  }

  /** Starts closing the panel. */
  hide(): void {
    this.isOpen = false;
    this.animTarget = 0;
    this.hovered = null;
    this.engine.canvas.style.cursor = 'default';
    this.setPointerEnabled(false);
  }

  override onPreUpdate(_engine: Engine, elapsedMs: number): void {
    const animStep = elapsedMs / (this.animTarget === 1 ? THEME.motion.panelInMs : THEME.motion.panelOutMs);
    this.anim = this.approach(this.anim, this.animTarget, animStep);

    // Ease each button's glow toward 1 while hovered, back to 0 otherwise.
    const hoverStep = elapsedMs / THEME.motion.hoverMs;
    this.travelHoverT = this.approach(this.travelHoverT, this.hovered === 'travel' ? 1 : 0, hoverStep);
    this.closeHoverT = this.approach(this.closeHoverT, this.hovered === 'close' ? 1 : 0, hoverStep);

    if (this.anim <= 0.001 && this.animTarget === 0) {
      this.graphics.isVisible = false; // fully closed: stop drawing
    }
  }

  /** Navigates to the checkpoint's target scene, passing the config along. */
  private travel(): void {
    if (!this.config) {
      return;
    }
    const target = this.config.targetScene;
    this.hide();
    // Hide instantly (no fade-out) since we're leaving the scene anyway.
    this.anim = 0;
    this.graphics.isVisible = false;
    void this.engine.goToScene(target, {
      sceneActivationData: this.config,
      destinationIn: new FadeInOut({ duration: 400, direction: 'in', color: Color.Black }),
      sourceOut: new FadeInOut({ duration: 300, direction: 'out', color: Color.Black }),
    });
  }

  /** Toggles pointer hit-testing so a hidden panel never blocks clicks to the map. */
  private setPointerEnabled(enabled: boolean): void {
    this.pointer.useColliderShape = enabled;
    this.pointer.useGraphicsBounds = enabled;
  }

  private inRect(x: number, y: number, r: Rect): boolean {
    return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
  }

  /** Moves `current` toward `target` by at most `step`, clamped to [0, 1]. */
  private approach(current: number, target: number, step: number): number {
    const delta = target - current;
    return clamp(current + Math.sign(delta) * Math.min(Math.abs(delta), step), 0, 1);
  }

  private draw(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    if (this.anim <= 0.001 || !this.config) {
      return;
    }
    const a = this.anim;

    // Scrim behind the card.
    ctx.fillStyle = hexToRgba(THEME.color.overlay, SCRIM_MAX_ALPHA * a);
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Card scales from 0.96 → 1 around its center as it opens.
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const scale = lerp(0.96, 1, a);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.translate(-cx, -cy);

    this.roundedRect(ctx, this.cardX, this.cardY, CARD_W, CARD_H, 16);
    ctx.fillStyle = THEME.color.panelFill;
    ctx.shadowColor = this.accentHex;
    ctx.shadowBlur = 24;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = this.accentHex;
    ctx.stroke();

    const left = this.cardX + PAD;
    let y = this.cardY + PAD + 8;

    // Title.
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.fillStyle = this.accentHex;
    ctx.font = `900 26px ${THEME.font.heading}`;
    ctx.fillText(this.config.title, left, y + 14);
    y += 34;

    // Subtitle.
    ctx.fillStyle = THEME.color.muted;
    ctx.font = `700 14px ${THEME.font.label}`;
    ctx.fillText(this.config.subtitle.toUpperCase(), left, y + 12);
    y += 26;

    // Divider.
    ctx.strokeStyle = THEME.color.border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(this.cardX + CARD_W - PAD, y);
    ctx.stroke();
    y += 22;

    // Description.
    ctx.fillStyle = THEME.color.text;
    ctx.font = `400 14px ${THEME.font.body}`;
    for (const line of this.descLines) {
      ctx.fillText(line, left, y);
      y += LINE_H;
    }

    // Primary "travel" button (filled accent; the glow grows on hover).
    this.roundedRect(ctx, this.travelRect.x, this.travelRect.y, this.travelRect.w, this.travelRect.h, 8);
    ctx.shadowColor = this.accentHex;
    ctx.shadowBlur = 22 * this.travelHoverT;
    ctx.fillStyle = this.accentHex;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = THEME.color.bg;
    ctx.font = `700 14px ${THEME.font.heading}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('REIS HIERHEEN', this.travelRect.x + this.travelRect.w / 2, this.travelRect.y + this.travelRect.h / 2);

    // Secondary "close" button (outline; border, text and glow brighten on hover).
    this.roundedRect(ctx, this.closeRect.x, this.closeRect.y, this.closeRect.w, this.closeRect.h, 8);
    ctx.shadowColor = THEME.color.text;
    ctx.shadowBlur = 14 * this.closeHoverT;
    ctx.strokeStyle = hexToRgba(THEME.color.text, lerp(0.4, 0.9, this.closeHoverT));
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = mixHex(THEME.color.muted, THEME.color.text, this.closeHoverT);
    ctx.fillText('SLUITEN', this.closeRect.x + this.closeRect.w / 2, this.closeRect.y + this.closeRect.h / 2);

    ctx.restore();
  }

  /** Traces a rounded-rectangle path (caller fills/strokes). */
  private roundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}
