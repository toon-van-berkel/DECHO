/**
 * Dialogue box for DECHO.
 *
 * Main responsibility:
 * - Renders the active speaker and dialogue text.
 *
 * Made by: Richie
 */

import * as excalibur from 'excalibur';
import {
  drawDivider,
  drawHudPanel,
  wrapText,
} from '../../components/ui/hud-drawing';
import { THEME } from '../../core/theme/theme-index';
import { dialogueLayout } from './dialogue-layout';

export class DialogueBox extends excalibur.ScreenElement {
  private speakerName = '';
  private dialogueText = '';

  constructor() {
    super({
      x: dialogueLayout.box.x,
      y: dialogueLayout.box.y,
      width: dialogueLayout.box.width,
      height: dialogueLayout.box.height,
      z: 100,
    });

    this.graphics.use(
      new excalibur.Canvas({
        width: dialogueLayout.box.width,
        height: dialogueLayout.box.height,
        cache: false,
        smoothing: true,
        draw: (context) => this.drawBox(context),
      }),
    );
  }

  setContent(speakerName: string, text: string): void {
    this.speakerName = speakerName;
    this.dialogueText = text;
  }

  private drawBox(context: CanvasRenderingContext2D): void {
    const { width, height, padding } = dialogueLayout.box;
    const linesArray = wrapText(this.dialogueText, 92).slice(0, 3);

    context.clearRect(0, 0, width, height);
    drawHudPanel(context, width, height, THEME.accent.cyan);

    context.textAlign = 'left';
    context.textBaseline = 'alphabetic';
    context.fillStyle = THEME.accent.cyan;
    context.font = `900 22px ${THEME.font.heading}`;
    context.fillText(this.speakerName.toUpperCase(), padding, 34);

    drawDivider(context, padding, 50, width - padding * 2);

    context.fillStyle = THEME.color.softText;
    context.font = `400 17px ${THEME.font.body}`;
    linesArray.forEach((lineText, lineIndex) => {
      context.fillText(lineText, padding, 78 + lineIndex * 22);
    });
  }
}
