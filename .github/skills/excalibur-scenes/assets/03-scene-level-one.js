import { Scene, Vector } from "excalibur"
import { Player } from "./player.js"
import { Platform } from "./platform.js"

export class SceneLevelOne extends Scene {
    player

    onInitialize(engine) {
        // Add static platforms to scene (only once)
        this.add(new Platform(200, 600, 300, 50))
        this.add(new Platform(700, 500, 300, 50))
        this.add(new Platform(400, 350, 400, 50))
        this.add(new Platform(640, 680, 1280, 40)) // Floor
    }

    onActivate(engine) {
        // Create and add player when scene becomes active
        this.player = new Player()
        this.add(this.player)
        console.log("Level 1 activated!")
    }

    onDeactivate(engine) {
        // Clean up when leaving this scene
        console.log("Level 1 deactivated!")
    }

    onPostUpdate(engine) {
        // Frame-by-frame logic
        // Reset player if falls off bottom
        if (this.player.pos.y > 1000) {
            this.player.pos = new Vector(100, 100)
            this.player.vel = Vector.Zero
        }
    }
}
