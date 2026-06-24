import { Canvas, ScreenElement } from 'excalibur';
import { THEME, themeColorHex } from '../../../core/theme';
import { gameState } from '../../../core/game-state';
import type { SkillConfig, SkillShape } from './skill-inventory-config';

export const ICON_SIZE = 40;

// ─── Shape drawing ────────────────────────────────────────────────────────────

function drawShape(
  ctx: CanvasRenderingContext2D,
  shape: SkillShape,
  size: number,
  color: string,
): void {
  const pad = 10;
  const cx = size / 2;
  const cy = size / 2;

  ctx.beginPath();
  switch (shape) {
    case 'triangle':
      ctx.moveTo(cx, pad);
      ctx.lineTo(size - pad, size - pad);
      ctx.lineTo(pad, size - pad);
      ctx.closePath();
      break;
    case 'circle':
      ctx.arc(cx, cy, cx - pad, 0, Math.PI * 2);
      break;
    case 'square':
      ctx.roundRect(pad, pad, size - pad * 2, size - pad * 2, 3);
      break;
    case 'diamond':
      ctx.moveTo(cx, pad);
      ctx.lineTo(size - pad, cy);
      ctx.lineTo(cx, size - pad);
      ctx.lineTo(pad, cy);
      ctx.closePath();
      break;
    case 'hexagon': {
      const r = cx - pad;
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      break;
    }
  }

  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.stroke();
}

// ─── Skill Icon ───────────────────────────────────────────────────────────────

/**
 * A single skill slot. Purely visual: there is no hover or per-slot tooltip —
 * the shared classified status in the HUD footer carries that meaning for all
 * slots at once. Two states:
 *   • empty     → dashed border + `?`
 *   • classified→ ghost shape under a red overlay + `▓▓`
 */
export class SkillIcon extends ScreenElement {
  constructor(
    private readonly config: SkillConfig,
    position: { x: number; y: number },
  ) {
    super({ x: position.x, y: position.y, width: ICON_SIZE, height: ICON_SIZE, z: 51 });
    this.graphics.use(
      new Canvas({
        width: ICON_SIZE,
        height: ICON_SIZE,
        cache: false,
        smoothing: true,
        draw: (ctx) => this.draw(ctx),
      }),
    );
  }

  private draw(ctx: CanvasRenderingContext2D): void {
    const size = ICON_SIZE;
    const owned = gameState.hasSkill(this.config.id);

    ctx.clearRect(0, 0, size, size);

    if (!owned) {
      // Empty slot: dashed border + ?
      ctx.beginPath();
      ctx.roundRect(1, 1, size - 2, size - 2, 6);
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = THEME.color.border;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.font = `400 16px ${THEME.font.body}`;
      ctx.fillText('?', size / 2, size / 2);
      return;
    }

    // Classified state: the skill's shape sits as a ghost behind a red overlay
    // and a semi-transparent ▓▓ glyph, so the figure stays just barely readable.
    // Content is nudged up a couple px so shapes read as optically centred
    // (a base-heavy triangle otherwise looks like it sinks to the bottom).
    const lift = 2;

    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.translate(0, -lift);
    drawShape(ctx, this.config.shape, size, themeColorHex(this.config.theme));
    ctx.restore();

    ctx.beginPath();
    ctx.roundRect(1, 1, size - 2, size - 2, 6);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.10)';
    ctx.fill();

    ctx.beginPath();
    ctx.roundRect(1, 1, size - 2, size - 2, 6);
    ctx.shadowColor = THEME.accent.red;
    ctx.shadowBlur = 8;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = THEME.accent.red;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Classified glyph, kept semi-transparent so the ghost shape peeks through.
    ctx.save();
    ctx.globalAlpha = 0.65;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = THEME.accent.red;
    ctx.font = `900 13px ${THEME.font.heading}`;
    ctx.fillText('▓▓', size / 2, size / 2 - lift);
    ctx.restore();
  }
}
