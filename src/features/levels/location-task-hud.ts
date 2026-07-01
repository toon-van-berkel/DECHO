/**
 * Current location task status for DECHO.
 *
 * Made by: Toon van Berkel
 */

import * as excalibur from 'excalibur';
import { drawDivider, drawHudPanel } from '../../components/ui/hud-drawing';
import { mapRenderSize } from '../../core/engine/engine-config';
import { THEME } from '../../core/theme/theme-index';
import * as storyState from '../story/story-state';
import * as levelService from './level-service';

const width = 390;
const height = 126;

export class LocationTaskHud extends excalibur.ScreenElement {
  constructor(private readonly locationId: string) {
    super({
      x: mapRenderSize.width - width - 32,
      y: 28,
      width,
      height,
      z: 95,
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
    const levelsArray = levelService.getLevelsForLocation(this.locationId);
    const completedIdsArray = storyState.getStoryState().completedLevelIdsArray;

    context.clearRect(0, 0, width, height);
    drawHudPanel(context, width, height, THEME.accent.magenta);
    context.textAlign = 'left';
    context.fillStyle = THEME.color.text;
    context.font = `800 14px ${THEME.font.heading}`;
    context.fillText('TAKEN OP DEZE LOCATIE', 18, 27);
    drawDivider(context, 18, 39, width - 36);

    levelsArray.forEach((level, index) => {
      const isCompleted = completedIdsArray.includes(level.id);
      const y = 67 + index * 30;
      context.fillStyle = isCompleted ? THEME.color.softText : THEME.color.text;
      context.font = `700 13px ${THEME.font.label}`;
      context.textAlign = 'left';
      context.fillText(level.title, 18, y, 260);
      context.textAlign = 'right';
      context.fillStyle = isCompleted ? THEME.accent.green : THEME.accent.amber;
      context.fillText(isCompleted ? 'VOLTOOID' : 'OPEN', width - 18, y);
    });
  }
}

