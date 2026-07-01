/**
 * Local run timer and best-time storage for DECHO.
 *
 * Made by: Toon van Berkel
 */

import * as storyState from '../story/story-state';

const BEST_TIME_STORAGE_KEY = 'decho.best-time.v1';
const LAST_RUN_STORAGE_KEY = 'decho.last-run.v1';
export const SPEEDRUN_TIME_LIMIT_MS = 5 * 60 * 1000;

export function startRun(): void {
  const state = storyState.getStoryState();
  state.runElapsedMs = 0;
  state.runStartedAtMs = Date.now();
}

export function resumeRun(): void {
  const state = storyState.getStoryState();
  if (state.runStartedAtMs === null) {
    state.runStartedAtMs = Date.now();
  }
}

export function pauseRun(): void {
  const state = storyState.getStoryState();
  if (state.runStartedAtMs !== null) {
    state.runElapsedMs += Date.now() - state.runStartedAtMs;
    state.runStartedAtMs = null;
  }
}

export function getCurrentRunTimeMs(): number {
  const state = storyState.getStoryState();
  return (
    state.runElapsedMs +
    (state.runStartedAtMs === null ? 0 : Date.now() - state.runStartedAtMs)
  );
}

export function finishRun(): number {
  pauseRun();
  const finalTimeMs = getCurrentRunTimeMs();
  const bestTimeMs = getBestTimeMs();
  try {
    if (finalTimeMs > 0) {
      localStorage.setItem(LAST_RUN_STORAGE_KEY, String(finalTimeMs));
    }
    if (
      isScoreTimeValid(finalTimeMs) &&
      (bestTimeMs === null || finalTimeMs < bestTimeMs)
    ) {
      localStorage.setItem(BEST_TIME_STORAGE_KEY, String(finalTimeMs));
    }
  } catch {
    // The run still completes when browser storage is unavailable.
  }
  return finalTimeMs;
}

export function getBestTimeMs(): number | null {
  try {
    const storedValue = localStorage.getItem(BEST_TIME_STORAGE_KEY);
    const value = Number(storedValue);
    if (isScoreTimeValid(value)) {
      return value;
    }
    if (storedValue !== null) {
      localStorage.removeItem(BEST_TIME_STORAGE_KEY);
    }
    return null;
  } catch {
    return null;
  }
}

export function getLastRunTimeMs(): number | null {
  try {
    const value = Number(localStorage.getItem(LAST_RUN_STORAGE_KEY));
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

export function isScoreTimeValid(timeMs: number): boolean {
  return (
    Number.isFinite(timeMs) &&
    timeMs > 0 &&
    timeMs < SPEEDRUN_TIME_LIMIT_MS
  );
}

export function formatRunTime(timeMs: number | null): string {
  if (timeMs === null) {
    return '--:--.---';
  }
  const totalSeconds = Math.floor(timeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor(timeMs % 1000);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}
