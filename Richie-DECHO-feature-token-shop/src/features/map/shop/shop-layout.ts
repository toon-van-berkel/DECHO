import { GAME_HEIGHT, GAME_WIDTH } from '../../../core/config';

/** Geometry for the shop panel, mirroring the info-panel layout style. */
export const SHOP_LAYOUT = {
  card: { 
    width: 680, 
    height: 460, 
    padding: 32, 
    radius: 16 
  },
  item: { 
    width: 300, 
    height: 96, 
    gap: 16 
  },

  columns: 2,
  /** Y offset inside the card where the item grid starts. */
  contentTop: 104,
  button: { 
    addTokensWidth: 180,
    closeWidth: 120,
    height: 44
  },
  scrimAlpha: 0.55,
} as const;

export const SHOP_CARD_X = (GAME_WIDTH - SHOP_LAYOUT.card.width) / 2;
export const SHOP_CARD_Y = (GAME_HEIGHT - SHOP_LAYOUT.card.height) / 2;

/** Absolute top-left position of the item card at grid index `index`. */
export function shopItemPosition(index: number): { x: number; y: number } {
  const { padding } = SHOP_LAYOUT.card;
  const { width, height, gap } = SHOP_LAYOUT.item;
  const col = index % SHOP_LAYOUT.columns;
  const row = Math.floor(index / SHOP_LAYOUT.columns);
  return {
    x: SHOP_CARD_X + padding + col * (width + gap),
    y: SHOP_CARD_Y + SHOP_LAYOUT.contentTop + row * (height + gap),
  };
}
