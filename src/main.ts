/**
 * Main entry point for DECHO.
 *
 * Main responsibility:
 * - Starts the Excalibur engine with the merged scene shell.
 *
 * Made by: Richie
 */

import * as excalibur from 'excalibur';
import * as engineConfig from './core/engine/engine-config';
import * as resourceLoader from './core/resources/resource-loader';
import { EndingScene } from './scenes/ending/ending-scene';
import { LocationScene } from './scenes/location/location-scene';
import { MainMenuScene } from './scenes/main-menu/main-menu-scene';
import { MapScene } from './scenes/map/map-scene';
import { QteScene } from './scenes/qte/qte-scene';
import { StartScreenScene } from './scenes/start-screen/start-screen-scene';
import { TutorialScene } from './scenes/tutorial/tutorial-scene';

const gameEngine = new excalibur.Engine({
  canvasElementId: 'game',
  width: engineConfig.mapRenderSize.width,
  height: engineConfig.mapRenderSize.height,
  displayMode: engineConfig.engineDisplayMode,
  backgroundColor: excalibur.Color.Black,
  pixelArt: false,
  antialiasing: true,
  suppressPlayButton: true,
  scenes: {
    mainMenu: MainMenuScene,
    map: MapScene,
    location: LocationScene,
    qte: QteScene,
    ending: EndingScene,
    startScreen: StartScreenScene,
    tutorial: TutorialScene,
  },
});

async function startGame(): Promise<void> {
  // Excalibur 0.32 starts the clock before director initialization.
  gameEngine.director.configureStart('startScreen');
  await gameEngine.director.onInitialize();
  await gameEngine.start(resourceLoader.resourceLoader);
}

void startGame();
