---
name: excalibur-scenes
description: 'Convert ExcaliburJS project with Game and Player classes to use Scenes. Use when organizing multi-level games, menus, and game states. Includes refactoring Game class, creating Scene subclasses, and adding scene-specific players.'
argument-hint: 'Optional: specify scene types (e.g., "with menu scene" or "with pause screen")'
---

# ExcaliburJS Scenes Refactoring

Convert a basic ExcaliburJS project with a single Game class and Player to a scene-based architecture with multiple scenes, each containing their own Player actor.

## When to Use

- Organizing multi-level or multi-stage games (Level 1, Level 2, Boss Level)
- Implementing different game modes (Menu, Play, Game Over, Settings)
- Separating concerns: each scene manages its own actors and logic
- Creating transitions between game states
- Learning object-oriented game architecture patterns

## Prerequisites

- Existing ExcaliburJS project with a Game class
- Player class implemented and working
- Understanding of how actors are added to the game

## Procedure

### 1. Understand Scenes

A **Scene** in ExcaliburJS is a container for actors and logic for a specific game state. Multiple scenes can exist, but only one is active at a time.

Benefits:
- Cleaner code organization
- Each scene has its own lifecycle (`onInitialize`, `onActivate`, `onDeactivate`)
- Easy scene transitions
- Memory management (unload actors when scene is inactive)

### 2. Create Your First Scene

Create a new file `src/js/scene-level-one.js`:

```js
import { Scene, Vector } from "excalibur"
import { Player } from "./player.js"
import { Platform } from "./platform.js"

export class SceneLevelOne extends Scene {
    player
    
    onInitialize(engine) {
        // This runs once when scene is created
        this.add(new Platform(200, 600, 220, 50))
        this.add(new Platform(700, 500, 220, 50))
        this.add(new Platform(400, 350, 220, 50))
    }

    onActivate(engine) {
        // This runs when scene becomes active
        this.player = new Player()
        this.add(this.player)
        console.log("Level 1 started!")
    }

    onDeactivate(engine) {
        // This runs when switching away from this scene
        console.log("Level 1 ended!")
    }

    onPostUpdate(engine) {
        // Frame-by-frame logic for the scene
        if (this.player.pos.y > 1000) {
            this.player.pos = new Vector(100, 100)
            this.player.vel = Vector.Zero
        }
    }
}
```

See [Scene template - Level One](./assets/scene-level-one.js) for complete example.

### 3. Create Your Second Scene

Create `src/js/scene-level-two.js` (similar structure, different platforms):

```js
import { Scene, Vector } from "excalibur"
import { Player } from "./player.js"
import { Platform } from "./platform.js"

export class SceneLevelTwo extends Scene {
    player

    onInitialize(engine) {
        // Different platform layout for level 2
        this.add(new Platform(100, 600, 200, 50))
        this.add(new Platform(500, 500, 250, 50))
        this.add(new Platform(900, 400, 300, 50))
        this.add(new Platform(400, 250, 400, 50))
        this.add(new Platform(640, 680, 1280, 40))
    }

    onActivate(engine) {
        this.player = new Player()
        this.add(this.player)
        console.log("Level 2 started!")
    }

    onDeactivate(engine) {
        console.log("Level 2 ended!")
    }

    onPostUpdate(engine) {
        if (this.player.pos.y > 1000) {
            this.player.pos = new Vector(100, 100)
            this.player.vel = Vector.Zero
        }
    }
}
```

See [Scene template - Level Two](./assets/scene-level-two.js) for complete example.

### 4. Refactor Game Class to Use Scenes

Update your `src/js/game.js`:

```js
import { Actor, Engine, Vector, DisplayMode, SolverStrategy } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { SceneLevelOne } from "./scene-level-one.js"
import { SceneLevelTwo } from "./scene-level-two.js"

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
        this.showDebug(true)
    }

    startGame() {
        // Create scenes
        const levelOne = new SceneLevelOne()
        const levelTwo = new SceneLevelTwo()

        // Add scenes to game
        this.addScene("level1", levelOne)
        this.addScene("level2", levelTwo)

        // Start with level 1
        this.goToScene("level1")
    }

    onPostUpdate() {
        // Listen for scene transitions (e.g., press 'N' for next level)
        if (this.input.keyboard.wasPressed(Keys.N)) {
            this.goToScene("level2")
        }

        if (this.input.keyboard.wasPressed(Keys.P)) {
            this.goToScene("level1")
        }
    }
}

new Game()
```

See [Game class template - with Scenes](./assets/game-with-scenes.js) for complete example.

### 5. Test Scene Transitions

- Run your game: `npm run dev`
- Start in Level 1
- Press **N** to go to Level 2
- Press **P** to go back to Level 1
- Each scene should have its own Player and platforms

## Key Concepts

**Scene Lifecycle**:
- `onInitialize(engine)` - Runs once, set up static actors
- `onActivate(engine)` - Runs when scene becomes active, spawn dynamic actors
- `onDeactivate(engine)` - Runs when leaving scene, cleanup logic
- `onPostUpdate(engine)` - Runs every frame, update game state

**Scene Management**:
- `addScene(name, scene)` - Register a scene
- `goto(sceneName)` - Switch to a different scene
- Only one scene active at a time

## Common Patterns

### Adding a Level Complete Condition

```js
onPostUpdate(engine) {
    // Check if player reached goal
    if (this.player.pos.x > 1200) {
        console.log("Level complete!")
        // Switch to next scene
        engine.goToScene("level2")
    }
}
```

### Passing Data Between Scenes

Scenes can share information through the Engine or a global game state object:

```js
// In game.js
export class Game extends Engine {
    constructor() {
        super({...})
        this.playerScore = 0
    }
}

// In a scene
onPostUpdate(engine) {
    const game = engine
    game.playerScore += 10
}
```

### Adding a Menu Scene

```js
export class MenuScene extends Scene {
    onActivate(engine) {
        console.log("Welcome to the game! Press SPACE to start")
    }

    onPostUpdate(engine) {
        if (engine.input.keyboard.wasPressed(Keys.Space)) {
            engine.goToScene("level1")
        }
    }
}
```

## Common Issues

**Player not appearing**: Make sure you add the Player in `onActivate()`, not `onInitialize()`. Only actors added in `onActivate()` are visible when the scene starts.

**Scenes not switching**: Check that scene names in `addScene()` match the names in `goto()` calls.

**Memory leak**: Remove actors in `onDeactivate()` if they're large or numerous.

## Next Steps

- Add a Menu scene that appears on startup
- Implement a Game Over scene
- Add transitions between scenes (fade, slide effects)
- Create a level counter that tracks progress

## References

- [Scene Architecture Patterns](./references/scene-concepts.md) - Deep dive into scene design
- [ExcaliburJS Scene Docs](https://excaliburjs.com/docs/api/class/Scene) - Official documentation
