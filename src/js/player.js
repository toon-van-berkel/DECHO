import {
  Actor,
  SpriteSheet,
  Animation,
  AnimationStrategy,
  CollisionType,
  range,
  Vector,
  Keys,
} from "excalibur";

import { Resources } from "./resources.js";

export class Player extends Actor {
  #speed = 300;

  constructor() {
    super({
      width: 32,
      height: 32,
      collisionType: CollisionType.Active,
      z: 1,
    });

    this.addTag("player");

    this.direction = "down";
    this.currentGraphic = "";

    const walkingSheet = SpriteSheet.fromImageSource({
      image: Resources.Walking,
      grid: {
        rows: 4,
        columns: 10,
        spriteWidth: 64,
        spriteHeight: 128,
      },
    });

    this.walkAnimations = {
      down: Animation.fromSpriteSheet(
        walkingSheet,
        range(0, 9),
        100,
        AnimationStrategy.Loop,
      ),

      left: Animation.fromSpriteSheet(
        walkingSheet,
        range(10, 19),
        100,
        AnimationStrategy.Loop,
      ),

      right: Animation.fromSpriteSheet(
        walkingSheet,
        range(20, 29),
        100,
        AnimationStrategy.Loop,
      ),

      up: Animation.fromSpriteSheet(
        walkingSheet,
        range(30, 39),
        100,
        AnimationStrategy.Loop,
      ),
    };

    this.idleSprites = {
      down: walkingSheet.getSprite(0, 0),
      left: walkingSheet.getSprite(0, 1),
      right: walkingSheet.getSprite(0, 2),
      up: walkingSheet.getSprite(0, 3),
    };

    this.graphics.offset = new Vector(0, -48);

    this.useGraphic(
      "idle-down",
      this.idleSprites.down,
    );

    this.vel = Vector.Zero;
  }

  onPreUpdate(engine) {
    let x = 0;
    let y = 0;

    if (engine.input.keyboard.isHeld(Keys.W)) {
      y -= 1;
    }

    if (engine.input.keyboard.isHeld(Keys.S)) {
      y += 1;
    }

    if (engine.input.keyboard.isHeld(Keys.A)) {
      x -= 1;
    }

    if (engine.input.keyboard.isHeld(Keys.D)) {
      x += 1;
    }

    const movement = new Vector(x, y);

    if (movement.magnitude > 0) {
      this.vel = movement
        .normalize()
        .scale(this.#speed);

      if (x < 0) {
        this.direction = "left";
      } else if (x > 0) {
        this.direction = "right";
      } else if (y < 0) {
        this.direction = "up";
      } else if (y > 0) {
        this.direction = "down";
      }

      this.useGraphic(
        `walking-${this.direction}`,
        this.walkAnimations[this.direction],
      );
    } else {
      this.vel = Vector.Zero;

      this.useGraphic(
        `idle-${this.direction}`,
        this.idleSprites[this.direction],
      );
    }
  }

  useGraphic(name, graphic) {
    if (this.currentGraphic === name) {
      return;
    }

    this.currentGraphic = name;
    this.graphics.use(graphic);
  }
}