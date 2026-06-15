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
        this.showDebug(true) // Enable to see collision hitboxes
    }

    startGame() {
        // Create and add the player
        const player = new Player()
        this.add(player)

        // Create and add platforms. base platform image size is 220x50 
        const platform1 = new Platform(200, 600, 220, 50) // x, y, width, height
        const platform2 = new Platform(700, 500, 220, 50)
        const platform3 = new Platform(400, 350, 220, 50)

        this.add(platform1)
        this.add(platform2)
        this.add(platform3)
    }

    onPostUpdate(){
      
    }
}

new Game()
