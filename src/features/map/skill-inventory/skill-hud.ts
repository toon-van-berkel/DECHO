import { Canvas, Engine, ScreenElement } from 'excalibur';
import { GAME_WIDTH } from '../../../core/config';
import { THEME } from '../../../core/theme';
import { gameState } from '../../../core/game-state';
import { PanelButton } from '../info-panel/panel-button';
import { SKILLS } from './skill-inventory-config';
import { SkillIcon, ICON_SIZE } from './skill-icon';

// ─── Layout ─────────────────────────────────────────────────────────────────
// One source of truth per dimension; the panel's screen position is derived
// solely from PANEL_X / PANEL_Y, so re-anchoring the whole HUD (corner, margin)
// is a one-line change and never drifts between the frame, the icons and the
// test button.

const MARGIN = 16; // gap from the nearest screen corner
const PADDING = 14; // inner panel padding
const ICON_GAP = 8; // gap between icon slots
const HEADER_H = 18; // header row height
const HEADER_GAP = 12; // gap between header divider and the slot row
const FOOTER_GAP = 14; // gap between the slot row and the status footer
const FOOTER_H = 12; // footer row height

const SLOT_ROW_W = SKILLS.length * ICON_SIZE + (SKILLS.length - 1) * ICON_GAP;
const PANEL_W = PADDING * 2 + SLOT_ROW_W;
const PANEL_H = PADDING + HEADER_H + HEADER_GAP + ICON_SIZE + FOOTER_GAP + FOOTER_H + PADDING;

/** Top-left screen origin of the panel. Anchored top-right of the screen. */
const PANEL_X = GAME_WIDTH - MARGIN - PANEL_W;
const PANEL_Y = MARGIN;

/** Absolute screen y of the slot row. */
const SLOT_Y = PANEL_Y + PADDING + HEADER_H + HEADER_GAP;
/** Absolute screen x of the icon at grid index `i`. */
function iconX(i: number): number {
  return PANEL_X + PADDING + i * (ICON_SIZE + ICON_GAP);
}

// ─── Panel frame ──────────────────────────────────────────────────────────────

/**
 * The glass panel behind the slots: header, divider, and the single shared
 * "classified" status line that replaces per-slot tooltips. Drawn every frame
 * (cache: false) so the live skill count and the blinking warning animate.
 */
class SkillPanelFrame extends ScreenElement {
  private elapsed = 0;

  constructor() {
    super({ x: PANEL_X, y: PANEL_Y, width: PANEL_W, height: PANEL_H, z: 50 });
    this.graphics.use(
      new Canvas({
        width: PANEL_W,
        height: PANEL_H,
        cache: false,
        smoothing: true,
        draw: (ctx) => this.draw(ctx),
      }),
    );
  }

  override onPreUpdate(_engine: Engine, delta: number): void {
    this.elapsed += delta;
  }

  private draw(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, PANEL_W, PANEL_H);

    // Glass panel
    ctx.beginPath();
    ctx.roundRect(1, 1, PANEL_W - 2, PANEL_H - 2, 10);
    ctx.fillStyle = THEME.color.panelFill;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = THEME.color.border;
    ctx.stroke();

    // Header: Orbitron title
    const headerCy = PADDING + HEADER_H / 2;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = THEME.color.text;
    ctx.font = `700 13px ${THEME.font.heading}`;
    ctx.fillText('SKILLS', PADDING, headerCy + 1);

    // Divider under the header
    const dividerY = PADDING + HEADER_H + 4;
    ctx.beginPath();
    ctx.moveTo(PADDING, dividerY);
    ctx.lineTo(PANEL_W - PADDING, dividerY);
    ctx.strokeStyle = THEME.color.border;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Shared classified status (the one loader for every slot)
    const footerCy = PANEL_H - PADDING - FOOTER_H / 2;
    const blinkOn = this.elapsed % 1100 < 650;

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillStyle = blinkOn ? THEME.accent.red : 'rgba(239, 68, 68, 0.25)';
    ctx.font = `900 11px ${THEME.font.heading}`;
    ctx.fillText('⚠', PADDING, footerCy + 1);

    ctx.fillStyle = THEME.accent.red;
    ctx.font = `700 10px ${THEME.font.label}`;
    ctx.fillText('GECLASSIFICEERD', PADDING + 16, footerCy + 1);

    ctx.textAlign = 'right';
    ctx.fillStyle = THEME.color.muted;
    ctx.font = `700 10px ${THEME.font.label}`;
    ctx.fillText(
      `${gameState.getSkillCount()}/${SKILLS.length} VERSLEUTELD`,
      PANEL_W - PADDING,
      footerCy + 1,
    );
  }
}

// ─── HUD ────────────────────────────────────────────────────────────────────

export class SkillHud extends ScreenElement {
  private readonly testButton?: PanelButton;

  constructor() {
    super({ x: 0, y: 0, z: 50 });

    this.addChild(new SkillPanelFrame());

    SKILLS.forEach((skill, i) => {
      this.addChild(new SkillIcon(skill, { x: iconX(i), y: SLOT_Y }));
    });

    // Dev-only test button to mint skills from the running game; stripped from
    // production builds so players never see it.
    if (import.meta.env.DEV) {
      this.testButton = new PanelButton({
        x: PANEL_X,
        y: PANEL_Y + PANEL_H + 8,
        width: PANEL_W,
        height: 30,
        text: '+ SKILL (TEST)',
        variant: 'secondary',
        onClick: () => this.addNextSkill(),
      });
      this.addChild(this.testButton);
      this.testButton.z = 52;
    }
  }

  override onInitialize(_engine: Engine): void {
    this.testButton?.setEnabled(true);
  }

  override onPreUpdate(): void {
    if (!this.testButton) return;
    const full = gameState.getSkillCount() >= SKILLS.length;
    this.testButton.graphics.isVisible = !full;
    this.testButton.setEnabled(!full);
  }

  private addNextSkill(): void {
    const next = SKILLS.find((s) => !gameState.hasSkill(s.id));
    if (next) gameState.addSkill(next.id);
  }
}
