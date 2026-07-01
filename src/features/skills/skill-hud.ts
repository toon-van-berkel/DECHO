/**
 * Skill HUD for DECHO.
 *
 * Main responsibility:
 * - Shows secured skills from story progress.
 *
 * Made by: Richie
 */

import * as excalibur from 'excalibur';
import {
  drawDivider,
  drawHudPanel,
} from '../../components/ui/hud-drawing';
import { mapRenderSize } from '../../core/engine/engine-config';
import { THEME, withAlpha } from '../../core/theme/theme-index';
import * as storyService from '../story/story-service';

type SkillSlotConfig = {
  id: string;
  label: string;
  accent: string;
  shape: 'triangle' | 'circle' | 'square' | 'diamond' | 'hexagon';
};

const skillSlotsArray: SkillSlotConfig[] = [
  {
    id: 'patrol_prediction',
    label: 'PAT',
    accent: THEME.accent.cyan,
    shape: 'triangle',
  },
  {
    id: 'route_navigation',
    label: 'RTE',
    accent: THEME.accent.magenta,
    shape: 'circle',
  },
  {
    id: 'hardware_hacking',
    label: 'HW',
    accent: THEME.accent.amber,
    shape: 'square',
  },
  {
    id: 'data_defragmentation',
    label: 'DEF',
    accent: THEME.accent.green,
    shape: 'diamond',
  },
  {
    id: 'firewall_bypass',
    label: 'FW',
    accent: THEME.accent.violet,
    shape: 'hexagon',
  },
];

const panelWidth = 342;
const panelHeight = 112;
const iconSize = 38;
const iconGap = 10;
const panelX = mapRenderSize.width - panelWidth - 34;
const panelY = mapRenderSize.height - panelHeight - 58;

export class SkillHud extends excalibur.ScreenElement {
  constructor() {
    super({
      x: panelX,
      y: panelY,
      width: panelWidth,
      height: panelHeight,
      z: 90,
    });

    this.graphics.use(
      new excalibur.Canvas({
        width: panelWidth,
        height: panelHeight,
        cache: false,
        smoothing: true,
        draw: (context) => this.drawHud(context),
      }),
    );
  }

  private drawHud(context: CanvasRenderingContext2D): void {
    const currentStoryState = storyService.getStorySummary();
    const securedSkillsArray = currentStoryState.securedSkillsArray;
    const ownedCount = securedSkillsArray.length;

    context.clearRect(0, 0, panelWidth, panelHeight);
    drawHudPanel(context, panelWidth, panelHeight, THEME.accent.green);

    context.textAlign = 'left';
    context.textBaseline = 'alphabetic';
    context.fillStyle = THEME.color.text;
    context.font = `800 15px ${THEME.font.heading}`;
    context.fillText('VAARDIGHEDEN', 18, 28);

    context.textAlign = 'right';
    context.fillStyle = THEME.color.muted;
    context.font = `700 11px ${THEME.font.label}`;
    context.fillText(
      `${ownedCount}/${skillSlotsArray.length} BEVEILIGD`,
      panelWidth - 18,
      28,
    );

    drawDivider(context, 18, 40, panelWidth - 36);

    skillSlotsArray.forEach((skillSlot, skillIndex) => {
      const x = 18 + skillIndex * (iconSize + iconGap);
      const y = 54;
      const hasSkill = securedSkillsArray.includes(skillSlot.id);
      this.drawSkillSlot(context, skillSlot, x, y, hasSkill);
    });

    if (ownedCount === 0) {
      context.textAlign = 'right';
      context.fillStyle = THEME.color.muted;
      context.font = `700 10px ${THEME.font.label}`;
      context.fillText('GEEN ACTIEVE VAARDIGHEDEN', panelWidth - 18, 84);
    }
  }

  private drawSkillSlot(
    context: CanvasRenderingContext2D,
    skillSlot: SkillSlotConfig,
    x: number,
    y: number,
    hasSkill: boolean,
  ): void {
    context.beginPath();
    context.roundRect(x, y, iconSize, iconSize, THEME.shape.buttonRadius);
    context.fillStyle = hasSkill
      ? withAlpha(skillSlot.accent, 0.14)
      : withAlpha(THEME.color.bg, 0.55);
    context.fill();
    context.lineWidth = hasSkill ? 1.5 : 1;
    context.strokeStyle = hasSkill ? skillSlot.accent : THEME.color.border;
    if (!hasSkill) {
      context.setLineDash([3, 3]);
    }
    context.stroke();
    context.setLineDash([]);

    if (hasSkill) {
      context.shadowColor = skillSlot.accent;
      context.shadowBlur = 8;
      this.drawSkillShape(context, skillSlot, x, y);
      context.shadowBlur = 0;
      return;
    }

    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = withAlpha(THEME.color.text, 0.22);
    context.font = `700 14px ${THEME.font.body}`;
    context.fillText('?', x + iconSize / 2, y + iconSize / 2);
  }

  private drawSkillShape(
    context: CanvasRenderingContext2D,
    skillSlot: SkillSlotConfig,
    x: number,
    y: number,
  ): void {
    const centerX = x + iconSize / 2;
    const centerY = y + iconSize / 2 - 1;
    const radius = 11;

    context.beginPath();
    switch (skillSlot.shape) {
      case 'triangle':
        context.moveTo(centerX, centerY - radius);
        context.lineTo(centerX + radius, centerY + radius);
        context.lineTo(centerX - radius, centerY + radius);
        context.closePath();
        break;
      case 'circle':
        context.arc(centerX, centerY, radius, 0, Math.PI * 2);
        break;
      case 'square':
        context.roundRect(centerX - radius, centerY - radius, radius * 2, radius * 2, 3);
        break;
      case 'diamond':
        context.moveTo(centerX, centerY - radius);
        context.lineTo(centerX + radius, centerY);
        context.lineTo(centerX, centerY + radius);
        context.lineTo(centerX - radius, centerY);
        context.closePath();
        break;
      case 'hexagon':
        for (let pointIndex = 0; pointIndex < 6; pointIndex += 1) {
          const angle = (Math.PI / 3) * pointIndex - Math.PI / 6;
          const pointX = centerX + radius * Math.cos(angle);
          const pointY = centerY + radius * Math.sin(angle);
          if (pointIndex === 0) {
            context.moveTo(pointX, pointY);
          } else {
            context.lineTo(pointX, pointY);
          }
        }
        context.closePath();
        break;
    }

    context.strokeStyle = skillSlot.accent;
    context.lineWidth = 2;
    context.stroke();

    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = skillSlot.accent;
    context.font = `800 8px ${THEME.font.label}`;
    context.fillText(skillSlot.label, centerX, y + iconSize + 10);
  }
}
