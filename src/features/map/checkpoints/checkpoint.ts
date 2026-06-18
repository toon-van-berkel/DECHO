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
import { hexagonPoints, lerp, clamp } from '../geometry/geometry';
import { THEME, themeColorHex, hexToRgba } from '../../../core/theme';

// The bitmap is larger than the hit area so the glow is not clipped.
const BITMAP = 130;
const HIT_SIZE = 64;
const MARKER_RADIUS = 26;
const HOVER_RADIUS_BONUS = 4;
const CORE_RADIUS = 4;

export class Checkpoint extends Actor {
  private readonly config: CheckpointConfig;
  private readonly accentHex: string;
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
    this.accentHex = themeColorHex(config.theme);
    this.onSelect = onSelect;
  }

  override onInitialize(engine: Engine): void {
    const marker = new Canvas({
      width: BITMAP,
      height: BITMAP,
      cache: false,
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
    const step = elapsedMs / THEME.motion.hoverMs;
    const delta = this.hoverTarget - this.hoverT;
    this.hoverT = clamp(this.hoverT + Math.sign(delta) * Math.min(Math.abs(delta), step), 0, 1);
  }

  private buildLabel(
    text: string,
    family: string,
    colorHex: string,
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
          color: Color.fromHex(colorHex),
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

    ctx.shadowColor = this.accentHex;
    ctx.shadowBlur = glow;
    ctx.fillStyle = hexToRgba(this.accentHex, 0.18 + 0.12 * this.hoverT);
    ctx.fill();

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = this.accentHex;
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(0, 0, CORE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = this.accentHex;
    ctx.fill();

    ctx.restore();
  }
}
