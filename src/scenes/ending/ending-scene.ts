/**
 * Main menu scene for DECHO.
 *
 * Main responsibility:
 * - Shows Continue / New Game / Load Game / Settings and routes them.
 *
 * Made by: Toon
 */

import * as excalibur from 'excalibur';
import { UiButton } from '../../components/ui/button';
import {
  drawDivider,
  drawHudPanel,
  wrapText,
} from '../../components/ui/hud-drawing';
import { mapRenderSize } from '../../core/engine/engine-config';
import { THEME, withAlpha } from '../../core/theme/theme-index';
import { levelsArray } from '../../features/levels/level-data';
import * as levelService from '../../features/levels/level-service';
import * as saveService from '../../features/save/save-service';
import * as storyService from '../../features/story/story-service';
import type * as storyTypes from '../../features/story/story-types';
import * as runTimerService from '../../features/timer/run-timer-service';

type EndingOutcome = {
  resultLabel: 'GEWONNEN' | 'VERLOREN';
  title: string;
  body: string;
  accent: string;
};

type EndingSceneData = {
  fromSave?: boolean;
};

const requiredSkillCount = 5;
const panel = {
  x: 230,
  y: 54,
  width: 820,
  height: 532,
};

export class EndingScene extends excalibur.Scene {
  private summary: storyTypes.StoryState = storyService.getStorySummary();
  private outcome: EndingOutcome = this.createOutcome(this.summary);
  private resultPanel?: excalibur.ScreenElement;
  private finalTimeMs = 0;
  private bestTimeMs: number | null = null;
  private loadedStatusMessage = '';

  override onInitialize(engine: excalibur.Engine): void {
    this.resultPanel = this.createResultPanel();
    this.add(this.createBackdrop());
    this.add(this.resultPanel);
    this.add(
      new UiButton({
        text: 'Terug naar hoofdmenu',
        x: 325,
        y: 594,
        width: 300,
        height: 50,
        accent: THEME.accent.cyan,
        onClick: () => engine.goToScene('mainMenu'),
      }),
    );
    this.add(
      new UiButton({
        text: 'Opnieuw spelen',
        x: 655,
        y: 594,
        width: 300,
        height: 50,
        accent: THEME.accent.green,
        onClick: () => this.startNewRun(engine),
      }),
    );
  }

  override onActivate(
    context: excalibur.SceneActivationContext<EndingSceneData>,
  ): void {
    this.summary = storyService.getStorySummary();
    if (this.summary.runStatus === 'active') {
      storyService.resolveRunStatus();
      this.summary = storyService.getStorySummary();
    }
    this.finalTimeMs = runTimerService.finishRun();
    this.bestTimeMs = runTimerService.getBestTimeMs();
    this.outcome = this.createOutcome(this.summary);
    this.loadedStatusMessage = context.data?.fromSave
      ? this.summary.runStatus === 'won'
        ? 'Deze run is al voltooid. Start een nieuwe run om opnieuw te spelen.'
        : 'Deze run is al verloren. Start een nieuwe run om opnieuw te proberen.'
      : '';
    saveService.autosave();
  }

  private createOutcome(summary: storyTypes.StoryState): EndingOutcome {
    if (summary.runStatus === 'lost') {
      return {
        resultLabel: 'VERLOREN',
        title: 'MISSIE MISLUKT',
        accent: THEME.accent.red,
        body: 'De datatoren herkent je spoor voordat je genoeg bewijs kunt veiligstellen. Je digitale echo heeft de route verraden.',
      };
    }

    return {
      resultLabel: 'GEWONNEN',
      title: 'MISSIE GESLAAGD',
      accent: THEME.accent.green,
      body: 'Je hebt de datastroom blootgelegd en genoeg bewijs verzameld. Je keuzes hebben laten zien hoeveel invloed digitale sporen kunnen hebben.',
    };
  }

  private startNewRun(engine: excalibur.Engine): void {
    const activeSlotId = saveService.getActiveSlotId();
    if (activeSlotId === null) {
      void engine.goToScene('mainMenu');
      return;
    }

    saveService.startNewGameInSlot(activeSlotId);
    void engine.goToScene('tutorial', {
      sceneActivationData: { canStartRun: true },
    });
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
    const completedLevelCount = levelService.getCompletedLevelCount();
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
      52,
      panel.width - 90,
    );

    context.beginPath();
    context.roundRect(panel.width / 2 - 78, 68, 156, 34, THEME.shape.buttonRadius);
    context.fillStyle = withAlpha(this.outcome.accent, 0.18);
    context.fill();
    context.lineWidth = 1.5;
    context.strokeStyle = this.outcome.accent;
    context.stroke();
    context.fillStyle = this.outcome.accent;
    context.font = `900 18px ${THEME.font.heading}`;
    context.fillText(this.outcome.resultLabel, panel.width / 2, 92);

    context.fillStyle = THEME.color.softText;
    context.font = `400 17px ${THEME.font.body}`;
    bodyLinesArray.forEach((line, lineIndex) => {
      context.fillText(line, panel.width / 2, 128 + lineIndex * 25);
    });

    if (this.loadedStatusMessage) {
      context.fillStyle = this.outcome.accent;
      context.font = `700 11px ${THEME.font.label}`;
      context.fillText(
        this.loadedStatusMessage,
        panel.width / 2,
        201,
        panel.width - 120,
      );
    }

    drawDivider(context, 60, 214, panel.width - 120);

    context.textAlign = 'left';
    context.fillStyle = THEME.color.text;
    context.font = `800 18px ${THEME.font.heading}`;
    context.fillText('RUNOVERZICHT', 76, 250);

    context.font = `700 15px ${THEME.font.body}`;
    context.fillStyle = THEME.color.softText;
    context.fillText(
      `Eindtijd: ${runTimerService.formatRunTime(this.finalTimeMs)}`,
      76,
      286,
    );
    context.fillText(
      `Beste speedrun: ${runTimerService.formatRunTime(this.bestTimeMs)}`,
      76,
      316,
    );
    context.fillText(
      `Onderdelen: ${completedLevelCount}/${levelsArray.length}`,
      470,
      286,
    );
    context.fillText(`Data-echo: ${this.summary.dataEcho}`, 470, 316);
    context.fillText(
      `Vaardigheden: ${securedSkillCount}/${requiredSkillCount}`,
      470,
      346,
    );

    const isValidSpeedrun = runTimerService.isScoreTimeValid(this.finalTimeMs);
    context.textAlign = 'left';
    context.fillStyle = isValidSpeedrun
      ? THEME.accent.green
      : THEME.accent.amber;
    context.font = `700 11px ${THEME.font.label}`;
    if (isValidSpeedrun) {
      context.fillText(
        'Speedrun voltooid! Je tijd telt mee voor het scorebord.',
        76,
        348,
        360,
      );
    } else {
      context.fillText('Je run duurde 5 minuten of langer.', 76, 340);
      context.fillText(
        'Speel sneller dan 5 minuten om mee te tellen.',
        76,
        356,
      );
    }

    drawDivider(context, 60, 370, panel.width - 120);
    context.textAlign = 'left';
    context.fillStyle = THEME.accent.magenta;
    context.font = `800 14px ${THEME.font.heading}`;
    context.fillText('PRIVACY-IMPACT', 76, 402);
    context.fillStyle = THEME.color.softText;
    context.font = `400 13px ${THEME.font.body}`;
    const impactText =
      'DECHO laat zien hoe snel losse digitale sporen tegen je gebruikt kunnen worden. Privacy gaat niet alleen over geheimen, maar over controle over je eigen informatie.';
    wrapText(impactText, 92).slice(0, 3).forEach((line, lineIndex) => {
      context.fillText(line, 76, 428 + lineIndex * 20);
    });

    context.fillStyle = THEME.accent.amber;
    context.font = `700 12px ${THEME.font.label}`;
    const leaderboardText =
      'Wil je op het officiële scorebord komen? Speel de game uit binnen 5 minuten, neem je volledige run op en stuur je schermopname naar toonvanberkel.public@gmail.com. Na controle kan je tijd handmatig worden toegevoegd.';
    wrapText(leaderboardText, 105).slice(0, 2).forEach((line, lineIndex) => {
      context.fillText(line, 76, 496 + lineIndex * 18);
    });

  }
}
