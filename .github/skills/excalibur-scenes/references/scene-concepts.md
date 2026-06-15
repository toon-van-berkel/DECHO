# Scene Architecture and Design

## What is a Scene?

A **Scene** is a container for a game state. Think of it like a level, menu, or game over screen. Each scene:
- Manages its own actors (player, enemies, platforms)
- Has its own update loop
- Can be activated and deactivated
- Lives independently alongside other scenes

## Scene Lifecycle

ExcaliburJS calls these methods automatically:

### onInitialize(engine)
**Called**: Once when the scene is created  
**Use for**: Setting up static, unchanging content
```js
onInitialize(engine) {
    // Add platforms, decorations, level layout
    this.add(new Platform(200, 600, 300, 50))
}
```

### onActivate(engine)
**Called**: Every time the scene becomes active (first time + after switching from another scene)  
**Use for**: Spawning dynamic actors, resetting state
```js
onActivate(engine) {
    // Create and add player
    this.player = new Player()
    this.add(this.player)
}
```

### onPostUpdate(engine)
**Called**: Every frame while scene is active  
**Use for**: Frame-by-frame logic (collision checks, state changes)
```js
onPostUpdate(engine) {
    if (this.player.pos.y > 1000) {
        this.resetPlayer()
    }
}
```

### onDeactivate(engine)
**Called**: When switching away from this scene  
**Use for**: Cleanup, saving state, pausing audio
```js
onDeactivate(engine) {
    console.log("Leaving level 1")
}
```

## Why Split onInitialize() and onActivate()?

**Example**: A puzzle game where you retry the level multiple times.

```js
onInitialize(engine) {
    // Level layout (same every time)
    for (let i = 0; i < 10; i++) {
        this.add(new PuzzleBlock(...))
    }
}

onActivate(engine) {
    // Player state (resets on each attempt)
    this.player = new Player()
    this.add(this.player)
}

onPostUpdate(engine) {
    if (levelComplete()) {
        engine.goToScene("nextLevel") // Deactivate, then activate next
    }
    if (playerDied()) {
        engine.goToScene("level1") // Restart, triggers onActivate again
    }
}
```

## Scene vs. Actor

| Aspect | Scene | Actor |
|--------|-------|-------|
| **Purpose** | Container for one game state | Individual game object |
| **Children** | Actors | Actors can have child actors |
| **Multiple Active** | Only one scene active | Many actors can be active |
| **Lifecycle** | onInitialize → onActivate → onDeactivate | onInitialize → onPreUpdate → onPostUpdate |
| **Use Case** | Levels, menus, screens | Players, enemies, projectiles |

## Common Scene Patterns

### Game Loop with Transitions

```js
// In game.js
startGame() {
    this.addScene("menu", new MenuScene())
    this.addScene("level1", new Level1Scene())
    this.addScene("levelComplete", new CompleteScene())
    this.addScene("gameOver", new GameOverScene())
    
    this.goToScene("menu") // Start here
}
```

### Sharing Data Between Scenes

```js
// In game.js
export class Game extends Engine {
    playerScore = 0
    playerLives = 3
}

// In a level scene
onPostUpdate(engine) {
    const game = engine
    game.playerScore += 10
    
    if (playerDead) {
        game.playerLives--
        if (game.playerLives <= 0) {
            engine.goToScene("gameOver")
        } else {
            engine.goToScene("level1") // Retry
        }
    }
}
```

### Scene Chaining

```js
// Levels load sequentially
onPostUpdate(engine) {
    if (allEnemiesDefeated()) {
        engine.goToScene("boss") // Move to boss level
    }
}
```

## Best Practices

1. **Keep scenes focused**: One scene = one concept (one level, one menu, etc.)
2. **Use onInitialize for static content**: Platforms, decorations that don't change
3. **Use onActivate for dynamic content**: Player, enemies that spawn fresh
4. **Name scenes descriptively**: `"menu"`, `"level1"`, `"gameOver"` (not `"s1"`, `"s2"`)
5. **Handle state transitions carefully**: Plan what happens when you switch scenes

## Debugging Scenes

Check which scene is active:
```js
console.log(engine.currentScene.name)
```

Verify scene registration:
```js
console.log(engine.scenes) // Lists all registered scenes
```
