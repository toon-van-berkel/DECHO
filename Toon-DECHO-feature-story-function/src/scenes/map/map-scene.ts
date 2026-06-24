import { Actor, Engine, Scene, vec } from 'excalibur';
import { getBackgroundResource } from '../../core/resources';
import { GAME_WIDTH, GAME_HEIGHT } from '../../core/config';
import { CHECKPOINTS } from '../../features/map/checkpoints/checkpoints.data';
import type { CheckpointConfig } from '../../features/map/checkpoints/checkpoint-config';
import { Checkpoint } from '../../features/map/checkpoints/checkpoint';
import { InfoPanel } from '../../features/map/info-panel/info-panel';

export class MapScene extends Scene {
  private panel!: InfoPanel;

  override onInitialize(_engine: Engine): void {
    this.add(this.buildBackground());

    this.panel = new InfoPanel();
    this.add(this.panel);

    for (const config of CHECKPOINTS) {
      const position = vec(config.position.x * GAME_WIDTH, config.position.y * GAME_HEIGHT);
      this.add(new Checkpoint(config, position, (clicked) => this.openInfo(clicked)));
    }
  }

  private openInfo(config: CheckpointConfig): void {
    this.panel.show(config);
  }

  private buildBackground(): Actor {
    const image = getBackgroundResource('background-map');
    if (!image) {
      throw new Error('The map background is not registered in Resources.Backgrounds');
    }
    // Cover scaling keeps the fixed 16:9 scene filled if the source asset changes size.
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
