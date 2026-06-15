# Physics Guide for Platform Games

## Arcade vs. Realistic Physics

For platformer games, **Arcade Physics** is recommended because:
- Simpler collision detection (rectangular bounding boxes)
- Predictable gravity behavior
- Doesn't require complex rigid-body calculations
- Good for tile-based and top-down games

## Gravity

Gravity is defined in the Game class:

```js
physics: {
    solver: SolverStrategy.Arcade,
    gravity: new Vector(0, 800), // x=0, y=800 pixels/second²
}
```

**Higher gravity value** = objects fall faster. Typical range for platformers: **500–1000**.

## Collision Types

| Type | Behavior | Use Case |
|------|----------|----------|
| `Active` | Affected by physics, can move | Player, falling objects |
| `Fixed` | Immovable, unaffected by gravity | Platforms, walls, ground |
| `Passive` | Affected by physics but ignored by other bodies | Collectibles, decorations |
| `PreventCollision` | No collisions at all | Ghost objects |

## Velocity vs. Impulse

### Direct Velocity (Simpler)
```js
this.vel = new Vector(200, this.vel.y) // Move right, keep vertical velocity
```
**Use for**: Simple movement without physics-based interactions.

### Linear Impulse (Physics-Based)
```js
this.body.applyLinearImpulse(new Vector(0, -300 * delta))
```
**Use for**: Jumping, pushing objects, force interactions. Works better with gravity.

## Mass and Friction

```js
this.body.mass = 7 // Higher mass = harder to push
this.body.friction = 0.1 // Only with realistic physics
```

## Grounding Detection

The player shouldn't jump while in mid-air. Detect grounding via collision:

```js
private isGrounded = false

onCollisionStart(event) {
    if (event.other.owner instanceof Platform) {
        // Check if collision normal points upward (standing on platform)
        if (event.contact.normal.y < -0.5) {
            this.isGrounded = true
        }
    }
}

onCollisionEnd(event) {
    if (event.other.owner instanceof Platform) {
        this.isGrounded = false
    }
}
```

## Common Issues

**Player falls through platforms**: Check that Platform has `CollisionType.Fixed` and Player has `CollisionType.Active`.

**Player can't jump**: Ensure `isGrounded` is being set correctly. Use `this.showDebug(true)` to visualize collision boxes.

**Jerky movement**: Multiply impulse by `delta` (time since last frame) to make behavior frame-rate independent.
