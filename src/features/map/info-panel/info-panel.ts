import { Color, Engine, FadeInOut, Rectangle, ScreenElement } from 'excalibur';
import { GAME_HEIGHT, GAME_WIDTH } from '../../../core/config';
import { themeColorHex } from '../../../core/theme';
import type { CheckpointConfig } from '../checkpoints/checkpoint-config';
import { InfoCard } from './info-card';
import { INFO_CARD_X, INFO_CARD_Y, INFO_PANEL_LAYOUT } from './info-panel-layouts';
import { PanelButton } from './panel-button';

/**
 * Coordinates the info overlay. Drawing and pointer behavior are delegated to
 * the card and button components.
 */
export class InfoPanel extends ScreenElement {
  private engine!: Engine;
  private config: CheckpointConfig | null = null;
  private readonly card = new InfoCard();
  private readonly travelButton: PanelButton;
  private readonly closeButton: PanelButton;
  private readonly shopButton: PanelButton;
  private showShopButton = false;

  constructor(private readonly onShop?: (config: CheckpointConfig) => void) {
    super({ x: 0, y: 0, width: GAME_WIDTH, height: GAME_HEIGHT, z: 100 });

    const buttonY =
      INFO_CARD_Y +
      INFO_PANEL_LAYOUT.card.height -
      INFO_PANEL_LAYOUT.card.padding -
      INFO_PANEL_LAYOUT.travelButton.height;

    this.travelButton = new PanelButton({
      x: INFO_CARD_X + INFO_PANEL_LAYOUT.card.padding,
      y: buttonY,
      ...INFO_PANEL_LAYOUT.travelButton,
      text: 'REIS HIERHEEN',
      variant: 'primary',
      onClick: () => this.travel(),
    });
    this.closeButton = new PanelButton({
      x:
        INFO_CARD_X +
        INFO_PANEL_LAYOUT.card.width -
        INFO_PANEL_LAYOUT.card.padding -
        INFO_PANEL_LAYOUT.closeButton.width,
      y: buttonY,
      ...INFO_PANEL_LAYOUT.closeButton,
      text: 'SLUITEN',
      variant: 'secondary',
      onClick: () => this.hide(),
    });

    this.shopButton = new PanelButton({
      x: INFO_CARD_X + INFO_PANEL_LAYOUT.card.padding + INFO_PANEL_LAYOUT.travelButton.width + 16,
      y: buttonY,
      width: 140,
      height: INFO_PANEL_LAYOUT.travelButton.height,
      text: 'SHOP',
      variant: 'primary',
      onClick: () => this.openShop(),
    });

    this.addChild(this.card);
    this.addChild(this.travelButton);
    this.addChild(this.closeButton);
    this.addChild(this.shopButton);
  }

  override onInitialize(engine: Engine): void {
    this.engine = engine;
    this.graphics.use(
      new Rectangle({
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        color: new Color(0, 0, 0, INFO_PANEL_LAYOUT.scrimAlpha),
      }),
    );
    this.on('pointerup', (event) => {
      event.cancel();
      this.hide();
    });
    this.setOpen(false);
  }

  show(config: CheckpointConfig): void {
    const accentHex = themeColorHex(config.theme);
    this.config = config;
    this.showShopButton = config.opensShop === true && this.onShop !== undefined;
    this.card.setContent(config, accentHex);
    this.travelButton.setAccent(accentHex);
    this.shopButton.setAccent(accentHex);
    this.setOpen(true);
  }

  hide(): void {
    this.engine.canvas.style.cursor = 'default';
    this.setOpen(false);
  }

  private setOpen(open: boolean): void {
    const shopVisible = open && this.showShopButton;
    this.graphics.isVisible = open;
    this.card.graphics.isVisible = open;
    this.travelButton.graphics.isVisible = open;
    this.closeButton.graphics.isVisible = open;
    this.shopButton.graphics.isVisible = shopVisible;
    this.pointer.useColliderShape = open;
    this.pointer.useGraphicsBounds = open;
    this.travelButton.setEnabled(open);
    this.closeButton.setEnabled(open);
    this.shopButton.setEnabled(shopVisible);
  }

  private travel(): void {
    if (!this.config) return;

    const config = this.config;
    this.hide();
    void this.engine.goToScene(config.targetScene, {
      sceneActivationData: config,
      destinationIn: new FadeInOut({
        duration: 400,
        direction: 'in',
        color: Color.Black,
      }),
      sourceOut: new FadeInOut({
        duration: 300,
        direction: 'out',
        color: Color.Black,
      }),
    });
  }

  private openShop(): void {
    if (!this.config || !this.onShop) return;
    const config = this.config;
    this.hide();
    this.onShop(config);
  }
}
