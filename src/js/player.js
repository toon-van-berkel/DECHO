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

const DIRECTIONS = [
  "down",
  "downLeft",
  "upLeft",
  "up",
  "upRight",
  "downRight",
];

export class Player extends Actor {
  constructor(x = 400, y = 300) {
    super({
      pos: new Vector(x, y),
      width: 32,
      height: 32,
      collisionType: CollisionType.Active,
      z: 100,
    });

    this.speed = 500;
    this.direction = "down";
    this.currentGraphic = "";

    const sheet = SpriteSheet.fromImageSource({
      image: Resources.Walking,
      grid: {
        rows: 6,
        columns: 8,
        spriteWidth: 48,
        spriteHeight: 64,
      },
    });

    this.walk = {};
    this.idle = {};

    DIRECTIONS.forEach((direction, row) => {
      const startFrame = row * 8;

      this.walk[direction] = Animation.fromSpriteSheet(
        sheet,
        range(startFrame, startFrame + 7),
        100,
        AnimationStrategy.Loop,
      );

      this.idle[direction] = sheet.getSprite(0, row);
    });

    this.graphics.offset = new Vector(0, -16);
    this.useGraphic("idle-down", this.idle.down);
  }

  onPreUpdate(engine) {
    const movement = new Vector(
      Number(engine.input.keyboard.isHeld(Keys.D)) -
        Number(engine.input.keyboard.isHeld(Keys.A)),
      Number(engine.input.keyboard.isHeld(Keys.S)) -
        Number(engine.input.keyboard.isHeld(Keys.W)),
    );

    if (movement.equals(Vector.Zero)) {
      this.vel = Vector.Zero;
      this.useGraphic(
        `idle-${this.direction}`,
        this.idle[this.direction],
      );
      return;
    }

    this.vel = movement.normalize().scale(this.speed);
    this.direction = this.getDirection(movement);

    this.useGraphic(
      `walk-${this.direction}`,
      this.walk[this.direction],
    );
  }

  getDirection(movement) {
    const { x, y } = movement;

    if (x < 0 && y > 0) return "downLeft";
    if (x < 0 && y < 0) return "upLeft";
    if (x > 0 && y < 0) return "upRight";
    if (x > 0 && y > 0) return "downRight";
    if (y > 0) return "down";
    if (y < 0) return "up";
    if (x < 0) return "downLeft";

    return "downRight";
  }

  useGraphic(name, graphic) {
    if (this.currentGraphic === name) return;

    this.currentGraphic = name;
    this.graphics.use(graphic);
  }
}