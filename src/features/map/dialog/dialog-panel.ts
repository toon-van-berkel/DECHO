import { Canvas, ScreenElement } from 'excalibur';
import { THEME, withAlpha } from '../../../core/theme';
import { wrapCanvasText } from './dialog-helpers';
import type { DialogPanelLayout } from './dialog-layout';

export class DialogPanel extends ScreenElement {
  private speaker = '';
  private text = '';
  private accent: string = THEME.accent.cyan;

  constructor(private readonly layout: DialogPanelLayout) {
    super({
      x: layout.x,
      y: layout.y,
      width: layout.width,
      height: layout.height,
      z: 50,
    });

    this.graphics.use(
      new Canvas({
        width: layout.width,
        height: layout.height,
        cache: false,
        smoothing: true,
        draw: (context) => this.draw(context),
      }),
    );
  }

  setContent(speaker: string, text: string, accent: string): void {
    this.speaker = speaker;
    this.text = text;
    this.accent = accent;
  }

  private draw(context: CanvasRenderingContext2D): void {
    const {
      width,
      height,
      padding,
      speakerFontSize,
      dialogueFontSize,
      lineHeight,
    } = this.layout;
    context.clearRect(0, 0, width, height);
    context.beginPath();
    context.roundRect(0, 0, width, height, 10);
    context.fillStyle = withAlpha(THEME.color.bg, 0.94);
    context.fill();
    context.save();
    context.beginPath();
    context.roundRect(0, 0, width, height, 10);
    context.clip();
    context.fillStyle = this.accent;
    context.fillRect(0, 0, width, 2);
    context.restore();

    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillStyle = this.accent;
    context.font = `700 ${speakerFontSize}px ${THEME.font.heading}`;
    context.fillText(this.speaker.toUpperCase(), padding, padding);

    context.fillStyle = THEME.color.text;
    context.font = `400 ${dialogueFontSize}px ${THEME.font.body}`;
    const textY = padding + speakerFontSize + Math.round(padding * 0.65);
    const lines = wrapCanvasText(context, this.text, width - padding * 2);
    const maxLines = Math.max(1, Math.floor((height - textY - padding) / lineHeight));
    lines.slice(0, maxLines).forEach((line, index) => {
      context.fillText(line, padding, textY + index * lineHeight);
    });
  }
}
