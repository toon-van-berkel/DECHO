import { Actor, Engine, Scene, vec } from 'excalibur';
import { Resources } from '../resources';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { CHECKPOINTS } from './checkpoints.data';
import type { CheckpointConfig } from './checkpoint-config';
import { Checkpoint } from './checkpoint';
import { InfoPanel } from './info-panel';

/**
 * The world map: a full-screen background with one {@link Checkpoint} per entry
 * in {@link CHECKPOINTS}. Clicking a checkpoint opens the shared {@link InfoPanel}.
 */
export class MapScene extends Scene {
  private panel!: InfoPanel;

  override onInitialize(_engine: Engine): void {
    this.add(this.buildBackground());

    this.panel = new InfoPanel();
    this.add(this.panel);

    for (const config of CHECKPOINTS) {
      // Convert the config's fractional position into a world coordinate.
      const position = vec(config.position.x * GAME_WIDTH, config.position.y * GAME_HEIGHT);
      this.add(new Checkpoint(config, position, (clicked) => this.openInfo(clicked)));
    }
  }

  private openInfo(config: CheckpointConfig): void {
    this.panel.show(config);
  }

  /**
   * Builds the background, scaled to cover the whole 16:9 view (like CSS
   * `background-size: cover`) so it fills the screen without bars or distortion.
   */
  private buildBackground(): Actor {
    const image = Resources.MapBackground;
    const coverScale = Math.max(GAME_WIDTH / image.width, GAME_HEIGHT / image.height);
    const background = new Actor({
      pos: vec(GAME_WIDTH / 2, GAME_HEIGHT / 2),
      anchor: vec(0.5, 0.5),
      z: 0,
    });
    background.graphics.use(image.toSprite());
    background.scale = vec(coverScale, coverScale);
    return background;
  }
}
