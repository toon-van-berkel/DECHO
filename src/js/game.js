import "../css/style.css";
import {
  Engine,
  Vector,
  DisplayMode,
} from "excalibur";

import { ResourceLoader } from "./resources.js";
import { Player } from "./player.js";

export class Game extends Engine {
  constructor() {
    super({
      width: 1280,
      height: 720,
      maxFps: 60,
      displayMode: DisplayMode.FitScreen,
    });

    this.start(ResourceLoader).then(() => {
      this.startGame();
    });
  }

  startGame() {
    const player = new Player();

    player.pos = new Vector(
      this.drawWidth / 2,
      this.drawHeight / 2,
    );

    this.add(player);
  }
}

new Game();