import { Canvas, Color, Engine, Rectangle, ScreenElement } from 'excalibur';
import { GAME_HEIGHT, GAME_WIDTH } from '../../../core/config';
import { THEME } from '../../../core/theme';
import { gameState } from '../../../core/game-state';
import { PanelButton } from '../info-panel/panel-button';
import { SHOP_ITEMS } from './shop-items.data';
import { ShopItemCard } from './shop-item-card';
import { SHOP_CARD_X, SHOP_CARD_Y, SHOP_LAYOUT, shopItemPosition } from './shop-layout';

/**
 * The shop overlay. Built like the InfoPanel: a full-screen scrim plus a glass
 * card, shown on the map. Reuses the shared {@link PanelButton} and THEME tokens
 * so it matches the rest of the UI. Token balance and item states are read live
 * from {@link gameState} each frame, so buying/topping up updates instantly.
 */
export class ShopPanel extends ScreenElement {
  private engine!: Engine;
  private title = 'SHOP';
  private accentHex: string = THEME.accent.red;
  private readonly card: ScreenElement;
  private readonly itemCards: ShopItemCard[] = [];
  private readonly addTokensButton: PanelButton;
  private readonly closeButton: PanelButton;

  constructor() {
    super({ x: 0, y: 0, width: GAME_WIDTH, height: GAME_HEIGHT, z: 100 });

    this.card = new ScreenElement({
      x: SHOP_CARD_X,
      y: SHOP_CARD_Y,
      width: SHOP_LAYOUT.card.width,
      height: SHOP_LAYOUT.card.height,
      z: 101,
    });
    this.card.graphics.use(
      new Canvas({
        width: SHOP_LAYOUT.card.width,
        height: SHOP_LAYOUT.card.height,
        cache: false,
        smoothing: true,
        draw: (ctx) => this.drawCard(ctx),
      }),
    );
    this.addChild(this.card);

    SHOP_ITEMS.forEach((item, index) => {
      const itemCard = new ShopItemCard(item, shopItemPosition(index), () =>
        gameState.buy(item.id, item.price),
      );
      this.itemCards.push(itemCard);
      this.addChild(itemCard);
    });

    const buttonY =
      SHOP_CARD_Y +
      SHOP_LAYOUT.card.height -
      SHOP_LAYOUT.card.padding -
      SHOP_LAYOUT.button.height;

    this.addTokensButton = new PanelButton({
      x: SHOP_CARD_X + SHOP_LAYOUT.card.padding,
      y: buttonY,
      width: SHOP_LAYOUT.button.addTokensWidth,
      height: SHOP_LAYOUT.button.height,
      text: '+10 TOKENS (TEST)',
      variant: 'secondary',
      onClick: () => gameState.addTokens(10),
    });
    this.closeButton = new PanelButton({
      x:
        SHOP_CARD_X +
        SHOP_LAYOUT.card.width -
        SHOP_LAYOUT.card.padding -
        SHOP_LAYOUT.button.closeWidth,
      y: buttonY,
      width: SHOP_LAYOUT.button.closeWidth,
      height: SHOP_LAYOUT.button.height,
      text: 'SLUITEN',
      variant: 'secondary',
      onClick: () => this.hide(),
    });
    this.addChild(this.addTokensButton);
    this.addChild(this.closeButton);
  }

  override onInitialize(engine: Engine): void {
    this.engine = engine;
    this.graphics.use(
      new Rectangle({
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        color: new Color(0, 0, 0, SHOP_LAYOUT.scrimAlpha),
      }),
    );
    // Clicking the scrim (outside the card) closes the shop.
    this.on('pointerup', (event) => {
      event.cancel();
      this.hide();
    });
    // Clicks on the card body must not fall through to the scrim and close it.
    this.card.on('pointerup', (event) => {
      event.cancel();
    });
    this.setOpen(false);
  }

  /** Opens the shop with a checkpoint's title and accent color. */
  show(title: string, accentHex: string): void {
    this.title = title;
    this.accentHex = accentHex;
    this.addTokensButton.setAccent(accentHex);
    this.closeButton.setAccent(accentHex);
    this.setOpen(true);
  }

  hide(): void {
    this.engine.canvas.style.cursor = 'default';
    this.setOpen(false);
  }

  private setOpen(open: boolean): void {
    this.graphics.isVisible = open;
    this.pointer.useColliderShape = open;
    this.pointer.useGraphicsBounds = open;

    this.card.graphics.isVisible = open;
    this.card.pointer.useColliderShape = open;
    this.card.pointer.useGraphicsBounds = open;

    for (const itemCard of this.itemCards) {
      itemCard.graphics.isVisible = open;
      itemCard.setInteractive(open);
    }

    this.addTokensButton.graphics.isVisible = open;
    this.closeButton.graphics.isVisible = open;
    this.addTokensButton.setEnabled(open);
    this.closeButton.setEnabled(open);
  }

  private drawCard(ctx: CanvasRenderingContext2D): void {
    const { width, height, padding, radius } = SHOP_LAYOUT.card;
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.roundRect(1, 1, width - 2, height - 2, radius);
    ctx.fillStyle = THEME.color.panelFill;
    ctx.shadowColor = this.accentHex;
    ctx.shadowBlur = 24;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = this.accentHex;
    ctx.stroke();

    // Header: title on the left, live token balance on the right.
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.fillStyle = this.accentHex;
    ctx.font = `900 26px ${THEME.font.heading}`;
    ctx.fillText(this.title, padding, padding + 22);

    ctx.textAlign = 'right';
    ctx.fillStyle = THEME.color.text;
    ctx.font = `700 18px ${THEME.font.label}`;
    ctx.fillText(`TOKENS: ${gameState.getTokens()}`, width - padding, padding + 20);

    ctx.textAlign = 'left';
    ctx.fillStyle = THEME.color.muted;
    ctx.font = `700 13px ${THEME.font.label}`;
    ctx.fillText('KOOP MET JE TOKENS', padding, padding + 48);

    const dividerY = padding + 60;
    ctx.strokeStyle = THEME.color.border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, dividerY);
    ctx.lineTo(width - padding, dividerY);
    ctx.stroke();
  }
}
