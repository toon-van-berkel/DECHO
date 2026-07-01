/**
 * Compact level and timer HUD for the city map.
 *
 * Made by: Toon van Berkel
 */

import * as excalibur from 'excalibur';
import { drawDivider, drawHudPanel } from '../../components/ui/hud-drawing';
import { mapRenderSize } from '../../core/engine/engine-config';
import { THEME } from '../../core/theme/theme-index';
import * as storyState from '../story/story-state';
import * as runTimerService from '../timer/run-timer-service';
import { levelsArray } from './level-data';
import * as levelService from './level-service';

const width = 342;
const height = 360;

export class LevelProgressHud extends excalibur.ScreenElement {
  constructor() {
    super({
      x: mapRenderSize.width - width - 34,
      y: 34,
      width,
      height,
      z: 90,
    });
    this.graphics.use(
      new excalibur.Canvas({
        width,
        height,
        cache: false,
        draw: (context) => this.drawHud(context),
      }),
    );
  }

  private drawHud(context: CanvasRenderingContext2D): void {
    const completedCount = levelService.getCompletedLevelCount();
    context.clearRect(0, 0, width, height);
    drawHudPanel(context, width, height, THEME.accent.magenta);
    context.textAlign = 'left';
    context.fillStyle = THEME.color.text;
    context.font = `800 15px ${THEME.font.heading}`;
    context.fillText('ONDERZOEKSROUTE', 18, 25);
    context.textAlign = 'right';
    context.fillStyle = THEME.accent.magenta;
    context.fillText(
      `${completedCount}/${levelsArray.length} ONDERDELEN`,
      width - 18,
      48,
    );
    drawDivider(context, 18, 58, width - 36);
    context.textAlign = 'left';
    context.fillStyle = THEME.color.softText;
    context.font = `700 16px ${THEME.font.body}`;
    context.fillText(
      `TIJD ${runTimerService.formatRunTime(runTimerService.getCurrentRunTimeMs())}`,
      18,
      82,
    );
    drawDivider(context, 18, 94, width - 36);
    const completedIdsArray = storyState.getStoryState().completedLevelIdsArray;
    levelsArray.forEach((level, levelIndex) => {
      const y = 117 + levelIndex * 21;
      const isCompleted = completedIdsArray.includes(level.id);
      context.textAlign = 'left';
      context.fillStyle = isCompleted ? THEME.color.softText : THEME.color.muted;
      context.font = `700 10px ${THEME.font.label}`;
      context.fillText(
        level.title,
        18,
        y,
        250,
      );
      context.textAlign = 'right';
      context.fillStyle = isCompleted ? THEME.accent.green : THEME.color.muted;
      context.fillText(isCompleted ? 'VOLTOOID' : 'OPEN', width - 18, y);
    });
    context.fillStyle = THEME.color.muted;
    context.font = `700 11px ${THEME.font.label}`;
    context.textAlign = 'left';
    context.fillText('ELKE KEUZE LAAT EEN DATASPOOR ACHTER', 18, 340);
  }
}
