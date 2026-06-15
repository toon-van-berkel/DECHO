import { ImageSource, Sound, Loader } from 'excalibur'

/**
 * Resources — central registry of every image and sound used in the game.
 * Each entry is an Object (instance) created with the `new` keyword from an
 * Excalibur ImageSource or Sound Class.
 * Every actor reads its sprite/sfx from this object instead of loading files itself.
 */
const Resources = {
    // menu
    // MainMenu: new ImageSource('images/ui/menu-background.png'),
    Logo: new ImageSource('images/ui/logo-dark.svg'), // white wordmark — sits on the black canvas

    // background

    // player
    // Player:        new ImageSource('images/player/player.png'),

    // projectiles

    // HUD

    // music
    // MenuMusic:     new Sound('sounds/menu-music.ogg'),
    // GameMusic:     new Sound('sounds/game-music.ogg'),

    // sfx

}

/**
 * ResourceLoader — Excalibur Loader Object that preloads every Resource above.
 * Created with `new Loader(...)` so the engine can wait on it before starting.
 */
const ResourceLoader = new Loader(Object.values(Resources))

export { Resources, ResourceLoader }
