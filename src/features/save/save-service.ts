/**
 * Save service for DECHO.
 *
 * Main responsibility:
 * - Reads and writes the 3 game save slots in localStorage.
 *
 * Made by: Richie
 */

import { storyDataObject } from '../story/story-loader';
import * as storyState from '../story/story-state';
import type * as storyTypes from '../story/story-types';
import {
  SAVE_SLOT_COUNT,
  SAVE_STORAGE_KEY,
  SAVE_VERSION,
} from './save-types';
import type { SaveFile, SaveSlot, SaveSlotId } from './save-types';

function createEmptyFile(): SaveFile {
  return {
    version: SAVE_VERSION,
    activeSlotId: null,
    slots: Array.from({ length: SAVE_SLOT_COUNT }, () => null),
  };
}

function isStringArray(value: unknown): boolean {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isStateValid(value: unknown): value is storyTypes.StoryState {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const state = value as Record<string, unknown>;
  return (
    (state.runStatus === undefined ||
      state.runStatus === 'active' ||
      state.runStatus === 'won' ||
      state.runStatus === 'lost') &&
    typeof state.currentLocationId === 'string' &&
    state.currentLocationId.length > 0 &&
    typeof state.currentDialogueId === 'string' &&
    state.currentDialogueId.length > 0 &&
    typeof state.dataEcho === 'number' &&
    isStringArray(state.securedSkillsArray) &&
    isStringArray(state.completedQteIdsArray) &&
    isStringArray(state.failedQteIdsArray) &&
    (state.completedLevelIdsArray === undefined ||
      isStringArray(state.completedLevelIdsArray)) &&
    (state.runElapsedMs === undefined ||
      typeof state.runElapsedMs === 'number') &&
    (state.runStartedAtMs === undefined ||
      state.runStartedAtMs === null ||
      typeof state.runStartedAtMs === 'number') &&
    typeof state.flagsObject === 'object' &&
    state.flagsObject !== null &&
    typeof state.npcStatesObject === 'object' &&
    state.npcStatesObject !== null
  );
}

function isSlotValid(value: unknown): value is SaveSlot {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const slot = value as Record<string, unknown>;
  return (
    slot.version === SAVE_VERSION &&
    typeof slot.savedAtMs === 'number' &&
    typeof slot.label === 'string' &&
    isStateValid(slot.state)
  );
}

/** Parses stored JSON defensively; any malformed slot becomes empty. */
function normalizeFile(parsed: unknown): SaveFile {
  const file = createEmptyFile();
  if (!parsed || typeof parsed !== 'object') {
    return file;
  }

  const candidate = parsed as Record<string, unknown>;
  if (candidate.version !== SAVE_VERSION) {
    return file;
  }

  const slotsCandidate = Array.isArray(candidate.slots) ? candidate.slots : [];
  for (let slotId = 0; slotId < SAVE_SLOT_COUNT; slotId += 1) {
    const slotCandidate = slotsCandidate[slotId];
    file.slots[slotId] = isSlotValid(slotCandidate)
      ? { ...slotCandidate, slotId: slotId as SaveSlotId }
      : null;
  }

  const activeId = candidate.activeSlotId;
  file.activeSlotId =
    typeof activeId === 'number' &&
    Number.isInteger(activeId) &&
    activeId >= 0 &&
    activeId < SAVE_SLOT_COUNT &&
    file.slots[activeId] !== null
      ? (activeId as SaveSlotId)
      : null;

  return file;
}

function readFile(): SaveFile {
  try {
    const rawValue = localStorage.getItem(SAVE_STORAGE_KEY);
    return rawValue ? normalizeFile(JSON.parse(rawValue)) : createEmptyFile();
  } catch {
    return createEmptyFile();
  }
}

function writeFile(file: SaveFile): void {
  try {
    localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(file));
  } catch {
    // Storage unavailable or full — saving is best-effort.
  }
}

function snapshotCurrentState(): storyTypes.StoryState {
  const stateSnapshot = JSON.parse(
    JSON.stringify(storyState.getStoryState()),
  ) as storyTypes.StoryState;
  if (stateSnapshot.runStartedAtMs !== null) {
    stateSnapshot.runElapsedMs += Date.now() - stateSnapshot.runStartedAtMs;
    stateSnapshot.runStartedAtMs = null;
  }
  return stateSnapshot;
}

function deriveLabel(state: storyTypes.StoryState): string {
  const location = storyDataObject.locationsObject[state.currentLocationId];
  return location?.name || state.currentLocationId || 'Nieuw signaal';
}

function buildSlotFromCurrentState(slotId: SaveSlotId): SaveSlot {
  const state = snapshotCurrentState();
  return {
    version: SAVE_VERSION,
    slotId,
    savedAtMs: Date.now(),
    label: deriveLabel(state),
    state,
  };
}

function writeCurrentStateToSlot(slotId: SaveSlotId): void {
  const file = readFile();
  file.slots[slotId] = buildSlotFromCurrentState(slotId);
  file.activeSlotId = slotId;
  writeFile(file);
}

/** Returns the current slot contents (length === SAVE_SLOT_COUNT). */
export function listSlots(): (SaveSlot | null)[] {
  return readFile().slots;
}

export function hasAnySave(): boolean {
  return readFile().slots.some((slot) => slot !== null);
}

export function getActiveSlotId(): SaveSlotId | null {
  return readFile().activeSlotId;
}

/** Resets to a fresh game, stores it in the given slot, and makes it active. */
export function startNewGameInSlot(slotId: SaveSlotId): void {
  storyState.resetState();
  storyState.setCurrentStoryPosition(
    storyDataObject.flow.startLocationId,
    storyDataObject.flow.startDialogueId,
  );
  writeCurrentStateToSlot(slotId);
}

/** Permanently clears a save slot. Clears the active pointer if it matched. */
export function deleteSlot(slotId: SaveSlotId): void {
  const file = readFile();
  file.slots[slotId] = null;
  if (file.activeSlotId === slotId) {
    file.activeSlotId = null;
  }
  writeFile(file);
}

/** Loads a saved slot into the live game state. Returns false if empty. */
export function loadSlot(slotId: SaveSlotId): boolean {
  const file = readFile();
  const slot = file.slots[slotId];
  if (!slot) {
    return false;
  }

  storyState.loadState(slot.state);
  file.activeSlotId = slotId;
  writeFile(file);
  return true;
}

/**
 * Loads the most recently played slot, falling back to the first filled slot
 * if the active pointer is missing. Returns false when no save exists.
 */
export function continueActiveSlot(): boolean {
  const file = readFile();
  if (file.activeSlotId !== null) {
    return loadSlot(file.activeSlotId);
  }

  const firstFilledIndex = file.slots.findIndex((slot) => slot !== null);
  return firstFilledIndex === -1
    ? false
    : loadSlot(firstFilledIndex as SaveSlotId);
}

/** Writes the live game state to the active slot. No-op without one. */
export function autosave(): void {
  const activeSlotId = getActiveSlotId();
  if (activeSlotId === null) {
    return;
  }

  writeCurrentStateToSlot(activeSlotId);
}
