import rawDialogData from './dialog.data.json';
import rawOptionsData from './options.data.json';
import type {
  CharacterDialogData,
  CharacterId,
  DialogData,
  DialogNode,
  LocationDialogData,
  LocationId,
  OptionGroup,
  OptionsData,
} from './dialog-types';

const dialogData = rawDialogData as DialogData;
const optionsData = rawOptionsData as OptionsData;

export function getLocation(locationId: LocationId): LocationDialogData | undefined {
  return dialogData.locations[locationId];
}

export function getCharacter(characterId: CharacterId): CharacterDialogData | undefined {
  return dialogData.characters[characterId];
}

export function getDialogNode(
  location: LocationDialogData,
  nodeId: string,
): DialogNode | undefined {
  return location.nodes[nodeId];
}

export function getOptionGroup(groupId: string): OptionGroup | undefined {
  return optionsData.optionGroups[groupId];
}
