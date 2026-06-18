import { Color, DisplayMode, Engine, FadeInOut } from 'excalibur';
import { loader } from './core/resources';
import { GAME_WIDTH, GAME_HEIGHT } from './core/config';
import { MapScene } from './scenes/map/map-scene';
import { LocationScene } from './scenes/location/location-scene';

const game = new Engine({
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  displayMode: DisplayMode.FitScreenAndZoom,
  // The map uses smooth text and glow effects rather than pixel-art rendering.
  pixelArt: false,
  antialiasing: true,
  scenes: {
    map: MapScene,
    location: LocationScene,
  },
});

void game.start('map', {
  loader,
  inTransition: new FadeInOut({
    duration: 1000,
    direction: 'in',
    color: Color.ExcaliburBlue,
  }),
});
