import * as excalibur from 'excalibur';
import { UiButton } from '../../components/ui/button';
import {
  drawDivider,
  drawHudPanel,
  wrapText,
} from '../../components/ui/hud-drawing';
import { mapRenderSize } from '../../core/engine/engine-config';
import { THEME, withAlpha } from '../../core/theme/theme-index';
import * as storyService from '../../features/story/story-service';
import type * as storyTypes from '../../features/story/story-types';

type EndingOutcome = {
  resultLabel: 'SUCCESS' | 'NEUTRAL' | 'FAILED';
  title: string;
  body: string;
  accent: string;
};

const requiredSkillCount = 5;
const panel = {
  x: 230,
  y: 92,
  width: 820,
  height: 476,
};

export class EndingScene extends excalibur.Scene {
  private summary: storyTypes.StoryState = storyService.getStorySummary();
  private outcome: EndingOutcome = this.createOutcome(this.summary);
  private resultPanel?: excalibur.ScreenElement;

  override onInitialize(engine: excalibur.Engine): void {
    this.resultPanel = this.createResultPanel();
    this.add(this.createBackdrop());
    this.add(this.resultPanel);
    this.add(
      new UiButton({
        text: 'Return to Main Menu',
        x: 490,
        y: 594,
        width: 300,
        height: 50,
        accent: THEME.accent.cyan,
        onClick: () => engine.goToScene('mainMenu'),
      }),
    );
  }

  override onActivate(): void {
    this.summary = storyService.getStorySummary();
    this.outcome = this.createOutcome(this.summary);
  }

  private createOutcome(summary: storyTypes.StoryState): EndingOutcome {
    const securedSkillCount = new Set(summary.securedSkillsArray).size;
    const missingSkillCount = Math.max(requiredSkillCount - securedSkillCount, 0);
    const failedQteCount = summary.failedQteIdsArray.length;

    if (
      missingSkillCount >= 3 ||
      summary.dataEcho >= 80 ||
      failedQteCount >= 3
    ) {
      return {
        resultLabel: 'FAILED',
        title: 'FAILED - Het systeem sluit zich',
        accent: THEME.accent.red,
        body: 'De Toren herkent je spoor voordat de stad kan ademhalen. De Firewall trekt de routes dicht en de stemmen die je volgden verdwijnen achter nieuw glas.',
      };
    }

    if (
      securedSkillCount >= requiredSkillCount &&
      summary.dataEcho <= 60 &&
      failedQteCount <= 1
    ) {
      return {
        resultLabel: 'SUCCESS',
        title: 'SUCCESS - De stad valt stil',
        accent: THEME.accent.green,
        body: 'De Firewall zakt zonder meteen terug te bijten. Beneden vallen de schermen uit, en voor het eerst klinkt Nova City alsof niemand haar bevelen geeft.',
      };
    }

    return {
      resultLabel: 'NEUTRAL',
      title: 'NEUTRAL - De Firewall breekt, maar onthoudt je naam',
      accent: THEME.accent.amber,
      body: 'De poort geeft mee, maar niet schoon. De stad ziet een opening en een spoor tegelijk. Wat jij hebt losgemaakt, zal blijven zoeken naar degene die begon.',
    };
  }

  private createBackdrop(): excalibur.ScreenElement {
    const backdropElement = new excalibur.ScreenElement({
      x: 0,
      y: 0,
      width: mapRenderSize.width,
      height: mapRenderSize.height,
      z: 0,
    });

    backdropElement.graphics.use(
      new excalibur.Canvas({
        width: mapRenderSize.width,
        height: mapRenderSize.height,
        cache: true,
        smoothing: true,
        draw: (context) => {
          context.fillStyle = THEME.color.bg;
          context.fillRect(0, 0, mapRenderSize.width, mapRenderSize.height);

          const gradient = context.createRadialGradient(
            640,
            290,
            90,
            640,
            290,
            540,
          );
          gradient.addColorStop(0, withAlpha(THEME.accent.violet, 0.18));
          gradient.addColorStop(0.46, withAlpha(THEME.accent.cyan, 0.08));
          gradient.addColorStop(1, withAlpha(THEME.color.bg, 0));
          context.fillStyle = gradient;
          context.fillRect(0, 0, mapRenderSize.width, mapRenderSize.height);

          context.strokeStyle = withAlpha(THEME.accent.cyan, 0.1);
          context.lineWidth = 1;
          for (let x = 0; x <= mapRenderSize.width; x += 96) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, mapRenderSize.height);
            context.stroke();
          }
          for (let y = 0; y <= mapRenderSize.height; y += 72) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(mapRenderSize.width, y);
            context.stroke();
          }
        },
      }),
    );

    return backdropElement;
  }

  private createResultPanel(): excalibur.ScreenElement {
    const panelElement = new excalibur.ScreenElement({
      x: panel.x,
      y: panel.y,
      width: panel.width,
      height: panel.height,
      z: 20,
    });

    panelElement.graphics.use(
      new excalibur.Canvas({
        width: panel.width,
        height: panel.height,
        cache: false,
        smoothing: true,
        draw: (context) => this.drawResult(context),
      }),
    );

    return panelElement;
  }

  private drawResult(context: CanvasRenderingContext2D): void {
    const securedSkillCount = new Set(this.summary.securedSkillsArray).size;
    const completedQteCount = this.summary.completedQteIdsArray.length;
    const failedQteCount = this.summary.failedQteIdsArray.length;
    const bodyLinesArray = wrapText(this.outcome.body, 74);

    context.clearRect(0, 0, panel.width, panel.height);
    drawHudPanel(context, panel.width, panel.height, this.outcome.accent);

    context.textAlign = 'center';
    context.textBaseline = 'alphabetic';
    context.fillStyle = this.outcome.accent;
    context.font = `900 28px ${THEME.font.heading}`;
    context.fillText(
      this.outcome.title.toUpperCase(),
      panel.width / 2,
      62,
      panel.width - 90,
    );

    context.beginPath();
    context.roundRect(panel.width / 2 - 78, 86, 156, 34, THEME.shape.buttonRadius);
    context.fillStyle = withAlpha(this.outcome.accent, 0.18);
    context.fill();
    context.lineWidth = 1.5;
    context.strokeStyle = this.outcome.accent;
    context.stroke();
    context.fillStyle = this.outcome.accent;
    context.font = `900 18px ${THEME.font.heading}`;
    context.fillText(this.outcome.resultLabel, panel.width / 2, 110);

    context.fillStyle = THEME.color.softText;
    context.font = `400 17px ${THEME.font.body}`;
    bodyLinesArray.forEach((line, lineIndex) => {
      context.fillText(line, panel.width / 2, 154 + lineIndex * 28);
    });

    drawDivider(context, 60, 252, panel.width - 120);

    context.textAlign = 'left';
    context.fillStyle = THEME.color.text;
    context.font = `800 18px ${THEME.font.heading}`;
    context.fillText('SIGNAL SUMMARY', 76, 296);

    context.font = `700 15px ${THEME.font.body}`;
    context.fillStyle = THEME.color.softText;
    context.fillText(`Data Echo: ${this.summary.dataEcho}`, 76, 336);
    context.fillText(
      `Secured skills: ${securedSkillCount}/${requiredSkillCount}`,
      76,
      368,
    );
    context.fillText(`Completed QTE: ${completedQteCount}`, 76, 400);
    context.fillText(`Failed QTE: ${failedQteCount}`, 76, 432);

    context.textAlign = 'right';
    context.fillStyle = withAlpha(this.outcome.accent, 0.88);
    context.font = `700 13px ${THEME.font.label}`;
    context.fillText('END OF ROUTE', panel.width - 76, 432);
  }
}
