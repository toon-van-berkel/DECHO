/**
 * Dialogue layout for DECHO.
 *
 * Main responsibility:
 * - Keeps dialogue box and choice buttons aligned.
 *
 * Made by: Richie
 */

import { mapRenderSize } from '../../core/engine/engine-config';

export const dialogueLayout = {
  box: {
    x: 96,
    y: 392,
    width: mapRenderSize.width - 192,
    height: 150,
    padding: 28,
  },
  choices: {
    x: 96,
    y: 560,
    width: mapRenderSize.width - 192,
    height: 44,
    gap: 12,
  },
} as const;

export function getDialogueChoiceY(choiceIndex: number): number {
  return (
    dialogueLayout.choices.y +
    choiceIndex * (dialogueLayout.choices.height + dialogueLayout.choices.gap)
  );
}
