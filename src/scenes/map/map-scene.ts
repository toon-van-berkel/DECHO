import { Actor, Engine, Scene, vec } from 'excalibur';
import { getBackgroundResource } from '../../core/resources';
import { GAME_WIDTH, GAME_HEIGHT } from '../../core/config';
import { CHECKPOINTS } from '../../features/map/checkpoints/checkpoints.data';
import type { CheckpointConfig } from '../../features/map/checkpoints/checkpoint-config';
import { Checkpoint } from '../../features/map/checkpoints/checkpoint';
import { InfoPanel } from '../../features/map/info-panel/info-panel';
import { ShopPanel } from '../../features/map/shop/shop-panel';
import { SkillHud } from '../../features/map/skill-inventory/skill-hud';
import { THEME } from '../../core/theme';

export class MapScene extends Scene {
  private panel!: InfoPanel;
  private shopPanel!: ShopPanel;

  override onInitialize(_engine: Engine): void {
    this.add(this.buildBackground());

    this.shopPanel = new ShopPanel();
    this.add(this.shopPanel);

    this.panel = new InfoPanel((config) => this.openShop(config));
    this.add(this.panel);

    this.add(new SkillHud());

    for (const config of CHECKPOINTS) {
      const position = vec(config.position.x * GAME_WIDTH, config.position.y * GAME_HEIGHT);
      this.add(new Checkpoint(config, position, (clicked) => this.openInfo(clicked)));
    }
  }

  private openInfo(config: CheckpointConfig): void {
    this.panel.show(config);
  }

  private openShop(config: CheckpointConfig): void {
    this.shopPanel.show(config.title, THEME.accent[config.theme]);
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
