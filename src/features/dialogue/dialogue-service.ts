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

export function createDialogueView(
  currentDialogueView: storyTypes.CurrentDialogueView,
): dialogueTypes.DialogueView {
  return {
    speakerName: currentDialogueView.dialogue.speakerName,
    text: currentDialogueView.dialogue.text,
    optionsArray: currentDialogueView.dialogue.choicesArray.map(
      (choiceObject) => ({
        id: choiceObject.id,
        label: choiceObject.label,
      }),
    ),
  };
}
