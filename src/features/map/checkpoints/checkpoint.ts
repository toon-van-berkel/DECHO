import {
  Actor,
  BaseAlign,
  Canvas,
  Color,
  Engine,
  Font,
  FontUnit,
  Text,
  TextAlign,
  Vector,
  vec,
} from 'excalibur';
import type { CheckpointConfig } from './checkpoint-config';
import { hexagonPoints, lerp, approach } from '../geometry/geometry';
import { THEME, parseHsl, withAlpha } from '../../../core/theme';

// The bitmap is larger than the hit area so the glow is not clipped.
const BITMAP = 130;
const HIT_SIZE = 64;
const MARKER_RADIUS = 26;
const HOVER_RADIUS_BONUS = 4;
const CORE_RADIUS = 4;

/** Builds an engine `Color` from a theme `hsl(...)` string (for `Text`). */
function hslToColor(css: string): Color {
  const p = parseHsl(css);
  return p ? Color.fromHSL(p[0] / 360, p[1] / 100, p[2] / 100) : Color.White;
}

export class Checkpoint extends Actor {
  private readonly config: CheckpointConfig;
  private readonly accent: string;
  private readonly onSelect: (config: CheckpointConfig) => void;
  private hoverTarget = 0;
  private hoverT = 0;
  private pulseMs = 0;

  constructor(
    config: CheckpointConfig,
    position: Vector,
    onSelect: (config: CheckpointConfig) => void,
  ) {
    super({
      name: `checkpoint-${config.id}`,
      pos: position,
      width: HIT_SIZE,
      height: HIT_SIZE,
      z: 10,
    });
    this.config = config;
    this.accent = THEME.accent[config.theme];
    this.onSelect = onSelect;
  }

  override onInitialize(engine: Engine): void {
    const marker = new Canvas({
      width: BITMAP,
      height: BITMAP,
      cache: false, // redrawn every frame: the marker pulses continuously
      smoothing: true,
      draw: (ctx) => this.drawMarker(ctx),
    });
    this.graphics.use(marker);
    // Keep the decorative glow outside the pointer hit area.
    this.pointer.useGraphicsBounds = false;

    this.addChild(this.buildLabel(this.config.title, THEME.font.heading, THEME.color.text, 14, true, -8));
    this.addChild(this.buildLabel(this.config.subtitle, THEME.font.label, THEME.color.muted, 13, true, 11));

    this.on('pointerenter', () => {
      this.hoverTarget = 1;
      engine.canvas.style.cursor = 'pointer';
    });
    this.on('pointerleave', () => {
      this.hoverTarget = 0;
      engine.canvas.style.cursor = 'default';
    });
    this.on('pointerup', () => {
      engine.canvas.style.cursor = 'default';
      this.onSelect(this.config);
    });
  }

  override onPreUpdate(_engine: Engine, elapsedMs: number): void {
    this.pulseMs += elapsedMs;
    this.hoverT = approach(this.hoverT, this.hoverTarget, elapsedMs, THEME.motion.hoverMs);
  }

  private buildLabel(
    text: string,
    family: string,
    cssColor: string,
    size: number,
    bold: boolean,
    offsetY: number,
  ): Actor {
    const label = new Actor({
      x: MARKER_RADIUS + 14,
      y: offsetY,
      anchor: vec(0, 0.5),
      z: 11,
    });
    label.graphics.use(
      new Text({
        text,
        font: new Font({
          family,
          size,
          unit: FontUnit.Px,
          bold,
          color: hslToColor(cssColor),
          textAlign: TextAlign.Left,
          baseAlign: BaseAlign.Middle,
        }),
      }),
    );
    return label;
  }

  private drawMarker(ctx: CanvasRenderingContext2D): void {
    const center = BITMAP / 2;
    const pulse = (Math.sin((this.pulseMs / THEME.glow.pulseMs) * Math.PI * 2) + 1) / 2;
    const glow = lerp(THEME.glow.idleBlur, THEME.glow.hoverBlur, this.hoverT) * (0.8 + 0.2 * pulse);
    const radius = MARKER_RADIUS + HOVER_RADIUS_BONUS * this.hoverT;
    const points = hexagonPoints(radius);

    ctx.clearRect(0, 0, BITMAP, BITMAP);
    ctx.save();
    ctx.translate(center, center);

    ctx.beginPath();
    points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.closePath();

    ctx.shadowColor = this.accent;
    ctx.shadowBlur = glow;
    ctx.fillStyle = withAlpha(this.accent, 0.18 + 0.12 * this.hoverT);
    ctx.fill();

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = this.accent;
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(0, 0, CORE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = this.accent;
    ctx.fill();

    ctx.restore();
  }
}
