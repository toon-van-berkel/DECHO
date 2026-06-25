/**
 * Global game state for DECHO.
 *
 * Main responsibility:
 * - Stores story progress shared between scenes and features.
 *
 * Made by: Vince
 */

import type * as storyTypes from '../../features/story/story-types';

export const gameStateObject: storyTypes.StoryState = {
  currentLocationId: 'market_square',
  currentDialogueId: 'jax_1',
  dataEcho: 0,
  securedSkillsArray: [],
  completedQteIdsArray: [],
  failedQteIdsArray: [],
  flagsObject: {},
  npcStatesObject: {},
};
