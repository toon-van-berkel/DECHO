import { Color, DisplayMode, Engine, FadeInOut } from 'excalibur';
import { loader } from './resources';
import { GAME_WIDTH, GAME_HEIGHT } from './config';
import { MapScene } from './map/map-scene';
import { VNPlaceholderScene } from './scenes/vn-placeholder-scene';

const game = new Engine({
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  // Zoom the 16:9 view to fill the screen — no letterbox bars, no distortion.
  displayMode: DisplayMode.FitScreenAndZoom,
  // Disable pixel-art mode so the neon glow and text render smoothly.
  pixelArt: false,
  antialiasing: true,
  scenes: {
    map: MapScene,
    'vn-placeholder': VNPlaceholderScene,
  },
});

game.start('start', { // name of the start scene 'start'
  loader, // Optional loader (but needed for loading images/sounds)
  inTransition: new FadeInOut({ // Optional in transition
    duration: 1000,
    direction: 'in',
    color: Color.ExcaliburBlue
  })
}).then(() => {
  // Do something after the game starts
});
