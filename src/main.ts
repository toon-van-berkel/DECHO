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
import { LocationScene } from './scenes/location/location-scene';
import { MainMenuScene } from './scenes/main-menu/main-menu-scene';
import { MapScene } from './scenes/map/map-scene';
import { QteScene } from './scenes/qte/qte-scene';

const gameEngine = new excalibur.Engine({
  width: engineConfig.mapRenderSize.width,
  height: engineConfig.mapRenderSize.height,
  displayMode: engineConfig.engineDisplayMode,
  pixelArt: false,
  antialiasing: true,
  suppressPlayButton: true,
  scenes: {
    mainMenu: MainMenuScene,
    map: MapScene,
    location: LocationScene,
    qte: QteScene,
  },
});

async function startGame(): Promise<void> {
  // Excalibur 0.32 starts the clock before director initialization.
  gameEngine.director.configureStart('mainMenu');
  await gameEngine.director.onInitialize();
  await gameEngine.start(resourceLoader.resourceLoader);
}

void startGame();
