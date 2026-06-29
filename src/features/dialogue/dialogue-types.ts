/**
 * Dialogue UI types for DECHO.
 *
 * Main responsibility:
 * - Defines data passed from the story service to dialogue UI.
 *
 * Made by: Toon
 */

export type DialogueOptionView = {
  id: string;
  label: string;
  action: string;
};

export type DialogueView = {
  speakerName: string;
  text: string;
  optionsArray: DialogueOptionView[];
};
