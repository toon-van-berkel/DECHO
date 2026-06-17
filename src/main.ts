import * as ex from "excalibur";
import { loader } from "./resources";
import { MainMenu } from "./scenes";

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

  // Public async start function to handle the loading of the game
  public async start(): Promise<void> {
    // Execute the super.start with custom loader and move to the mainMenu scene
    await super.start(loader);
    this.goToScene("mainMenu");
  }
}

// Initiate the game
const game = new Game();
game.start();
