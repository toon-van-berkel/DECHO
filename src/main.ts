import * as ex from 'excalibur';
import { loader } from "./resources";
import { MainMenu } from './scenes';

// Goal is to keep main.ts small and just enough to configure the engine

export class Game extends ex.Engine {
  constructor() {
    super({
      width: 800, // Logical width and height in game pixels
      height: 600,
      displayMode: ex.DisplayMode.FitScreenAndFill, // Display mode tells excalibur how to fill the window
      pixelArt: true, // pixelArt will turn on the correct settings to render pixel art without jaggies or shimmering artifacts
      scenes: {
        mainMenu: MainMenu,

      },
      maxFps: 60,
      suppressPlayButton: true,
    });
  }

  public async start() {
    return super.start(loader).then(() => {
      this.goToScene('sceneStart');
    })
  }
};

const game = new Game();
game.start();