/**
 * Local scoreboard panel for the main menu.
 *
 * Made by: Toon van Berkel
 */

import * as excalibur from 'excalibur';
import { drawDivider, drawHudPanel, wrapText } from '../../components/ui/hud-drawing';
import { THEME } from '../../core/theme/theme-index';
import * as runTimerService from '../timer/run-timer-service';

const width = 370;
const height = 480;

const officialScoresArray = [
  { place: 1, name: 'Toon', time: '03:42.318' },
  { place: 2, name: 'Vince', time: '04:06.901' },
  { place: 3, name: 'Casper', time: '04:21.447' },
  { place: 4, name: 'Richie', time: '04:37.882' },
  { place: 5, name: 'Liam', time: '04:54.120' },
];

export class ScoreboardPanel extends excalibur.ScreenElement {
  constructor() {
    super({ x: 876, y: 112, width, height, z: 20 });
    this.graphics.use(
      new excalibur.Canvas({
        width,
        height,
        cache: false,
        draw: (context) => this.drawPanel(context),
      }),
    );
  }

  private drawPanel(context: CanvasRenderingContext2D): void {
    const bestTimeMs = runTimerService.getBestTimeMs();
    const lastRunTimeMs = runTimerService.getLastRunTimeMs();

    context.clearRect(0, 0, width, height);
    drawHudPanel(context, width, height, THEME.accent.magenta);
    context.textAlign = 'left';
    context.fillStyle = THEME.accent.magenta;
    context.font = `900 24px ${THEME.font.heading}`;
    context.fillText('OFFICIEEL SCOREBORD', 22, 38);
    context.fillStyle = THEME.color.softText;
    context.font = `700 11px ${THEME.font.label}`;
    context.fillText('VERSLA DE OFFICIËLE TIJDEN', 22, 61);
    drawDivider(context, 22, 76, width - 44);

    context.fillStyle = THEME.color.muted;
    context.font = `700 11px ${THEME.font.label}`;
    context.fillText('PLAATS', 22, 100);
    context.fillText('NAAM', 96, 100);
    context.textAlign = 'right';
    context.fillText('TIJD', width - 22, 100);

    officialScoresArray.forEach((score, index) => {
      const y = 126 + index * 25;
      context.textAlign = 'left';
      context.fillStyle = index === 0 ? THEME.accent.amber : THEME.color.softText;
      context.font = `700 13px ${THEME.font.body}`;
      context.fillText(String(score.place), 22, y);
      context.fillText(score.name, 96, y);
      context.textAlign = 'right';
      context.fillText(score.time, width - 22, y);
    });

    drawDivider(context, 22, 264, width - 44);

    context.textAlign = 'left';
    context.fillStyle = THEME.color.muted;
    context.font = `700 12px ${THEME.font.label}`;
    context.fillText('BESTE LOKALE SPEEDRUN', 22, 292);
    context.fillText('LAATSTE RUN', 210, 292);
    context.fillStyle = THEME.color.text;
    context.font = `800 18px ${THEME.font.body}`;
    context.fillText(runTimerService.formatRunTime(bestTimeMs), 22, 320);
    context.fillText(runTimerService.formatRunTime(lastRunTimeMs), 210, 320);

    context.fillStyle = THEME.accent.amber;
    context.font = `700 11px ${THEME.font.label}`;
    context.fillText('KUN JIJ ONDER DE 5 MINUTEN BLIJVEN?', 22, 348);
    drawDivider(context, 22, 364, width - 44);

    const instruction =
      'Wil je op het officiële scorebord komen? Speel de game uit binnen 5 minuten, neem je volledige run op en stuur je schermopname naar toonvanberkel.public@gmail.com. Na controle kan je tijd handmatig worden toegevoegd.';
    context.fillStyle = THEME.color.softText;
    context.font = `400 12px ${THEME.font.body}`;
    wrapText(instruction, 47).slice(0, 6).forEach((line, index) => {
      context.fillText(line, 22, 392 + index * 15);
    });
  }
}
