import { Canvas, Engine, ScreenElement } from 'excalibur';
import { THEME, hexToRgba, mixHex } from '../../../core/theme';

interface PanelButtonOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  variant: 'primary' | 'secondary';
  onClick: () => void;
}

export class PanelButton extends ScreenElement {
  private accentHex: string = THEME.accent.cyan;
  private hovered = false;
  private enabled = false;

  constructor(private readonly options: PanelButtonOptions) {
    super({
      x: options.x,
      y: options.y,
      width: options.width,
      height: options.height,
      z: 102,
    });
  }

  override onInitialize(engine: Engine): void {
    this.graphics.use(
      new Canvas({
        width: this.options.width,
        height: this.options.height,
        cache: false,
        smoothing: true,
        draw: (ctx) => this.draw(ctx),
      }),
    );

    this.on('pointerenter', () => {
      if (!this.enabled) return;
      this.hovered = true;
      engine.canvas.style.cursor = 'pointer';
    });
    this.on('pointerleave', () => {
      this.hovered = false;
      engine.canvas.style.cursor = 'default';
    });
    this.on('pointerup', (event) => {
      if (!this.enabled) return;
      event.cancel();
      this.options.onClick();
    });
  }

  setAccent(accentHex: string): void {
    this.accentHex = accentHex;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.hovered = false;
    this.pointer.useColliderShape = enabled;
    this.pointer.useGraphicsBounds = enabled;
  }

  private draw(ctx: CanvasRenderingContext2D): void {
    const { width, height, text, variant } = this.options;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.roundRect(1, 1, width - 2, height - 2, 8);

    if (variant === 'primary') {
      ctx.shadowColor = this.accentHex;
      ctx.shadowBlur = this.hovered ? 22 : 0;
      ctx.fillStyle = this.accentHex;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = THEME.color.bg;
    } else {
      ctx.shadowColor = THEME.color.text;
      ctx.shadowBlur = this.hovered ? 14 : 0;
      ctx.strokeStyle = hexToRgba(THEME.color.text, this.hovered ? 0.9 : 0.4);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = mixHex(THEME.color.muted, THEME.color.text, this.hovered ? 1 : 0);
    }

    ctx.font = `700 14px ${THEME.font.heading}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
  }
}
