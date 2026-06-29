/**
 * Start screen for DECHO.
 *
 * Main responsibility:
 * - Shows the first screen with the start background and Start Game button.
 *
 * Made by: Liam
 */

import * as excalibur from 'excalibur';
import { UiButton } from '../../components/ui/button';
import { mapRenderSize } from '../../core/engine/engine-config';
import { fadeToScene } from '../../core/navigation/navigate';
import { getBackgroundResource } from '../../core/resources/resource-loader';
import { THEME } from '../../core/theme/theme-index';

export class StartScreenScene extends excalibur.Scene {
  override onInitialize(engine: excalibur.Engine): void {
    this.add(this.createBackground());
    this.add(
      new UiButton({
        text: 'Start Game',
        x: mapRenderSize.width / 2 - 150,
        y: mapRenderSize.height - 104,
        width: 300,
        height: 54,
        accent: THEME.accent.cyan,
        onClick: () => fadeToScene(engine, 'mainMenu'),
      }),
    );
  }

  private createBackground(): excalibur.Actor {
    const backgroundResource = getBackgroundResource('background-startscreen');
    if (!backgroundResource) {
      throw new Error('background-startscreen is missing from resources.');
    }

    const backgroundActor = new excalibur.Actor({
      pos: excalibur.vec(mapRenderSize.width / 2, mapRenderSize.height / 2),
      anchor: excalibur.vec(0.5, 0.5),
      z: 0,
      width: mapRenderSize.width,
      height: mapRenderSize.height,
    });

    backgroundActor.graphics.use(
      new excalibur.Sprite({
        image: backgroundResource,
        destSize: {
          width: mapRenderSize.width,
          height: mapRenderSize.height,
        },
      }),
    );
    return backgroundActor;
  }
}
