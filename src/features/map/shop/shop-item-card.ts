import { Canvas, Engine, ScreenElement } from 'excalibur';
import { THEME, withAlpha } from '../../../core/theme';
import { gameState } from '../../../core/game-state';
import { SHOP_LAYOUT } from './shop-layout';
import type { ShopItemConfig } from './shop-items.data';

/**
 * A single clickable shop item. The whole card is the buy button: clicking it
 * buys the item when affordable and not yet owned. Visual state (price and the
 * KOOP / GEKOCHT / TE DUUR label) is read live from {@link gameState} each
 * frame, so no manual re-render is needed after a purchase.
 */
export class ShopItemCard extends ScreenElement {
  private hovered = false;
  private interactive = false;
  private readonly accent: string;

  constructor(
    private readonly item: ShopItemConfig,
    position: { x: number; y: number },
    private readonly onBuy: () => void,
  ) {
    super({
      x: position.x,
      y: position.y,
      width: SHOP_LAYOUT.item.width,
      height: SHOP_LAYOUT.item.height,
      z: 102,
    });
    this.accent = THEME.accent[item.theme];
    this.graphics.use(
      new Canvas({
        width: SHOP_LAYOUT.item.width,
        height: SHOP_LAYOUT.item.height,
        cache: false,
        smoothing: true,
        draw: (ctx) => this.draw(ctx),
      }),
    );
  }

  override onInitialize(engine: Engine): void {
    this.on('pointerenter', () => {
      if (!this.interactive || !this.isBuyable()) return;
      this.hovered = true;
      engine.canvas.style.cursor = 'pointer';
    });
    this.on('pointerleave', () => {
      this.hovered = false;
      engine.canvas.style.cursor = 'default';
    });
    this.on('pointerup', (event) => {
      if (!this.interactive) return;
      event.cancel();
      if (!this.isBuyable()) return;
      this.onBuy();
    });
  }

  /** Toggles pointer interaction (off while the panel is hidden). */
  setInteractive(interactive: boolean): void {
    this.interactive = interactive;
    this.hovered = false;
    this.pointer.useColliderShape = interactive;
    this.pointer.useGraphicsBounds = interactive;
  }

  private isBuyable(): boolean {
    return !gameState.isOwned(this.item.id) && gameState.canAfford(this.item.price);
  }

  private draw(ctx: CanvasRenderingContext2D): void {
    const { width, height } = SHOP_LAYOUT.item;
    const owned = gameState.isOwned(this.item.id);
    const affordable = gameState.canAfford(this.item.price);
    const dimmed = owned || !affordable;

    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.roundRect(1, 1, width - 2, height - 2, 10);
    ctx.fillStyle = withAlpha(this.accent, dimmed ? 0.05 : 0.12 + (this.hovered ? 0.08 : 0));
    ctx.fill();
    if (this.hovered && this.isBuyable()) {
      ctx.shadowColor = this.accent;
      ctx.shadowBlur = 18;
    }
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = dimmed ? THEME.color.border : this.accent;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = dimmed ? THEME.color.muted : THEME.color.text;
    ctx.font = `700 18px ${THEME.font.heading}`;
    ctx.fillText(this.item.name, 16, 34);

    ctx.fillStyle = owned ? THEME.color.muted : this.accent;
    ctx.font = `700 13px ${THEME.font.label}`;
    ctx.fillText(`${this.item.price} TOKENS`, 16, 58);

    const label = owned ? 'GEKOCHT' : affordable ? 'KOOP' : 'TE DUUR';
    ctx.textAlign = 'right';
    ctx.font = `900 13px ${THEME.font.heading}`;
    ctx.fillStyle = owned ? THEME.accent.green : affordable ? this.accent : THEME.color.muted;
    ctx.fillText(label, width - 16, height - 16);
  }
}
