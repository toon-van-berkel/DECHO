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
