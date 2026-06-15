import "../css/style.css";
import { Engine, DisplayMode } from "excalibur";
import { Resources, ResourceLoader } from "./resources.js";
import { Player } from "./player.js";

export class Game extends Engine {
  constructor() {
    super({
      width: 1280,
      height: 720,
      maxFps: 60,
      displayMode: DisplayMode.FitScreen,
      pixelArt: true,
    });

    this.start(ResourceLoader)
      .then(() => this.startGame())
      .catch((error) => {
        console.error("Fout tijdens laden:", error);
      });
  }

  startGame() {
    Resources.MapV1.addToScene(this.currentScene);

    const player = new Player(400, 300);
    this.add(player);

    const camera = this.currentScene.camera;
    camera.zoom = 2;
    camera.strategy.lockToActor(player);

  }
}

new Game();