/**
 * Level completion helpers for DECHO.
 *
 * Made by: Toon van Berkel
 */

import * as storyState from '../story/story-state';
import { levelsArray } from './level-data';

export function completeLevelsForChoice(choiceId: string): void {
  levelsArray
    .filter((level) => level.completionChoiceIdsArray.includes(choiceId))
    .forEach((level) => storyState.completeLevel(level.id));
}

export function completeLevelsForQte(qteId: string): void {
  levelsArray
    .filter((level) => level.completionQteIdsArray?.includes(qteId))
    .forEach((level) => storyState.completeLevel(level.id));
}

export function getLevelsForLocation(locationId: string) {
  return levelsArray.filter((level) => level.locationId === locationId);
}

export function isLocationComplete(locationId: string): boolean {
  const locationLevelsArray = getLevelsForLocation(locationId);
  const completedIdsArray = storyState.getStoryState().completedLevelIdsArray;
  return (
    locationLevelsArray.length > 0 &&
    locationLevelsArray.every((level) => completedIdsArray.includes(level.id))
  );
}

export function getCompletedLevelCount(): number {
  const completedIdsArray = storyState.getStoryState().completedLevelIdsArray;
  return levelsArray.filter((level) => completedIdsArray.includes(level.id)).length;
}
