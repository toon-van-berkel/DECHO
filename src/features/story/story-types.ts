/**
 * Story types for DECHO.
 *
 * Main responsibility:
 * - Defines the data shapes used by the story service.
 *
 * Made by: Toon
 */

export type StoryChoiceAction = 'cooperate' | 'force' | 'trade' | 'continue';

export type StoryResponse<T> = {
  isSuccess: boolean;
  message: string;
  data: T;
};

export type StoryState = {
  currentLocationId: string;
  currentDialogueId: string;
  dataEcho: number;
  securedSkillsArray: string[];
  completedQteIdsArray: string[];
  failedQteIdsArray: string[];
  flagsObject: Record<string, boolean | string | number>;
  npcStatesObject: Record<string, NpcState>;
};

export type NpcState = {
  npcId: string;
  supportStatus: 'pending' | 'secured' | 'lost';
  qteStatus: 'pending' | 'passed' | 'failed';
};

export type StoryFlow = {
  startLocationId: string;
  startDialogueId: string;
  requiredSkillsArray: string[];
  locationOrderArray: string[];
};

export type LocationData = {
  id: string;
  name: string;
  backgroundResourceKey: string;
  characterResourceKeysArray: string[];
  npcIdsArray: string[];
  nextLocationId: string | null;
  mapTheme: 'cyan' | 'magenta' | 'green' | 'amber' | 'violet' | 'red';
};

export type NpcData = {
  id: string;
  name: string;
  locationId: string;
  requiredSkill: string;
  defaultDialogueId: string;
};

export type DialogueData = {
  id: string;
  npcId: string;
  speakerName: string;
  text: string;
  choicesArray: DialogueChoice[];
};

export type DialogueChoice = {
  id: string;
  label: string;
  action: StoryChoiceAction;
  nextDialogueId: string | null;
  nextLocationId?: string;
  returnToMap?: boolean;
  qteId?: string;
  dataEchoChange?: number;
  securedSkill?: string;
};

export type QteData = {
  id: string;
  title: string;
  prompt: string;
  successText: string;
  failText: string;
  sequenceLength: number;
  timeLimitMs: number;
};

export type CurrentDialogueView = {
  location: LocationData;
  npc: NpcData;
  dialogue: DialogueData;
};

export type ChoiceResult = {
  nextScene: 'map' | 'location' | 'qte' | 'ending';
  locationId: string;
  dialogueId: string;
  qteId?: string;
};
