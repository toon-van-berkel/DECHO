/**
 * Map scene for DECHO.
 *
 * Main responsibility:
 * - Shows the city map and sends players to story locations.
 *
 * Made by: Richie
 */

import * as excalibur from 'excalibur';
import { drawDivider } from '../../components/ui/hud-drawing';
import { mapRenderSize } from '../../core/engine/engine-config';
import { fadeToScene } from '../../core/navigation/navigate';
import { getBackgroundResource } from '../../core/resources/resource-loader';
import { THEME, withAlpha } from '../../core/theme/theme-index';
import { Checkpoint } from '../../features/map/checkpoint';
import { InfoPanel } from '../../features/map/info-panel';
import { mapCheckpointsArray } from '../../features/map/map-data';
import type * as mapTypes from '../../features/map/map-types';
import { PauseOverlay } from '../../features/menu/pause-overlay';
import * as saveService from '../../features/save/save-service';
import { ShopPanel } from '../../features/shop/shop-panel';
import { SkillHud } from '../../features/skills/skill-hud';
import * as storyService from '../../features/story/story-service';

export class MapScene extends excalibur.Scene {
  private infoPanel?: InfoPanel;
  private shopPanel?: ShopPanel;
  private pauseOverlay?: PauseOverlay;
  private isLeaving = false;
  private readonly checkpointsArray: Checkpoint[] = [];
  private selectedLocationId: string | null = null;

  override onInitialize(engine: excalibur.Engine): void {
    this.add(this.createBackground());
    this.add(this.createMapOverlay());

    this.infoPanel = new InfoPanel(
      (checkpointConfig) => this.travelToLocation(engine, checkpointConfig),
      (checkpointConfig) => this.openShop(checkpointConfig),
    );
    this.add(this.infoPanel);
    this.add(new SkillHud());

    mapCheckpointsArray.forEach((checkpointConfig) => {
      const checkpoint = new Checkpoint(
        checkpointConfig,
        excalibur.vec(
          checkpointConfig.position.x * mapRenderSize.width,
          checkpointConfig.position.y * mapRenderSize.height,
        ),
        (selectedCheckpoint) => this.selectCheckpoint(selectedCheckpoint),
      );
      this.checkpointsArray.push(checkpoint);
      this.add(checkpoint);
    });

    this.pauseOverlay = new PauseOverlay(() => {
      this.isLeaving = true;
      saveService.autosave();
      fadeToScene(engine, 'mainMenu');
    });
    this.add(this.pauseOverlay);
  }

  override onActivate(): void {
    this.isLeaving = false;
    this.pauseOverlay?.hide();
  }

  override onPreUpdate(engine: excalibur.Engine): void {
    if (this.isLeaving) {
      return;
    }

    if (engine.input.keyboard.wasPressed(excalibur.Keys.Escape)) {
      this.pauseOverlay?.toggle();
    }
  }

  private selectCheckpoint(
    checkpointConfig: mapTypes.MapCheckpointConfig,
  ): void {
    this.selectedLocationId = checkpointConfig.id;
    this.checkpointsArray.forEach((checkpoint) =>
      checkpoint.setSelected(this.selectedLocationId),
    );
    this.infoPanel?.show(checkpointConfig);
  }

  private travelToLocation(
    engine: excalibur.Engine,
    checkpointConfig: mapTypes.MapCheckpointConfig,
  ): void {
    storyService.goToLocation(checkpointConfig.locationId);
    void engine.goToScene('location');
  }

  private openShop(checkpointConfig: mapTypes.MapCheckpointConfig): void {
    if (this.shopPanel) {
      this.remove(this.shopPanel);
    }

    this.shopPanel = new ShopPanel();
    this.shopPanel.show(checkpointConfig.title, THEME.accent[checkpointConfig.theme]);
    this.add(this.shopPanel);
  }

  private createBackground(): excalibur.Actor {
    const backgroundResource = getBackgroundResource('background-map');
    if (!backgroundResource) {
      throw new Error('background-map is missing from resources.');
    }

    const coverScale = Math.max(
      mapRenderSize.width / backgroundResource.width,
      mapRenderSize.height / backgroundResource.height,
    );
    const backgroundActor = new excalibur.Actor({
      pos: excalibur.vec(mapRenderSize.width / 2, mapRenderSize.height / 2),
      anchor: excalibur.vec(0.5, 0.5),
      z: 0,
    });

    backgroundActor.graphics.use(backgroundResource.toSprite());
    backgroundActor.scale = excalibur.vec(coverScale, coverScale);
    return backgroundActor;
  }

  private createMapOverlay(): excalibur.ScreenElement {
    const overlayElement = new excalibur.ScreenElement({
      x: 0,
      y: 0,
      width: mapRenderSize.width,
      height: mapRenderSize.height,
      z: 5,
    });

    overlayElement.graphics.use(
      new excalibur.Canvas({
        width: mapRenderSize.width,
        height: mapRenderSize.height,
        cache: true,
        smoothing: true,
        draw: (context) => {
          context.clearRect(0, 0, mapRenderSize.width, mapRenderSize.height);
          context.fillStyle = withAlpha(THEME.color.bg, 0.18);
          context.fillRect(0, 0, mapRenderSize.width, mapRenderSize.height);

          context.strokeStyle = withAlpha(THEME.accent.cyan, 0.14);
          context.lineWidth = 1;
          for (let x = 0; x <= mapRenderSize.width; x += 80) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, mapRenderSize.height);
            context.stroke();
          }
          for (let y = 0; y <= mapRenderSize.height; y += 80) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(mapRenderSize.width, y);
            context.stroke();
          }

          context.fillStyle = withAlpha(THEME.color.bg, 0.58);
          context.fillRect(0, mapRenderSize.height - 42, mapRenderSize.width, 42);
          drawDivider(context, 32, mapRenderSize.height - 42, mapRenderSize.width - 64);
          context.fillStyle = THEME.color.muted;
          context.font = `700 12px ${THEME.font.label}`;
          context.textAlign = 'left';
          context.fillText('NOVA CITY ROUTE GRID', 42, mapRenderSize.height - 17);
        },
      }),
    );

    return overlayElement;
  }
}
