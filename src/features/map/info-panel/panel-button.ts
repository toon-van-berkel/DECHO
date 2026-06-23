import { Canvas, Engine, ScreenElement, vec } from 'excalibur';
import { THEME, withAlpha } from '../../../core/theme';
import { approach, lerp } from '../geometry/geometry';

interface PanelButtonOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  variant: 'primary' | 'secondary';
  onClick: () => void;
  /** Animated hover glow. Defaults to true; pass `false` for dev-only buttons. */
  glow?: boolean;
}

// Peak glow blur per variant, eased in/out with the hover transition.
const GLOW_BLUR = { primary: 22, secondary: 14 } as const;

// Transparent margin so the glow blur isn't clipped to a hard edge; the graphic is shifted back by the same amount to keep the face aligned.
const GLOW_PAD = 24;

/**
 * The one shared panel button (info panel, shop, …): give it geometry, a label,
 * `variant` and `onClick`, and it draws itself with an eased hover glow. Pass
 * `glow: false` to opt out (dev buttons).
 */
export class PanelButton extends ScreenElement {
  private accentHex: string = THEME.accent.cyan;
  private readonly glow: boolean;
  private canvas!: Canvas;
  /** Hover progress: 0 = idle, 1 = fully hovered. Eased every frame. */
  private hoverTarget = 0;
  private hoverT = 0;
  private enabled = false;

  constructor(private readonly options: PanelButtonOptions) {
    super({
      x: options.x,
      y: options.y,
      width: options.width,
      height: options.height,
      z: 102,
    });
    this.glow = options.glow ?? true;
  }

  override onInitialize(engine: Engine): void {
    this.canvas = new Canvas({
      width: this.options.width + GLOW_PAD * 2,
      height: this.options.height + GLOW_PAD * 2,
      cache: true, // only redraws while the glow animates (see onPreUpdate); idle = free
      smoothing: true,
      draw: (ctx) => this.draw(ctx),
    });
    this.graphics.use(this.canvas);
    this.graphics.offset = vec(-GLOW_PAD, -GLOW_PAD);

    this.on('pointerenter', () => {
      if (!this.enabled || !this.glow) return;
      this.hoverTarget = 1;
      engine.canvas.style.cursor = 'pointer';
    });
    this.on('pointerleave', () => {
      this.hoverTarget = 0;
      engine.canvas.style.cursor = 'default';
    });
    this.on('pointerup', (event) => {
      if (!this.enabled) return;
      event.cancel();
      this.options.onClick();
    });
  }

  // Override onPreUpdate to ease the hover progress and flag the canvas dirty if it changes, so the glow animates smoothly.
  override onPreUpdate(_engine: Engine, delta: number): void {
    const next = approach(
      this.hoverT, 
      this.hoverTarget, 
      delta, 
      THEME.motion.hoverMs
    );
    
    if (next !== this.hoverT) {
      this.hoverT = next;
      this.canvas.flagDirty();
    }
  }

  // The accent colour can be changed at runtime. The button redraws itself on the next frame.
  setAccent(accentHex: string): void {
    if (accentHex === this.accentHex) return;
    this.accentHex = accentHex;
    this.canvas?.flagDirty();
  }

  // This disables the button entirely: no hover, no click, no glow. The caller can also hide it entirely if desired.
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.hoverTarget = 0;
    this.pointer.useColliderShape = enabled;
    this.pointer.useGraphicsBounds = enabled;
  }

  // Draws the button face and glow into the canvas. The glow is eased by `hoverT`.
  private draw(ctx: CanvasRenderingContext2D): void {
    const { width, height, text, variant } = this.options;
    const t = this.hoverT;
    ctx.clearRect(0, 0, width + GLOW_PAD * 2, height + GLOW_PAD * 2);

    // Draw the button face inside the padded bitmap so the glow has room.
    ctx.save();
    ctx.translate(GLOW_PAD, GLOW_PAD);
    ctx.beginPath();
    ctx.roundRect(1, 1, width - 2, height - 2, 8);

    if (variant === 'primary') {
      ctx.shadowColor = this.accentHex;
      ctx.shadowBlur = lerp(0, GLOW_BLUR.primary, t);
      ctx.fillStyle = this.accentHex;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = THEME.color.bg;
    } else {
      ctx.shadowColor = THEME.color.text;
      ctx.shadowBlur = lerp(0, GLOW_BLUR.secondary, t);
      ctx.strokeStyle = withAlpha(THEME.color.text, lerp(0.4, 0.9, t));
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = withAlpha(THEME.color.text, lerp(0.6, 1, t));
    }

    ctx.font = `700 14px ${THEME.font.heading}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
    ctx.restore();
  }
}
