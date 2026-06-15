import './scss/main.scss'
import { Engine, DisplayMode, Color, SolverStrategy, Vector } from "excalibur"
import { ResourceLoader } from './resources.js'
import { SceneMenu } from './scenes/scene-menu.js'
import { SceneGame } from './scenes/scene-game.js'
import { SceneLeaderboard } from './scenes/scene-leaderboard.js'

/**
 * Main game class — the top-level Object that owns the Engine, the Scenes and the loop.
 * Inherits from Excalibur's Engine class via `extends`.
 * @extends Engine
 */
export class Game extends Engine {

    /**
     * Constructor — configures the engine and starts loading resources.
     * Runs automatically when `new Game()` is called from main.js.
     */
    constructor() {
        super({
            canvasElementId: 'game',
            width: 1280,
            height: 720,
            maxFps: 60,
            displayMode: DisplayMode.FitScreen,
            backgroundColor: Color.Black,
            physics: {
                solver: SolverStrategy.Arcade,
                gravity: new Vector(0, 0)
            }
        })

        ResourceLoader.backgroundColor = "#000000"

        // start the engine once all resources are loaded, then hand off to startGame()
        // the loader's play button handles the WebAudio unlock on the first click
        this.start(ResourceLoader).then(() => this.startGame())
    }

    /**
     * Registers the scenes and switches to the menu scene.
     * Called once after the resource loader finishes (user has clicked play).
     * @returns {void}
     */
    startGame() {
        this.addScene("menu", new SceneMenu())
        this.addScene("game", new SceneGame())
        this.addScene("leaderboard", new SceneLeaderboard())

        this.goToScene("menu")
    }
}
