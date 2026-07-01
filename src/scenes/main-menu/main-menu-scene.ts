/**
 * Main menu scene for DECHO.
 *
 * Main responsibility:
 * - Shows Continue / New Game / Load Game / Settings and routes them.
 *
 * Made by: Casper
 */

import * as excalibur from 'excalibur';
import { UiButton } from '../../components/ui/button';
import { drawDivider } from '../../components/ui/hud-drawing';
import { mapRenderSize } from '../../core/engine/engine-config';
import { fadeToScene } from '../../core/navigation/navigate';
import { THEME, withAlpha } from '../../core/theme/theme-index';
import { SaveSlotPanel } from '../../features/menu/save-slot-panel';
import type { SaveSlotPanelMode } from '../../features/menu/save-slot-panel';
import { SettingsPanel } from '../../features/menu/settings-panel';
import * as saveService from '../../features/save/save-service';
import { ScoreboardPanel } from '../../features/scoreboard/scoreboard-panel';
import * as storyService from '../../features/story/story-service';
import * as runTimerService from '../../features/timer/run-timer-service';

const MENU_PANEL = { x: 430, y: 104, width: 420, height: 440 };

const BUTTON_WIDTH = 300;
const BUTTON_X = (mapRenderSize.width - BUTTON_WIDTH) / 2;
const BUTTON_HEIGHT = 46;
const BUTTON_GAP = 10;
const BUTTON_AREA_TOP = 262;
const BUTTON_AREA_HEIGHT = 262;

type MenuButtonConfig = {
  text: string;
  accent: string;
  onClick: () => void;
};

export class MainMenuScene extends excalibur.Scene {
  private slotPanel?: SaveSlotPanel;
  private settingsPanel?: SettingsPanel;
  private menuButtonsArray: UiButton[] = [];

  override onInitialize(): void {
    this.add(this.createMenuBackdrop());
    this.add(this.createHeader());
    this.add(new ScoreboardPanel());

    this.slotPanel = new SaveSlotPanel(
      (isNewGame) => this.enterGame(isNewGame),
      () => this.closePanels(),
    );
    this.settingsPanel = new SettingsPanel(() => this.closePanels());
    this.add(this.slotPanel);
    this.add(this.settingsPanel);
  }

  override onActivate(): void {
    runTimerService.pauseRun();
    this.rebuildMenuButtons();
    this.slotPanel?.close();
    this.settingsPanel?.close();
  }

  private rebuildMenuButtons(): void {
    this.menuButtonsArray.forEach((button) => this.remove(button));
    this.menuButtonsArray = [];

    const buttonConfigsArray = this.createButtonConfigs();
    const buttonCount = buttonConfigsArray.length;
    const totalHeight =
      buttonCount * BUTTON_HEIGHT + (buttonCount - 1) * BUTTON_GAP;
    const startY = BUTTON_AREA_TOP + (BUTTON_AREA_HEIGHT - totalHeight) / 2;
    const stepY = BUTTON_HEIGHT + BUTTON_GAP;

    buttonConfigsArray.forEach((buttonConfig, buttonIndex) => {
      const button = new UiButton({
        text: buttonConfig.text,
        x: BUTTON_X,
        y: startY + buttonIndex * stepY,
        width: BUTTON_WIDTH,
        height: BUTTON_HEIGHT,
        accent: buttonConfig.accent,
        onClick: buttonConfig.onClick,
      });
      this.menuButtonsArray.push(button);
      this.add(button);
    });
  }

  private createButtonConfigs(): MenuButtonConfig[] {
    const buttonConfigsArray: MenuButtonConfig[] = [];

    if (saveService.hasAnySave()) {
      buttonConfigsArray.push({
        text: 'Doorgaan',
        accent: THEME.accent.cyan,
        onClick: () => {
          if (saveService.continueActiveSlot()) {
            this.enterGame(false);
          }
        },
      });
    }

    buttonConfigsArray.push({
      text: 'Nieuw spel',
      accent: THEME.accent.violet,
      onClick: () => this.openSlotPanel('new'),
    });
    buttonConfigsArray.push({
      text: 'Spel laden',
      accent: THEME.accent.green,
      onClick: () => this.openSlotPanel('load'),
    });
    buttonConfigsArray.push({
      text: 'Instellingen',
      accent: THEME.accent.amber,
      onClick: () => this.openSettings(),
    });
    buttonConfigsArray.push({
      text: 'Instructies',
      accent: THEME.accent.cyan,
      onClick: () => {
        void this.engine.goToScene('tutorial', {
          sceneActivationData: { canStartRun: false },
        });
      },
    });

    return buttonConfigsArray;
  }

  private openSlotPanel(mode: SaveSlotPanelMode): void {
    this.setMenuButtonsEnabled(false);
    this.settingsPanel?.close();
    this.slotPanel?.open(mode);
  }

  private openSettings(): void {
    this.setMenuButtonsEnabled(false);
    this.slotPanel?.close();
    this.settingsPanel?.open();
  }

  private closePanels(): void {
    this.slotPanel?.close();
    this.settingsPanel?.close();
    // Rebuild so Continue reflects the current save state (e.g. after the
    // player deleted the last save in the Load Game panel).
    this.rebuildMenuButtons();
  }

  private setMenuButtonsEnabled(isEnabled: boolean): void {
    this.menuButtonsArray.forEach((button) => button.setEnabled(isEnabled));
  }

  private enterGame(isNewGame: boolean): void {
    if (isNewGame) {
      void this.engine.goToScene('tutorial', {
        sceneActivationData: { canStartRun: true },
      });
      return;
    }
    if (storyService.getStorySummary().runStatus !== 'active') {
      void this.engine.goToScene('ending', {
        sceneActivationData: { fromSave: true },
      });
      return;
    }
    runTimerService.resumeRun();
    fadeToScene(this.engine, 'map');
  }

  private createHeader(): excalibur.ScreenElement {
    const headerElement = new excalibur.ScreenElement({
      x: 0,
      y: 0,
      width: mapRenderSize.width,
      height: mapRenderSize.height,
      z: 10,
    });

    headerElement.graphics.use(
      new excalibur.Canvas({
        width: mapRenderSize.width,
        height: mapRenderSize.height,
        cache: false,
        smoothing: true,
        draw: (context) => {
          context.clearRect(0, 0, mapRenderSize.width, mapRenderSize.height);

          context.textAlign = 'center';
          context.textBaseline = 'alphabetic';
          context.fillStyle = THEME.color.text;
          context.font = `900 76px ${THEME.font.heading}`;
          context.fillText('DECHO', 640, 188);

          context.fillStyle = withAlpha(THEME.accent.cyan, 0.92);
          context.font = `700 18px ${THEME.font.label}`;
          context.fillText('SIGNAALROUTING', 640, 218);
        },
      }),
    );

    return headerElement;
  }

  private createMenuBackdrop(): excalibur.ScreenElement {
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
            240,
            80,
            640,
            240,
            520,
          );
          gradient.addColorStop(0, withAlpha(THEME.accent.cyan, 0.2));
          gradient.addColorStop(0.42, withAlpha(THEME.accent.violet, 0.08));
          gradient.addColorStop(1, withAlpha(THEME.color.bg, 0));
          context.fillStyle = gradient;
          context.fillRect(0, 0, mapRenderSize.width, mapRenderSize.height);

          context.strokeStyle = withAlpha(THEME.accent.cyan, 0.12);
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

          context.fillStyle = withAlpha(THEME.color.panelFill, 0.62);
          context.beginPath();
          context.roundRect(
            MENU_PANEL.x,
            MENU_PANEL.y,
            MENU_PANEL.width,
            MENU_PANEL.height,
            THEME.shape.panelRadius,
          );
          context.fill();
          context.strokeStyle = withAlpha(THEME.accent.cyan, 0.5);
          context.lineWidth = 1.5;
          context.stroke();
          drawDivider(context, 470, 232, 340);
        },
      }),
    );

    return backdropElement;
  }
}
