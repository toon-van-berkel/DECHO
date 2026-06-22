import * as ex from "excalibur";
import { loader } from "./resources";
import { MainMenu, StartScreen, TestScene } from "./scenes";



export class Game extends ex.Engine {
  constructor() {
    super({
      width: 800, 
      height: 600,
      displayMode: ex.DisplayMode.FitScreenAndFill, 
      pixelArt: true, 
      scenes: {
        startScreen: StartScreen,
        mainMenu: MainMenu,
        testScene: TestScene
      },
      maxFps: 60,
      suppressPlayButton: true,
    });
  }


  public async start(): Promise<void> {
    await super.start(loader);
    this.goToScene('startScreen');
  }
}

// Initiate the game
const game = new Game();
game.start();
