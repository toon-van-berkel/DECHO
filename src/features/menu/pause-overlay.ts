/**
 * Pause overlay for DECHO.
 *
 * Main responsibility:
 * - Shows the Escape pause menu (Resume / Settings / Back to menu) in gameplay.
 *
 * Made by: Richie
 *
 * Styled to match the main menu. Added to gameplay scenes; toggled by Escape.
 */

import * as excalibur from 'excalibur';
import { UiButton } from '../../components/ui/button';
import { drawHudPanel } from '../../components/ui/hud-drawing';
import { mapRenderSize } from '../../core/engine/engine-config';
import { THEME, withAlpha } from '../../core/theme/theme-index';
import { SettingsPanel } from './settings-panel';

const SCREEN_WIDTH = mapRenderSize.width;
const SCREEN_HEIGHT = mapRenderSize.height;

const CARD_WIDTH = 420;
const CARD_HEIGHT = 300;
const CARD_X = (SCREEN_WIDTH - CARD_WIDTH) / 2;
const CARD_Y = (SCREEN_HEIGHT - CARD_HEIGHT) / 2;
const CENTER_X = CARD_X + CARD_WIDTH / 2;

const BUTTON_WIDTH = 280;
const BUTTON_HEIGHT = 50;
const BUTTON_GAP = 16;
const BUTTON_START_Y = CARD_Y + 92;

const BACKDROP_Z = 250;
const BUTTON_Z = 260;

export class PauseOverlay extends excalibur.ScreenElement {
  private isPaused = false;
  private readonly settingsPanel: SettingsPanel;
  private readonly resumeButton: UiButton;
  private readonly settingsButton: UiButton;
  private readonly backButton: UiButton;
  private readonly menuButtonsArray: UiButton[];

  constructor(private readonly onBackToMenu: () => void) {
    super({
      x: 0,
      y: 0,
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      z: BACKDROP_Z,
    });

    this.graphics.use(
      new excalibur.Canvas({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        cache: false,
        smoothing: true,
        draw: (context) => this.drawOverlay(context),
      }),
    );

    this.resumeButton = new UiButton({
      text: 'Hervatten',
      x: CENTER_X - BUTTON_WIDTH / 2,
      y: BUTTON_START_Y,
      width: BUTTON_WIDTH,
      height: BUTTON_HEIGHT,
      accent: THEME.accent.cyan,
      z: BUTTON_Z,
      onClick: () => this.hide(),
    });

    this.settingsButton = new UiButton({
      text: 'Instellingen',
      x: CENTER_X - BUTTON_WIDTH / 2,
      y: BUTTON_START_Y + (BUTTON_HEIGHT + BUTTON_GAP),
      width: BUTTON_WIDTH,
      height: BUTTON_HEIGHT,
      accent: THEME.accent.amber,
      z: BUTTON_Z,
      onClick: () => this.openSettings(),
    });

    this.backButton = new UiButton({
      text: 'Terug naar menu',
      x: CENTER_X - BUTTON_WIDTH / 2,
      y: BUTTON_START_Y + 2 * (BUTTON_HEIGHT + BUTTON_GAP),
      width: BUTTON_WIDTH,
      height: BUTTON_HEIGHT,
      accent: THEME.accent.red,
      z: BUTTON_Z,
      onClick: () => this.onBackToMenu(),
    });

    this.menuButtonsArray = [
      this.resumeButton,
      this.settingsButton,
      this.backButton,
    ];

    this.settingsPanel = new SettingsPanel(() => this.closeSettings());
  }

  override onInitialize(): void {
    this.menuButtonsArray.forEach((button) => this.addChild(button));
    this.addChild(this.settingsPanel);

    this.on('pointerup', (event) => {
      if (this.isPaused) {
        event.cancel();
      }
    });
    this.on('pointerdown', (event) => {
      if (this.isPaused) {
        event.cancel();
      }
    });

    this.hide();
  }

  isPausedNow(): boolean {
    return this.isPaused;
  }

  toggle(): void {
    if (this.isPaused) {
      this.hide();
    } else {
      this.show();
    }
  }

  show(): void {
    this.isPaused = true;
    this.graphics.isVisible = true;
    this.pointer.useGraphicsBounds = true;
    this.settingsPanel.close();
    this.menuButtonsArray.forEach((button) => button.setEnabled(true));
  }

  hide(): void {
    this.isPaused = false;
    this.graphics.isVisible = false;
    this.pointer.useGraphicsBounds = false;
    this.settingsPanel.close();
    this.menuButtonsArray.forEach((button) => button.setEnabled(false));
  }

  private openSettings(): void {
    this.menuButtonsArray.forEach((button) => button.setEnabled(false));
    this.settingsPanel.open();
  }

  private closeSettings(): void {
    this.settingsPanel.close();
    if (this.isPaused) {
      this.menuButtonsArray.forEach((button) => button.setEnabled(true));
    }
  }

  private drawOverlay(context: CanvasRenderingContext2D): void {
    context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    context.fillStyle = withAlpha(THEME.color.bg, 0.7);
    context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    context.save();
    context.translate(CARD_X, CARD_Y);
    drawHudPanel(context, CARD_WIDTH, CARD_HEIGHT, THEME.accent.cyan);

    context.textAlign = 'center';
    context.textBaseline = 'alphabetic';
    context.fillStyle = THEME.color.text;
    context.font = `900 34px ${THEME.font.heading}`;
    context.fillText('GEPAUZEERD', CARD_WIDTH / 2, 56);

    context.fillStyle = THEME.color.muted;
    context.font = `700 12px ${THEME.font.label}`;
    context.fillText('SIGNAALROUTING ONDERBROKEN', CARD_WIDTH / 2, 78);
    context.restore();
  }
}
