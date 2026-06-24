import type { ThemeAccentKey } from '../../../core/theme';

/** One buyable item in the shop. */
export interface ShopItemConfig {
  /** Unique id, used to track ownership in the save data. */
  id: string;
  /** Display name shown on the card. */
  name: string;
  /** Price in tokens. */
  price: number;
  /** Accent color key for the card. */
  theme: ThemeAccentKey;
}

/**
 * Placeholder products so the shop is testable end to end. There is no gameplay
 * effect wired up yet — buying only deducts tokens and marks the item as owned.
 * Replace these (and add effects) later.
 */
export const SHOP_ITEMS: ShopItemConfig[] = [
  { id: 'decryptor', name: 'Placeholder', price: 10, theme: 'cyan' },
  { id: 'id-spoofer', name: 'Placeholder', price: 20, theme: 'magenta' },
  { id: 'trace-tool', name: 'Placeholder', price: 15, theme: 'green' },
  { id: 'smeergeld', name: 'Placeholder', price: 25, theme: 'amber' },
];
