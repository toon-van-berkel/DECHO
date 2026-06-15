import "../css/style.css";
import { Engine, DisplayMode, Vector } from "excalibur";
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

    this.start(ResourceLoader).then(() => this.startGame());
  }

  startGame() {
    Resources.MapV1.addToScene(this.currentScene);

    const player = new Player();

    player.pos = new Vector(400, 300);
    player.z = 100;

    this.add(player);

    this.currentScene.camera.strategy.lockToActor(player);
  }
}

new Game();
