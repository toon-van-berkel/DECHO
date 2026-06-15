---
name: keyboard-controls
description: 'Move an actor in four directions with WASD and cursor keys. Use when implementing basic player character movement. Includes onPreUpdate keyboard input detection, velocity control, and optional graphics flipping for direction.'
argument-hint: 'Optional: specify movement features (e.g., "with speed variable" or "with diagonal movement prevention")'
---

# Four-Direction Movement with WASD and Cursor Keys

Implement smooth actor movement in all four directions using WASD or arrow keys. This is the foundation for most 2D games with player-controlled characters.

## When to Use

- Creating player character movement for any 2D game
- Learning keyboard input handling in ExcaliburJS
- Needing simultaneous multi-key detection (e.g., moving diagonally)
- No physics are needed

## Setup Requirements

- ExcaliburJS installed in your project
- Understanding of Actor class basics and velocity (`this.vel`)
- Basic knowledge of the `onPreUpdate()` method

## Procedure

### 1. Create an Actor Class with Movement

Create a new file `src/js/actor.js` (or `src/js/player.js`) with keyboard input in `onPreUpdate()`:

```js
import { Actor, Vector, Keys } from "excalibur"
import { Resources } from './resources.js'

export class Actor extends Actor {
  onInitialize(engine) {
    this.graphics.use(Resources.Actor.toSprite())
    this.pos = new Vector(400, 400)
    this.vel = new Vector(0, 0)
  }

  onPreUpdate(engine) {
    let xspeed = 0
    let yspeed = 0

    if (engine.input.keyboard.isHeld(Keys.W) || engine.input.keyboard.isHeld(Keys.Up)) {
      yspeed = -1
    }

    if (engine.input.keyboard.isHeld(Keys.S) || engine.input.keyboard.isHeld(Keys.Down)) {
      yspeed = 1
    }

    if (engine.input.keyboard.isHeld(Keys.D) || engine.input.keyboard.isHeld(Keys.Right)) {
      xspeed = 1
    }

    if (engine.input.keyboard.isHeld(Keys.A) || engine.input.keyboard.isHeld(Keys.Left)) {
      xspeed = -1
    }

    this.vel = new Vector(xspeed, yspeed)
  }
}
```

### 2. Add the Actor to Your Game

In `src/js/game.js`, import and instantiate your actor:

```js
import { Actor, Engine, Vector, DisplayMode } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Actor } from "./actor.js"

export class Game extends Engine {
    constructor() {
        super({ 
            width: 1280,
            height: 720,
            maxFps: 60,
            displayMode: DisplayMode.FitScreen
        })
        this.start(ResourceLoader).then(() => this.startGame())
    }

    startGame() {
        const actor = new Actor()
        this.add(actor)
    }
}

new Game()
```

### 3. (Optional) Flip Graphics Based on Direction

Add visual feedback by flipping the sprite when moving left:

```js
onPreUpdate(engine) {
  let xspeed = 0
  let yspeed = 0

  if (engine.input.keyboard.isHeld(Keys.W) || engine.input.keyboard.isHeld(Keys.Up)) {
    yspeed = -1
  }

  if (engine.input.keyboard.isHeld(Keys.S) || engine.input.keyboard.isHeld(Keys.Down)) {
    yspeed = 1
  }

  if (engine.input.keyboard.isHeld(Keys.D) || engine.input.keyboard.isHeld(Keys.Right)) {
    xspeed = 1
  }

  if (engine.input.keyboard.isHeld(Keys.A) || engine.input.keyboard.isHeld(Keys.Left)) {
    xspeed = -1
  }

  this.vel = new Vector(xspeed, yspeed)
  this.graphics.flipHorizontal = (this.vel.x > 0)
}
```

### 4. (Optional) Add Movement Speed

Control movement speed with a variable:

```js
export class Actor extends Actor {
  constructor() {
    super()
    this.speed = 150
  }

  onPreUpdate(engine) {
    let xspeed = 0
    let yspeed = 0

    if (engine.input.keyboard.isHeld(Keys.W) || engine.input.keyboard.isHeld(Keys.Up)) {
      yspeed = -this.speed
    }

    if (engine.input.keyboard.isHeld(Keys.S) || engine.input.keyboard.isHeld(Keys.Down)) {
      yspeed = this.speed
    }

    if (engine.input.keyboard.isHeld(Keys.D) || engine.input.keyboard.isHeld(Keys.Right)) {
      xspeed = this.speed
    }

    if (engine.input.keyboard.isHeld(Keys.A) || engine.input.keyboard.isHeld(Keys.Left)) {
      xspeed = -this.speed
    }

    this.vel = new Vector(xspeed, yspeed)
  }
}
```

## Key Concepts

- **`engine.input.keyboard.isHeld(Keys.W)`**: Detects if a key is currently pressed
- **`this.vel = new Vector(x, y)`**: Sets the actor's velocity each frame
- **Shorthand keys**: `Keys.W`, `Keys.A`, `Keys.S`, `Keys.D` work with `Keys.Up`, `Keys.Down`, `Keys.Left`, `Keys.Right`

## Related Skills

- [Gamepad Support](../gamepad-support/SKILL.md): Add joystick/controller input
- [Platform Game](../platform-game/SKILL.md): Add gravity and jumping
- [Excalibur Scenes](../excalibur-scenes/SKILL.md): Organize multi-level games
