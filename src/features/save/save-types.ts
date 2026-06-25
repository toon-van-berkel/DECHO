/**
 * Save types for DECHO.
 *
 * Main responsibility:
 * - Defines the localStorage save file shape for the 3 save slots.
 *
 * Made by: Richie
 */

import type * as storyTypes from '../story/story-types';

/** Current save format version; bump when the shape changes. */
export const SAVE_VERSION = 1 as const;

/** localStorage key holding the whole save file. */
export const SAVE_STORAGE_KEY = 'decho.save.v1';

/** Number of fixed save slots shown in the load/new-game menus. */
export const SAVE_SLOT_COUNT = 3;

export type SaveSlotId = 0 | 1 | 2;

export type SaveSlot = {
  version: typeof SAVE_VERSION;
  slotId: SaveSlotId;
  savedAtMs: number;
  label: string;
  state: storyTypes.StoryState;
};

export type SaveFile = {
  version: typeof SAVE_VERSION;
  activeSlotId: SaveSlotId | null;
  slots: (SaveSlot | null)[];
};
