import { Actor, Engine, Vector, DisplayMode, SolverStrategy } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Player } from "./player.js"
import { Platform } from "./platform.js"

// BEFORE: Basic Game class with hardcoded player and platforms
export class GameBefore extends Engine {
    player

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
    }

    startGame() {
        // Everything in one place - not scalable!
        this.player = new Player()
        this.add(this.player)

        this.add(new Platform(200, 600, 300, 50))
        this.add(new Platform(700, 500, 300, 50))
        this.add(new Platform(400, 350, 400, 50))
        this.add(new Platform(640, 680, 1280, 40))
    }

    onPostUpdate() {
        if (this.player.pos.y > 1000) {
            this.player.pos = new Vector(100, 100)
            this.player.vel = Vector.Zero
        }
    }
}

new GameBefore()
