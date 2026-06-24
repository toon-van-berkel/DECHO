export type LocationId =
  | 'map'
  | 'docks'
  | 'tower'
  | 'clinic'
  | 'bar'
  | 'blocks'
  | 'black-market';

export type CharacterId = 'narrator' | 'rook' | 'mara-vex';
export type CharacterPosition = 'left' | 'center' | 'right';
export type DialogAction = 'returnToMap';

export interface DialogNode {
  id: string;
  speaker: CharacterId;
  text: string;
  optionGroup?: string;
  nextNode?: string;
  action?: DialogAction;
}

export interface LocationDialogData {
  id: LocationId;
  name: string;
  background: string;
  characters: CharacterId[];
  startNode: string;
  nodes: Record<string, DialogNode>;
}

export interface CharacterDialogData {
  id: CharacterId;
  name: string;
  location: LocationId;
  sprite: string | null;
  position: CharacterPosition;
  description: string;
}

export interface DialogData {
  locations: Record<LocationId, LocationDialogData>;
  characters: Record<CharacterId, CharacterDialogData>;
}

export interface OptionEffect {
  clues?: string[];
  trust?: Record<string, number>;
}

export interface PlayerOption {
  id: string;
  label: string;
  nextNode: string | null;
  action?: DialogAction;
  effects?: OptionEffect;
}

export type OptionGroup = PlayerOption[];

export interface OptionsData {
  optionGroups: Record<string, OptionGroup>;
}

export interface DialogProgress {
  clues: Set<string>;
  trust: Record<string, number>;
}

export interface LocationSceneActivationData {
  locationId: LocationId;
  theme?: ThemeAccentKey;
}
import type { ThemeAccentKey } from '../../../core/theme';
