/**
 * Persistent player state shared across scenes. For now it holds the shop
 * currency ("tokens") and which shop items have been bought. State is saved to
 * localStorage so it survives a page refresh.
 *
 * This module is self-contained: importing it loads any saved state, and every
 * mutating method writes back. Nothing else in the game needs to change for the
 * data to persist — features opt in by importing `gameState`.
 */

const SAVE_KEY = 'decho-save';
const SAVE_VERSION = 1;

interface SaveData {
  version: number;
  tokens: number;
  ownedItems: string[];
}

class GameState {
  private tokens = 0;
  private readonly ownedItems = new Set<string>();

  constructor() {
    this.load();
  }

  /** Current spendable token balance. */
  getTokens(): number {
    return this.tokens;
  }

  /** Adds tokens (non-positive values are ignored) and persists. */
  addTokens(amount: number): void {
    if (amount <= 0) return;
    this.tokens += amount;
    this.save();
  }

  /** True when the balance covers `price`. */
  canAfford(price: number): boolean {
    return this.tokens >= price;
  }

  /** True when the item has already been bought. */
  isOwned(itemId: string): boolean {
    return this.ownedItems.has(itemId);
  }

  /**
   * Buys an item: deducts its price and records ownership. Returns false and
   * changes nothing when the item is already owned or unaffordable.
   */
  buy(itemId: string, price: number): boolean {
    if (this.isOwned(itemId) || !this.canAfford(price)) return false;
    this.tokens -= price;
    this.ownedItems.add(itemId);
    this.save();
    return true;
  }

  /** Clears all saved progress. Handy from the browser console while testing. */
  reset(): void {
    this.tokens = 0;
    this.ownedItems.clear();
    this.save();
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as Partial<SaveData>;
      if (typeof data.tokens === 'number' && Number.isFinite(data.tokens)) {
        this.tokens = Math.max(0, data.tokens);
      }
      if (Array.isArray(data.ownedItems)) {
        for (const id of data.ownedItems) {
          if (typeof id === 'string') this.ownedItems.add(id);
        }
      }
    } catch {
      // localStorage can be unavailable (private mode) or hold corrupt data;
      // fall back to a fresh state rather than crashing the game.
    }
  }

  private save(): void {
    try {
      const data: SaveData = {
        version: SAVE_VERSION,
        tokens: this.tokens,
        ownedItems: [...this.ownedItems],
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch {
      // Saving is best-effort; ignore quota/availability errors.
    }
  }
}

/** Singleton game state. Import this anywhere that needs tokens or inventory. */
export const gameState = new GameState();
