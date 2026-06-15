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
        this.add(new Platform(640, 680, 1280, 40)) // Floor
    }

    onActivate(engine) {
        // Create and add player when scene becomes active
        this.player = new Player()
        this.add(this.player)
        console.log("Level 2 activated!")
    }

    onDeactivate(engine) {
        // Clean up when leaving this scene
        console.log("Level 2 deactivated!")
    }

    onPostUpdate(engine) {
        // Frame-by-frame logic
        // Reset player if falls off bottom
        if (this.player.pos.y > 1000) {
            this.player.pos = new Vector(100, 100)
            this.player.vel = Vector.Zero
        }

        // Example: Auto-advance to next level if player reaches right side
        // if (this.player.pos.x > 1200) {
        //     engine.goToScene("level1")
        // }
    }
}
