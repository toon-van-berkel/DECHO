/**
 * QTE UI for DECHO.
 *
 * Main responsibility:
 * - Runs keyboard quick-time events and reports success or failure.
 *
 * Made by: Vince
 */

import * as excalibur from 'excalibur';
import {
  drawDivider,
  drawHudPanel,
} from '../../components/ui/hud-drawing';
import { mapRenderSize } from '../../core/engine/engine-config';
import { THEME, withAlpha } from '../../core/theme/theme-index';
import * as qteResult from './qte-result';
import * as qteService from './qte-service';
import type * as qteTypes from './qte-types';

const panelWidth = 620;
const panelHeight = 286;
const panelX = (mapRenderSize.width - panelWidth) / 2;
const panelY = (mapRenderSize.height - panelHeight) / 2;
const keycapSize = 54;
const keycapGap = 14;

export class QteUi extends excalibur.ScreenElement {
  private currentSequenceArray: qteTypes.QteKeyConfig[] = [];
  private currentSequenceIndex = 0;
  private remainingTimeMs = 0;
  private totalTimeMs = 1;
  private titleText = '';
  private promptText = '';
  private successText = '';
  private failText = '';
  private resultText = '';
  private resultDisplayRemainingMs = 0;
  private pendingResult?: qteTypes.QteResult;
  private onFinished?: (result: qteTypes.QteResult) => void;

  constructor() {
    super({ x: panelX, y: panelY, width: panelWidth, height: panelHeight, z: 200 });

    this.graphics.use(
      new excalibur.Canvas({
        width: panelWidth,
        height: panelHeight,
        cache: false,
        smoothing: true,
        draw: (context) => this.drawPanel(context),
      }),
    );
  }

  start(
    qteRunConfig: qteTypes.QteRunConfig,
    onFinished: (result: qteTypes.QteResult) => void,
  ): void {
    this.currentSequenceArray = qteService.createQteSequence(
      qteRunConfig.sequenceLength,
    );
    this.currentSequenceIndex = 0;
    this.remainingTimeMs = qteRunConfig.timeLimitMs;
    this.totalTimeMs = qteRunConfig.timeLimitMs;
    this.titleText = qteRunConfig.title;
    this.promptText = qteRunConfig.prompt;
    this.successText = qteRunConfig.successText;
    this.failText = qteRunConfig.failText;
    this.pendingResult = undefined;
    this.onFinished = onFinished;
  }

  override onPreUpdate(engine: excalibur.Engine, elapsedMs: number): void {
    if (!this.onFinished) {
      return;
    }

    if (this.pendingResult) {
      this.resultDisplayRemainingMs -= elapsedMs;
      if (this.resultDisplayRemainingMs <= 0) {
        const finishedCallback = this.onFinished;
        const finishedResult = this.pendingResult;
        this.onFinished = undefined;
        this.pendingResult = undefined;
        finishedCallback(finishedResult);
      }
      return;
    }

    this.remainingTimeMs -= elapsedMs;
    if (this.remainingTimeMs <= 0) {
      this.finish(false);
      return;
    }

    this.handleInput(engine);
  }

  private handleInput(engine: excalibur.Engine): void {
    const pressedKey = qteService.qteKeysArray.find((keyConfig) =>
      engine.input.keyboard.wasPressed(keyConfig.key),
    );

    if (!pressedKey) {
      return;
    }

    const expectedKey = this.currentSequenceArray[this.currentSequenceIndex];
    if (pressedKey.key !== expectedKey?.key) {
      this.finish(false);
      return;
    }

    this.currentSequenceIndex += 1;
    if (this.currentSequenceIndex >= this.currentSequenceArray.length) {
      this.finish(true);
    }
  }

  private drawPanel(context: CanvasRenderingContext2D): void {
    const timeRatio = Math.max(this.remainingTimeMs / this.totalTimeMs, 0);
    const timerWidth = panelWidth - 64;
    const keycapRowWidth =
      this.currentSequenceArray.length * keycapSize +
      (this.currentSequenceArray.length - 1) * keycapGap;
    const keycapStartX = (panelWidth - keycapRowWidth) / 2;

    context.clearRect(0, 0, panelWidth, panelHeight);
    drawHudPanel(context, panelWidth, panelHeight, THEME.accent.violet);

    if (this.pendingResult) {
      const accentColor = this.pendingResult.isSuccess
        ? THEME.accent.green
        : THEME.accent.red;
      context.textAlign = 'center';
      context.textBaseline = 'alphabetic';
      context.fillStyle = accentColor;
      context.font = `900 30px ${THEME.font.heading}`;
      context.fillText(
        this.pendingResult.isSuccess ? 'GESLAAGD' : 'MISLUKT',
        panelWidth / 2,
        96,
      );
      drawDivider(context, 72, 120, panelWidth - 144);
      context.fillStyle = THEME.color.softText;
      context.font = `400 16px ${THEME.font.body}`;
      context.fillText(this.resultText, panelWidth / 2, 168, panelWidth - 100);
      context.fillStyle = THEME.color.muted;
      context.font = `700 12px ${THEME.font.label}`;
      context.fillText('TERUG NAAR HET VERHAAL...', panelWidth / 2, 222);
      return;
    }

    context.textAlign = 'center';
    context.textBaseline = 'alphabetic';
    context.fillStyle = THEME.accent.violet;
    context.font = `900 25px ${THEME.font.heading}`;
    context.fillText(this.titleText.toUpperCase(), panelWidth / 2, 44);

    context.fillStyle = THEME.color.softText;
    context.font = `400 14px ${THEME.font.body}`;
    context.fillText(this.promptText, panelWidth / 2, 76, panelWidth - 80);

    drawDivider(context, 32, 96, panelWidth - 64);

    this.currentSequenceArray.forEach((keyConfig, keyIndex) => {
      this.drawKeycap(
        context,
        keyConfig.label,
        keycapStartX + keyIndex * (keycapSize + keycapGap),
        124,
        keyIndex,
      );
    });

    context.beginPath();
    context.roundRect(32, 218, timerWidth, 10, 5);
    context.fillStyle = withAlpha(THEME.color.bg, 0.72);
    context.fill();

    context.beginPath();
    context.roundRect(32, 218, timerWidth * timeRatio, 10, 5);
    context.fillStyle =
      timeRatio > 0.35 ? THEME.accent.cyan : THEME.accent.red;
    context.fill();

    context.textAlign = 'center';
    context.fillStyle = THEME.color.muted;
    context.font = `700 15px ${THEME.font.label}`;
    context.fillText(
      `${Math.max(this.remainingTimeMs / 1000, 0).toFixed(1)}s`,
      panelWidth / 2,
      254,
    );
  }

  private drawKeycap(
    context: CanvasRenderingContext2D,
    label: string,
    x: number,
    y: number,
    keyIndex: number,
  ): void {
    const isComplete = keyIndex < this.currentSequenceIndex;
    const isCurrent = keyIndex === this.currentSequenceIndex;
    const fillColor = isComplete
      ? withAlpha(THEME.accent.green, 0.16)
      : isCurrent
        ? withAlpha(THEME.accent.violet, 0.24)
        : withAlpha(THEME.color.bg, 0.66);
    const strokeColor = isComplete
      ? THEME.accent.green
      : isCurrent
        ? THEME.accent.violet
        : THEME.color.border;

    context.beginPath();
    context.roundRect(x, y, keycapSize, keycapSize, THEME.shape.buttonRadius);
    context.shadowColor = strokeColor;
    context.shadowBlur = isCurrent ? 16 : 0;
    context.fillStyle = fillColor;
    context.fill();
    context.shadowBlur = 0;
    context.lineWidth = isCurrent ? 2 : 1.25;
    context.strokeStyle = strokeColor;
    context.stroke();

    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = isComplete ? THEME.accent.green : THEME.color.text;
    context.font = `900 30px ${THEME.font.heading}`;
    context.fillText(label, x + keycapSize / 2, y + keycapSize / 2 + 1);
  }

  private finish(isSuccess: boolean): void {
    this.pendingResult = qteResult.createQteResult(
      isSuccess,
      this.remainingTimeMs,
    );
    this.resultText = isSuccess ? this.successText : this.failText;
    this.resultDisplayRemainingMs = 1400;
  }
}
