/**
 * Scene navigation helpers for DECHO.
 *
 * Main responsibility:
 * - Provides a smooth fade transition for menu-boundary scene changes.
 *
 * Made by: Richie
 *
 * Note: only menu-boundary transitions fade (main menu <-> game). In-game scene
 * navigation (map <-> location <-> qte) stays instant by calling
 * engine.goToScene directly.
 */

import * as excalibur from 'excalibur';
import { THEME, toExcaliburColor } from '../theme/theme-index';

const SCENE_FADE_OUT_MS = 280;
const SCENE_FADE_IN_MS = 320;

export function fadeToScene(
  engine: excalibur.Engine,
  sceneName: string,
  sceneActivationData?: Record<string, unknown>,
): void {
  const fadeColor = toExcaliburColor(THEME.color.bg);

  void engine.goToScene(sceneName, {
    sceneActivationData,
    sourceOut: new excalibur.FadeInOut({
      direction: 'out',
      duration: SCENE_FADE_OUT_MS,
      color: fadeColor,
    }),
    destinationIn: new excalibur.FadeInOut({
      direction: 'in',
      duration: SCENE_FADE_IN_MS,
      color: fadeColor,
    }),
  });
}
