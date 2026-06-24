import * as ex from 'excalibur';
import { loader } from './resources';
import {
  MainMenu,
  MarketSquareScene,
  DocksScene,
  BlackMarketScene,
  CyberClinicScene,
  SkyPlatformScene,
  FinalResultScene,
  StartScreen
} from './scenes';

// Goal is to keep main.ts small and just enough to configure the engine
export class Game extends ex.Engine {
  constructor() {
    super({
      width: 800,
      height: 600,
      displayMode: ex.DisplayMode.FitScreenAndFill, // Display mode tells excalibur how to fill the window
      pixelArt: true, // pixelArt will turn on the correct settings to render pixel art without jaggies or shimmering artifacts
      //niet meer nodig na toevoeging van Scenes
      scenes: {
        startScreen: StartScreen,
        mainMenu: MainMenu,
        marketSquare: MarketSquareScene,
        theDocks: DocksScene,
        blackMarket: BlackMarketScene,
        cyberClinic: CyberClinicScene,
        skyPlatform: SkyPlatformScene,
        finalResult: FinalResultScene,
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
