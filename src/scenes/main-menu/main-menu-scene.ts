/**
 * Main menu scene for DECHO.
 *
 * Main responsibility:
 * - Shows the start, load, and settings buttons.
 *
 * Made by: Casper
 */

import * as excalibur from 'excalibur';
import { UiButton } from '../../components/ui/button';
import { drawDivider } from '../../components/ui/hud-drawing';
import { mapRenderSize } from '../../core/engine/engine-config';
import { THEME, withAlpha } from '../../core/theme/theme-index';
import * as storyService from '../../features/story/story-service';

export class MainMenuScene extends excalibur.Scene {
  override onInitialize(engine: excalibur.Engine): void {
    this.add(this.createMenuBackdrop());

    const titleLabel = new excalibur.Label({
      text: 'DECHO',
      pos: excalibur.vec(640, 150),
      font: new excalibur.Font({
        family: THEME.font.heading,
        size: 76,
        color: excalibur.Color.White,
        textAlign: excalibur.TextAlign.Center,
      }),
      z: 10,
    });

    const subtitleLabel = new excalibur.Label({
      text: 'SIGNAL ROUTING INTERFACE',
      pos: excalibur.vec(640, 208),
      font: new excalibur.Font({
        family: THEME.font.label,
        size: 18,
        color: excalibur.Color.White,
        textAlign: excalibur.TextAlign.Center,
      }),
      z: 10,
    });

    const sceneButtonsArray = [
      {
        text: 'Start Game',
        destination: 'map',
      },
      {
        text: 'Load Game',
        destination: 'map',
      },
      {
        text: 'Settings',
        destination: 'mainMenu',
      },
    ];

    this.add(titleLabel);
    this.add(subtitleLabel);
    sceneButtonsArray.forEach((buttonConfig, buttonIndex) => {
      this.add(
        new UiButton({
          text: buttonConfig.text,
          x: 500,
          y: 278 + buttonIndex * 72,
          width: 280,
          height: 54,
          accent:
            buttonIndex === 0
              ? THEME.accent.cyan
              : buttonIndex === 1
                ? THEME.accent.violet
                : THEME.accent.green,
          onClick: () => {
            storyService.startStory();
            void engine.goToScene(buttonConfig.destination);
          },
        }),
      );
    });
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
            250,
            80,
            640,
            250,
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
          context.roundRect(430, 116, 420, 382, THEME.shape.panelRadius);
          context.fill();
          context.strokeStyle = withAlpha(THEME.accent.cyan, 0.5);
          context.lineWidth = 1.5;
          context.stroke();
          drawDivider(context, 480, 234, 320);
        },
      }),
    );

    return backdropElement;
  }
}
