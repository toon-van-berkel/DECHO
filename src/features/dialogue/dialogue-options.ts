/**
 * Dialogue option buttons for DECHO.
 *
 * Main responsibility:
 * - Renders story choices as reusable UI buttons.
 *
 * Made by: Richie
 */

import { UiButton } from '../../components/ui/button';
import {
  dialogueLayout,
  getDialogueChoiceY,
} from './dialogue-layout';
import type * as dialogueTypes from './dialogue-types';

export function createDialogueOptionButtons(
  optionsArray: dialogueTypes.DialogueOptionView[],
  onSelect: (choiceId: string) => void,
): UiButton[] {
  return optionsArray.map(
    (optionObject, optionIndex) =>
      new UiButton({
        text: optionObject.label,
        x: dialogueLayout.choices.x,
        y: getDialogueChoiceY(optionIndex),
        width: dialogueLayout.choices.width,
        height: dialogueLayout.choices.height,
        onClick: () => onSelect(optionObject.id),
      }),
  );
}
