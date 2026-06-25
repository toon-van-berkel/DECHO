/**
 * Story service for DECHO.
 *
 * Main responsibility:
 * - Scenes call this file instead of reading story JSON directly.
 *
 * Made by: Toon
 */

import * as saveService from '../save/save-service';
import * as storyHelpers from './story-helpers';
import { storyDataObject } from './story-loader';
import * as storyState from './story-state';
import type * as storyTypes from './story-types';

export function startStory(): storyTypes.CurrentDialogueView {
  storyState.setCurrentStoryPosition(
    storyDataObject.flow.startLocationId,
    storyDataObject.flow.startDialogueId,
  );
  return getCurrentDialogue();
}

export function getCurrentDialogue(): storyTypes.CurrentDialogueView {
  const currentStoryState = storyState.getStoryState();
  return getDialogueView(
    currentStoryState.currentLocationId,
    currentStoryState.currentDialogueId,
  );
}

export function goToLocation(locationId: string): storyTypes.CurrentDialogueView {
  const defaultDialogueId = getDefaultDialogueIdForLocation(locationId);
  storyState.setCurrentStoryPosition(locationId, defaultDialogueId);
  const currentDialogueView = getCurrentDialogue();
  saveService.autosave();
  return currentDialogueView;
}

export function getLocationState(
  locationId: string,
): storyTypes.StoryResponse<storyTypes.LocationData | null> {
  return storyHelpers.getRequiredValue(
    storyDataObject.locationsObject,
    locationId,
    'Location',
  );
}

export function chooseDialogueOption(
  choiceId: string,
): storyTypes.StoryResponse<storyTypes.ChoiceResult | null> {
  const currentDialogueView = getCurrentDialogue();
  const selectedChoice = currentDialogueView.dialogue.choicesArray.find(
    (choiceObject) => choiceObject.id === choiceId,
  );

  if (!selectedChoice) {
    return storyHelpers.createStoryResponse(
      false,
      `Choice "${choiceId}" is missing.`,
      null,
    );
  }

  if (selectedChoice.dataEchoChange) {
    storyState.addDataEcho(selectedChoice.dataEchoChange);
  }

  if (selectedChoice.securedSkill) {
    storyState.secureSkill(selectedChoice.securedSkill);
  }

  const nextLocationId =
    selectedChoice.nextLocationId ?? currentDialogueView.location.id;
  const nextDialogueId = selectedChoice.nextDialogueId;

  if (selectedChoice.returnToMap) {
    saveService.autosave();
    return storyHelpers.createStoryResponse(true, 'Returning to map.', {
      nextScene: 'map',
      locationId: nextLocationId,
      dialogueId: currentDialogueView.dialogue.id,
      qteId: selectedChoice.qteId,
    });
  }

  if (!nextDialogueId) {
    saveService.autosave();
    return storyHelpers.createStoryResponse(true, 'Story branch completed.', {
      nextScene: selectedChoice.qteId ? 'qte' : 'ending',
      locationId: nextLocationId,
      dialogueId: currentDialogueView.dialogue.id,
      qteId: selectedChoice.qteId,
    });
  }

  storyState.setCurrentStoryPosition(nextLocationId, nextDialogueId);
  saveService.autosave();

  if (selectedChoice.qteId) {
    return storyHelpers.createStoryResponse(true, 'QTE should start.', {
      nextScene: 'qte',
      locationId: nextLocationId,
      dialogueId: nextDialogueId,
      qteId: selectedChoice.qteId,
    });
  }

  return storyHelpers.createStoryResponse(true, 'Dialogue option applied.', {
    nextScene: selectedChoice.nextLocationId ? 'location' : 'location',
    locationId: nextLocationId,
    dialogueId: nextDialogueId,
  });
}

export function startQte(
  qteId: string,
): storyTypes.StoryResponse<storyTypes.QteData | null> {
  return storyHelpers.getRequiredValue(storyDataObject.qteObject, qteId, 'QTE');
}

export function completeQte(
  qteId: string,
  isQtePassed: boolean,
): storyTypes.StoryResponse<storyTypes.ChoiceResult> {
  storyState.updateQteState(qteId, isQtePassed);

  if (isQtePassed) {
    const currentDialogueView = getCurrentDialogue();
    storyState.secureSkill(currentDialogueView.npc.requiredSkill);
  }

  const currentStoryState = storyState.getStoryState();
  saveService.autosave();
  return storyHelpers.createStoryResponse(true, 'QTE completed.', {
    nextScene: 'location',
    locationId: currentStoryState.currentLocationId,
    dialogueId: currentStoryState.currentDialogueId,
  });
}

export function getStorySummary(): storyTypes.StoryState {
  return storyState.getStoryState();
}

function getDialogueView(
  locationId: string,
  dialogueId: string,
): storyTypes.CurrentDialogueView {
  const location = storyDataObject.locationsObject[locationId];
  if (!location) {
    throw new Error(`Location "${locationId}" is missing.`);
  }

  const dialogue = storyDataObject.dialoguesObject[dialogueId];
  if (!dialogue) {
    throw new Error(`Dialogue "${dialogueId}" is missing.`);
  }

  const npc = storyDataObject.npcsObject[dialogue.npcId];
  if (!npc) {
    throw new Error(`NPC "${dialogue.npcId}" is missing.`);
  }

  return { location, npc, dialogue };
}

function getDefaultDialogueIdForLocation(locationId: string): string {
  const location = storyDataObject.locationsObject[locationId];
  const firstNpcId = location?.npcIdsArray[0];
  const npc = firstNpcId ? storyDataObject.npcsObject[firstNpcId] : null;

  if (!npc) {
    throw new Error(`No default NPC found for location "${locationId}".`);
  }

  return npc.defaultDialogueId;
}
