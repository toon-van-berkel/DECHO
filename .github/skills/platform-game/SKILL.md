---
name: platform-game
description: 'Build a rudimentary platform game with ExcaliburJS. Use when creating games where players jump on platforms and fall due to gravity. Includes Game class setup, Player actor with WASD controls and jumping, and Platform actor with collision detection.'
argument-hint: 'Optional: specify platform game features (e.g., "with moving platforms" or "with enemy actors")'
---

# Platform Game with ExcaliburJS

Build a fully functional platform game with a player that can move left/right with WASD keys, jump on platforms, and fall when unsupported.

## When to Use

- Creating 2D platformer games (Mario-style, Kirby-style)
- Learning object-oriented game design with actors and physics
- Building games where players navigate platforms and gravity matters
- Prototyping jump mechanics and collision detection

## Setup Requirements

- ExcaliburJS already installed in your project
- Understanding of Actor classes and the Game class basics
- Physics and collision detection concepts familiar

## Procedure

### 1. Enable Physics in Game Class

Start with the main Game class and enable **Arcade Physics** with gravity (good for platformers):

```js
import { Actor, Engine, Vector, DisplayMode, SolverStrategy } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Player } from "./player.js"
import { Platform } from "./platform.js"

export class Game extends Engine {
    constructor() {
        super({ 
            width: 1280,
            height: 720,
            maxFps: 60,
            displayMode: DisplayMode.FitScreen,
            physics: {
                solver: SolverStrategy.Arcade,
                gravity: new Vector(0, 800),
            }
        })
        this.start(ResourceLoader).then(() => this.startGame())
        this.showDebug(true) // Enable to visualize hitboxes
    }

    startGame() {
        // Add player
        const player = new Player()
        this.add(player)
        
        // Add multiple platforms, platform image size is 220x50
        const platform1 = new Platform(200, 600, 220, 50)
        const platform2 = new Platform(700, 500, 220, 50)
        const platform3 = new Platform(400, 350, 220, 50)
        
        this.add(platform1)
        this.add(platform2)
        this.add(platform3)
    }

    onPostUpdate() {
        // Game logic runs here every frame
    }
}

new Game()
```

See [Game class template](./assets/game-template.js) for a complete example.

### 2. Create Player Actor

Create `src/js/player.js` with WASD movement and jump mechanics:

```js
import { Actor, Vector, CollisionType, Keys } from "excalibur"
import { Resources } from './resources.js'

export class Player extends Actor {

    constructor() {
        super({
            width: 40,
            height: 60,
            collisionType: CollisionType.Active
        })
    }

    onInitialize(engine) {
        this.graphics.use(Resources.Player.toSprite())
        this.pos = new Vector(100, 100)
        this.body.mass = 7
    }

    onPreUpdate(engine, delta) {
        this.handleMovement(engine)
        this.handleJump(engine, delta)
    }

    handleMovement(engine) {
        let xspeed = 0

        if (engine.input.keyboard.isHeld(Keys.D) || engine.input.keyboard.isHeld(Keys.Right)) {
            xspeed = 200
            this.graphics.flipHorizontal = false
        }

        if (engine.input.keyboard.isHeld(Keys.A) || engine.input.keyboard.isHeld(Keys.Left)) {
            xspeed = -200
            this.graphics.flipHorizontal = true
        }

        this.vel = new Vector(xspeed, this.vel.y)
    }

    handleJump(engine, delta) {
      if (engine.input.keyboard.wasPressed(Keys.Space) || engine.input.keyboard.wasPressed(Keys.W)) {
            this.body.applyLinearImpulse(new Vector(0, -300 * delta))
        }
    }

    onCollisionEnd(event) {

    }

    onPostUpdate() {
        // Keep player in view, or implement game over
        if (this.pos.y > 1000) {
            this.pos = new Vector(100, 100)
            this.vel = Vector.Zero
        }
    }
}
```

See [Player class template](./assets/player-template.js) for full example with comments.

### 3. Create Platform Actor

Create `src/js/platform.js` for static platforms:

```js
import { Actor, Vector, CollisionType } from "excalibur"
import { Resources } from './resources.js'

export class Platform extends Actor {
    constructor(x, y, width, height) {
        super({
            width: width,
            height: height,
            collisionType: CollisionType.Fixed
        })
        this.pos = new Vector(x, y)
    }

    onInitialize(engine) {
        this.graphics.use(Resources.Platform.toSprite())
    }
}
```

See [Platform class template](./assets/platform-template.js) for a complete example.

### 4. Update Resources.js

Add sprite resources for Player and Platform:

```js
import { ImageSource } from "excalibur"
import { Loader } from "excalibur"

const Resources = {
    Player: new ImageSource('images/player.png'),
    Platform: new ImageSource('images/platform.png'),
}

export const ResourceLoader = new Loader(Object.values(Resources), true)

export { Resources }
```

### 5. Test the Game

- Run your game with `npm run dev`
- Player should spawn at top-left
- Use **A/D** or **arrow keys** to move
- Use **Space** to jump
- Landing on platforms should prevent falling

## Key Concepts

**Arcade Physics**: Simpler than realistic physics, good for platformers. Objects fall with gravity and collide with fixed platforms.

**CollisionType**:
- `Active`: Actors that move and respond to physics (Player)
- `Fixed`: Static immovable objects (Platforms)

**isGrounded**: Tracks whether player is standing on a platform to allow jumping only when touching ground.

**applyLinearImpulse**: Applies a force over time, working better with physics than directly setting velocity.

## Common Tweaks

- **Jump height**: Increase impulse value in `handleJump()` for higher jumps
- **Movement speed**: Change `xspeed` value in `handleMovement()` 
- **Gravity**: Adjust `gravity` in Game class constructor (higher = faster fall)
- **Platform size**: Pass different `width` and `height` to Platform constructor

## References

- [Physics and Collision](./references/physics-guide.md) - Detailed physics concepts
- [ExcaliburJS Docs](https://excaliburjs.com) - Official documentation
- [Collision Detection](./references/collision-guide.md) - How collision detection works

## Related Skills

If you need moving platforms, enemy actors, or particle effects, ask about those extensions.
