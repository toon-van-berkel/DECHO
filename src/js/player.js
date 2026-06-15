import {
  Actor,
  SpriteSheet,
  Animation,
  AnimationStrategy,
  CollisionType,
  Vector,
  Keys,
  range,
} from "excalibur";

import { Resources } from "./resources.js";

export class Player extends Actor {
  constructor() {
    super({
      width: 32,
      height: 32,
      collisionType: CollisionType.Active,
    });

    this.scale = new Vector(3, 3);
    this.speed = 500;
    this.direction = "down";
    this.currentAnimation = "";

    const sheet = SpriteSheet.fromImageSource({
      image: Resources.Walking,
      grid: {
        rows: 6,
        columns: 8,
        spriteWidth: 48,
        spriteHeight: 64,
      },
    });

    this.walk = {
      down: this.createAnimation(sheet, 0),
      downLeft: this.createAnimation(sheet, 8),
      upLeft: this.createAnimation(sheet, 16),
      up: this.createAnimation(sheet, 24),
      upRight: this.createAnimation(sheet, 32),
      downRight: this.createAnimation(sheet, 40),
    };

    this.idle = {
      down: sheet.getSprite(0, 0),
      downLeft: sheet.getSprite(0, 1),
      upLeft: sheet.getSprite(0, 2),
      up: sheet.getSprite(0, 3),
      upRight: sheet.getSprite(0, 4),
      downRight: sheet.getSprite(0, 5),
    };

    this.graphics.offset = new Vector(0, -16);

    this.setGraphic("idle-down", this.idle.down);
  }

  createAnimation(sheet, startFrame) {
    return Animation.fromSpriteSheet(
      sheet,
      range(startFrame, startFrame + 7),
      100,
      AnimationStrategy.Loop,
    );
  }

  onPreUpdate(engine) {
    let x = 0;
    let y = 0;

    if (engine.input.keyboard.isHeld(Keys.W)) y--;
    if (engine.input.keyboard.isHeld(Keys.S)) y++;
    if (engine.input.keyboard.isHeld(Keys.A)) x--;
    if (engine.input.keyboard.isHeld(Keys.D)) x++;

    if (x === 0 && y === 0) {
      this.vel = Vector.Zero;
      this.setGraphic(`idle-${this.direction}`, this.idle[this.direction]);
      return;
    }

    this.vel = new Vector(x, y).normalize().scale(this.speed);

    if (x < 0 && y > 0) this.direction = "downLeft";
    else if (x < 0 && y < 0) this.direction = "upLeft";
    else if (x > 0 && y < 0) this.direction = "upRight";
    else if (x > 0 && y > 0) this.direction = "downRight";
    else if (y > 0) this.direction = "down";
    else if (y < 0) this.direction = "up";
    else if (x < 0) this.direction = "downLeft";
    else if (x > 0) this.direction = "downRight";

    this.setGraphic(`walk-${this.direction}`, this.walk[this.direction]);
  }

  setGraphic(name, graphic) {
    if (this.currentAnimation === name) return;

    this.currentAnimation = name;
    this.graphics.use(graphic);
  }
}
