import { Canvas, ScreenElement } from 'excalibur';
import { THEME } from '../../../core/theme';
import type { CheckpointConfig } from '../checkpoints/checkpoint-config';
import { wrapText } from '../geometry/geometry';
import { INFO_CARD_X, INFO_CARD_Y, INFO_PANEL_LAYOUT } from './info-panel-layouts';

export class InfoCard extends ScreenElement {
  private config: CheckpointConfig | null = null;
  private accentHex: string = THEME.accent.cyan;

  constructor() {
    super({
      x: INFO_CARD_X,
      y: INFO_CARD_Y,
      width: INFO_PANEL_LAYOUT.card.width,
      height: INFO_PANEL_LAYOUT.card.height,
      z: 101,
    });
    this.graphics.use(
      new Canvas({
        width: INFO_PANEL_LAYOUT.card.width,
        height: INFO_PANEL_LAYOUT.card.height,
        cache: false,
        smoothing: true,
        draw: (ctx) => this.draw(ctx),
      }),
    );
  }

  setContent(config: CheckpointConfig, accentHex: string): void {
    this.config = config;
    this.accentHex = accentHex;
  }

  private draw(ctx: CanvasRenderingContext2D): void {
    const { width, height, padding, radius } = INFO_PANEL_LAYOUT.card;
    ctx.clearRect(0, 0, width, height);
    if (!this.config) return;

    ctx.beginPath();
    ctx.roundRect(1, 1, width - 2, height - 2, radius);
    ctx.fillStyle = THEME.color.panelFill;
    ctx.shadowColor = this.accentHex;
    ctx.shadowBlur = 24;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = this.accentHex;
    ctx.stroke();

    let y = padding + 22;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = this.accentHex;
    ctx.font = `900 26px ${THEME.font.heading}`;
    ctx.fillText(this.config.title, padding, y);

    y += 30;
    ctx.fillStyle = THEME.color.muted;
    ctx.font = `700 14px ${THEME.font.label}`;
    ctx.fillText(this.config.subtitle.toUpperCase(), padding, y);

    y += 18;
    ctx.strokeStyle = THEME.color.border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();

    y += 24;
    ctx.fillStyle = THEME.color.text;
    ctx.font = `400 14px ${THEME.font.body}`;
    const lines = wrapText(
      this.config.description,
      INFO_PANEL_LAYOUT.description.maxCharactersPerLine,
    );
    for (const line of lines) {
      ctx.fillText(line, padding, y);
      y += INFO_PANEL_LAYOUT.description.lineHeight;
    }
  }
}
