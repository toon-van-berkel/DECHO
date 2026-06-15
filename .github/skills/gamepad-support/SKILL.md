---
name: gamepad-support
description: 'Add gamepad support to existing games with keyboard controls. Use when adding joystick, arcade, PS4/Xbox controller, or arcade cabinet input to games that already handle cursor keys or WASD keyboard input.'
argument-hint: 'Game class with keyboard controls'
---

# Gamepad Support

Add gamepad input to games that already have keyboard controls for cursor keys or WASD keys. Gamepads work with PS4/Xbox controllers, arcade joysticks, and arcade cabinets.

## When to Use

- Game has keyboard controls (cursor keys or WASD) you want to mirror with gamepad
- Adding arcade cabinet or joystick support
- Adding local multiplayer via multiple controllers
- Maintaining keyboard controls while adding gamepad as an alternative input method

## Procedure

### Step 1: Enable Gamepad Input in Game Class

In your `Game` class `startGame()` method, enable gamepad detection:

```javascript
import { Axes, Buttons } from "excalibur"

export class Game extends Engine {
    mygamepad

    startGame() {
        // ... existing code ...
        
        this.input.gamepads.enabled = true
        this.input.gamepads.on('connect', (connectevent) => {
            console.log("gamepad detected")
            this.mygamepad = connectevent.gamepad
        })
    }
}
```

### Step 2: Add Gamepad Input to Player onPreUpdate()

In your `Player` actor class, modify the `onPreUpdate()` method to check for gamepad input in addition to keyboard:

```javascript
onPreUpdate(engine) {
    let moveX = 0
    let moveY = 0
    
    // Keyboard input (existing)
    if (engine.input.keyboard.isHeld(Keys.W)) moveY -= 1
    if (engine.input.keyboard.isHeld(Keys.S)) moveY += 1
    if (engine.input.keyboard.isHeld(Keys.A)) moveX -= 1
    if (engine.input.keyboard.isHeld(Keys.D)) moveX += 1
    
    // Gamepad input (new)
    if (engine.mygamepad) {
        moveX += engine.mygamepad.getAxes(Axes.LeftStickX)
        moveY += engine.mygamepad.getAxes(Axes.LeftStickY)
    }
    
    // Apply movement
    this.vel = new Vector(moveX * 10, moveY * 10)
}
```

### Step 3: Map Gamepad Buttons to Existing Actions

Add gamepad button presses to your existing action methods. Use `Buttons` enum for common buttons:

```javascript
onPreUpdate(engine) {
    // ... existing movement code ...
    
    // Gamepad buttons (in addition to keyboard checks)
    if (engine.mygamepad && engine.mygamepad.isButtonPressed(Buttons.Face1)) {
        this.jump() // or this.shoot(), etc.
    }
}
```

### Step 4: Common Button Mappings

Reference button names when mapping gamepad actions:

| Button | Code |
|--------|------|
| A (PlayStation ✕, Xbox X) | `Buttons.Face1` |
| B (PlayStation ○, Xbox A) | `Buttons.Face2` |
| X (PlayStation □, Xbox Y) | `Buttons.Face3` |
| Y (PlayStation △, Xbox B) | `Buttons.Face4` |
| LB / L1 | `Buttons.LeftBumper` |
| RB / R1 | `Buttons.RightBumper` |
| Start | `Buttons.Menu` |
| Select | `Buttons.View` |

### Step 5: Optional — Test and Adjust Stick Sensitivity

If movement feels too fast or too slow with gamepad, adjust the multiplier:

```javascript
const stickMultiplier = 8 // Adjust this value (lower = slower, higher = faster)
if (engine.mygamepad) {
    moveX += engine.mygamepad.getAxes(Axes.LeftStickX) * stickMultiplier
    moveY += engine.mygamepad.getAxes(Axes.LeftStickY) * stickMultiplier
}
```

## Tips

- **Stick Deadzone**: Excalibur handles stick deadzone automatically
- **Multiple Controllers**: Each `connect` event is a new controller—save each one in different player instances for local multiplayer
- **Combined Input**: Always add gamepad to keyboard input (use `+=` or separate detection) so both work simultaneously
- **No Nested Functions**: Create methods instead of inline functions in event handlers

## Local Multiplayer

For local multiplayer with multiple controllers, assign each gamepad to a player:

```javascript
// In Game.startGame()
this.input.gamepads.on('connect', (connectevent) => {
    let player = new Player(connectevent.gamepad)
    this.add(player)
})

// In Player class
constructor(gamepad) {
    super()
    this.mygamepad = gamepad
}

onPreUpdate(engine) {
    // Each player reads only its own gamepad
    const moveX = this.mygamepad.getAxes(Axes.LeftStickX)
    const moveY = this.mygamepad.getAxes(Axes.LeftStickY)
    // ... etc
}
```

## References

See [gamepad snippets](../../../snippets/gamepad.md) for additional patterns and advanced usage like button events and manual gamepad detection.