import { Actor, Engine, Vector, DisplayMode, SolverStrategy, Keys } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { SceneLevelOne } from "./scene-level-one.js"
import { SceneLevelTwo } from "./scene-level-two.js"

// AFTER: Game class refactored to use Scenes
export class GameAfter extends Engine {
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
        // Create scene instances
        const levelOne = new SceneLevelOne()
        const levelTwo = new SceneLevelTwo()

        // Register scenes with the game
        this.addScene("level1", levelOne)
        this.addScene("level2", levelTwo)

        // Start with the first level
        this.goToScene("level1")
    }

    onPostUpdate() {
        // Handle scene transitions via keyboard
        if (this.input.keyboard.wasPressed(Keys.N)) {
            this.goToScene("level2")
        }

        if (this.input.keyboard.wasPressed(Keys.P)) {
            this.goToScene("level1")
        }
    }
}

new GameAfter()
