/**
 * Dialogue service for DECHO.
 *
 * Main responsibility:
 * - Converts story dialogue into UI-friendly dialogue data.
 * - Keeps the order of shuffled choices stable while the same dialogue is open.
 *
 * Made by: Toon
 */

import type * as dialogueTypes from './dialogue-types';
import type * as storyTypes from '../story/story-types';

/**
 * Stores the randomized choice order per dialogue id.
 *
 * This prevents choices from reshuffling every time the UI re-renders
 * or when the dialogue view is created again.
 */
const choiceOrderCacheObject = new Map<string, storyTypes.DialogueChoice[]>();

/**
 * Converts the current story dialogue into the format used by the dialogue UI.
 */
export function createDialogueView(
  currentDialogueView: storyTypes.CurrentDialogueView,
): dialogueTypes.DialogueView {
  const orderedChoicesArray = getOrderedChoices(currentDialogueView.dialogue);

  return {
    speakerName: currentDialogueView.dialogue.speakerName,
    text: currentDialogueView.dialogue.text,

    // Only expose the data the UI needs for rendering and handling choices.
    optionsArray: orderedChoicesArray.map((choiceObject) => ({
      id: choiceObject.id,
      label: choiceObject.label,
      action: choiceObject.action,
    })),
  };
}

/**
 * Returns dialogue choices in a stable order.
 *
 * Dialogues with zero or one choice do not need shuffling.
 * Dialogues with multiple choices are shuffled once and then cached.
 */
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

  // Copy the original choices so the story JSON/data is not mutated.
  const shuffledChoicesArray = [...dialogueObject.choicesArray];

  // Fisher-Yates shuffle, used to randomize answer order fairly.
  for (
    let choiceIndex = shuffledChoicesArray.length - 1;
    choiceIndex > 0;
    choiceIndex -= 1
  ) {
    const swapIndex = Math.floor(Math.random() * (choiceIndex + 1));

    const currentChoice = shuffledChoicesArray[choiceIndex];
    const swapChoice = shuffledChoicesArray[swapIndex];

    // Safety check for strict TypeScript indexing.
    if (!currentChoice || !swapChoice) {
      continue;
    }

    shuffledChoicesArray[choiceIndex] = swapChoice;
    shuffledChoicesArray[swapIndex] = currentChoice;
  }

  choiceOrderCacheObject.set(dialogueObject.id, shuffledChoicesArray);
  return shuffledChoicesArray;
}