/**
 * Dialogue service for DECHO.
 *
 * Main responsibility:
 * - Converts story dialogue into UI-friendly dialogue data.
 *
 * Made by: Toon
 */

import type * as dialogueTypes from './dialogue-types';
import type * as storyTypes from '../story/story-types';

const choiceOrderCacheObject = new Map<string, storyTypes.DialogueChoice[]>();

export function createDialogueView(
  currentDialogueView: storyTypes.CurrentDialogueView,
): dialogueTypes.DialogueView {
  const orderedChoicesArray = getOrderedChoices(currentDialogueView.dialogue);

  return {
    speakerName: currentDialogueView.dialogue.speakerName,
    text: currentDialogueView.dialogue.text,
    optionsArray: orderedChoicesArray.map((choiceObject) => ({
      id: choiceObject.id,
      label: choiceObject.label,
      action: choiceObject.action,
    })),
  };
}

function getOrderedChoices(
  dialogueObject: storyTypes.DialogueData,
): storyTypes.DialogueChoice[] {
  if (dialogueObject.choicesArray.length <= 1) {
    return dialogueObject.choicesArray;
  }

  const cachedChoicesArray = choiceOrderCacheObject.get(dialogueObject.id);
  if (cachedChoicesArray) {
    return cachedChoicesArray;
  }

  const shuffledChoicesArray = [...dialogueObject.choicesArray];
  for (
    let choiceIndex = shuffledChoicesArray.length - 1;
    choiceIndex > 0;
    choiceIndex -= 1
  ) {
    const swapIndex = Math.floor(Math.random() * (choiceIndex + 1));
    const currentChoice = shuffledChoicesArray[choiceIndex];
    const swapChoice = shuffledChoicesArray[swapIndex];
    if (!currentChoice || !swapChoice) {
      continue;
    }

    shuffledChoicesArray[choiceIndex] = swapChoice;
    shuffledChoicesArray[swapIndex] = currentChoice;
  }

  choiceOrderCacheObject.set(dialogueObject.id, shuffledChoicesArray);
  return shuffledChoicesArray;
}
