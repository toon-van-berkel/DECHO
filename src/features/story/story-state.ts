/**
 * Story state access for DECHO.
 *
 * Main responsibility:
 * - Keeps story state updates in one predictable place.
 *
 * Made by: Vince
 */

import { gameStateObject } from '../../core/state/game-state';
import type * as storyTypes from './story-types';

export function getStoryState(): storyTypes.StoryState {
  return gameStateObject;
}

/**
 * Resets the live game state to a fresh game.
 *
 * Mutates gameStateObject in place because scenes and features read it by
 * reference. startStory() afterwards sets the opening location and dialogue.
 */
export function resetState(): void {
  gameStateObject.runStatus = 'active';
  gameStateObject.currentLocationId = '';
  gameStateObject.currentDialogueId = '';
  gameStateObject.dataEcho = 0;
  gameStateObject.securedSkillsArray = [];
  gameStateObject.completedQteIdsArray = [];
  gameStateObject.failedQteIdsArray = [];
  gameStateObject.completedLevelIdsArray = [];
  gameStateObject.runElapsedMs = 0;
  gameStateObject.runStartedAtMs = null;
  gameStateObject.flagsObject = {};
  gameStateObject.npcStatesObject = {};
}

/**
 * Replaces the live game state with a loaded save.
 *
 * Copies field-by-field into gameStateObject (kept by reference) and clones the
 * arrays/records so the loaded save object is never mutated by later gameplay.
 */
export function loadState(nextState: storyTypes.StoryState): void {
  gameStateObject.runStatus = nextState.runStatus ?? 'active';
  gameStateObject.currentLocationId = nextState.currentLocationId;
  gameStateObject.currentDialogueId = nextState.currentDialogueId;
  gameStateObject.dataEcho = nextState.dataEcho;
  gameStateObject.securedSkillsArray = [...nextState.securedSkillsArray];
  gameStateObject.completedQteIdsArray = [...nextState.completedQteIdsArray];
  gameStateObject.failedQteIdsArray = [...nextState.failedQteIdsArray];
  gameStateObject.completedLevelIdsArray = [
    ...(nextState.completedLevelIdsArray ?? []),
  ];
  gameStateObject.runElapsedMs = nextState.runElapsedMs ?? 0;
  gameStateObject.runStartedAtMs = null;
  gameStateObject.flagsObject = { ...nextState.flagsObject };
  gameStateObject.npcStatesObject = { ...nextState.npcStatesObject };
}

export function setCurrentStoryPosition(
  locationId: string,
  dialogueId: string,
): void {
  gameStateObject.currentLocationId = locationId;
  gameStateObject.currentDialogueId = dialogueId;
}

export function addDataEcho(amount: number): void {
  gameStateObject.dataEcho += amount;
}

export function secureSkill(skillName: string): void {
  if (!gameStateObject.securedSkillsArray.includes(skillName)) {
    gameStateObject.securedSkillsArray.push(skillName);
  }
}

export function updateQteState(qteId: string, isQtePassed: boolean): void {
  const targetArray = isQtePassed
    ? gameStateObject.completedQteIdsArray
    : gameStateObject.failedQteIdsArray;

  if (!targetArray.includes(qteId)) {
    targetArray.push(qteId);
  }
}

export function completeLevel(levelId: string): void {
  if (!gameStateObject.completedLevelIdsArray.includes(levelId)) {
    gameStateObject.completedLevelIdsArray.push(levelId);
  }
}

export function setRunStatus(runStatus: storyTypes.StoryState['runStatus']): void {
  gameStateObject.runStatus = runStatus;
}
