import { Canvas, Engine, ScreenElement } from 'excalibur';
import { THEME, hexToRgba } from '../../../core/theme';
import { wrapCanvasText } from './dialog-helpers';

interface DialogOptionButtonOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  label: string;
  accent: string;
  onSelect: () => void;
}

export class DialogOptionButton extends ScreenElement {
  private hovered = false;

  constructor(private readonly options: DialogOptionButtonOptions) {
    super({
      x: options.x,
      y: options.y,
      width: options.width,
      height: options.height,
      z: 52,
    });

    this.graphics.use(
      new Canvas({
        width: options.width,
        height: options.height,
        cache: false,
        smoothing: true,
        draw: (context) => this.draw(context),
      }),
    );
  }

  override onInitialize(engine: Engine): void {
    this.on('pointerenter', () => {
      this.hovered = true;
      engine.canvas.style.cursor = 'pointer';
    });
    this.on('pointerleave', () => {
      this.hovered = false;
      engine.canvas.style.cursor = 'default';
    });
    this.on('pointerup', (event) => {
      event.cancel();
      engine.canvas.style.cursor = 'default';
      this.options.onSelect();
    });
  }

  private draw(context: CanvasRenderingContext2D): void {
    const { width, height, label, accent, fontSize } = this.options;
    context.clearRect(0, 0, width, height);
    context.beginPath();
    context.roundRect(1, 1, width - 2, height - 2, 6);
    context.fillStyle = this.hovered ? hexToRgba(accent, 0.24) : 'rgba(15, 23, 42, 0.82)';
    context.fill();
    context.strokeStyle = this.hovered ? accent : hexToRgba(accent, 0.55);
    context.lineWidth = 1.5;
    context.stroke();

    context.fillStyle = this.hovered ? THEME.color.text : '#D6E1F0';
    context.font = `600 ${fontSize}px ${THEME.font.label}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    const lines = wrapCanvasText(context, label, width - 28).slice(0, 2);
    const lineHeight = fontSize * 1.2;
    const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, index) => {
      context.fillText(line, width / 2, startY + index * lineHeight);
    });
  }
}
