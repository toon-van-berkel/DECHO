import { Actor, Vector, CollisionType, Keys } from "excalibur"
import { Resources } from './resources.js'
import { Platform } from './platform.js'

export class Player extends Actor {
    jumpForce = 300

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

    // Handle left/right movement with WASD or arrow keys
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

        // Maintain vertical velocity from gravity, only change horizontal
        this.vel = new Vector(xspeed, this.vel.y)
    }

    // Handle jumping with Space
  handleJump(engine, delta) {
    if (engine.input.keyboard.wasPressed(Keys.Space) || engine.input.keyboard.wasPressed(Keys.W)) {
      this.body.applyLinearImpulse(new Vector(0, -300 * delta))
    }
  }

    onCollisionStart(event) {

    }

    onCollisionEnd(event) {

    }

    onPostUpdate() {
        // Reset game if player falls off the world
        if (this.pos.y > 1000) {
            this.pos = new Vector(100, 100)
            this.vel = Vector.Zero
        }
    }
}
