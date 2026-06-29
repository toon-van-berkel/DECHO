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
  const isContinueButton =
    optionsArray.length === 1 && optionsArray[0]?.action === 'continue';

  return optionsArray.map(
    (optionObject, optionIndex) =>
      new UiButton({
        text: isContinueButton ? 'Verder' : optionObject.label,
        x: isContinueButton
          ? dialogueLayout.choices.x + dialogueLayout.choices.width - 180
          : dialogueLayout.choices.x,
        y: getDialogueChoiceY(optionIndex),
        width: isContinueButton ? 180 : dialogueLayout.choices.width,
        height: dialogueLayout.choices.height,
        variant: isContinueButton ? 'secondary' : 'primary',
        onClick: () => onSelect(optionObject.id),
      }),
  );
}
