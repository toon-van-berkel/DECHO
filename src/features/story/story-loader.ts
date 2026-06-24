/**
 * Story loader for DECHO.
 *
 * Main responsibility:
 * - Loads final story JSON into records for the story service.
 *
 * Made by: Toon
 */

import storyFlowJson from '../../data/story/story-flow.json';
import dialogueDataJson from '../../data/story/dialogues.json';
import type * as storyTypes from './story-types';

const locationFilesObject = import.meta.glob<storyTypes.LocationData>(
  '../../data/locations/location-*.json',
  { eager: true, import: 'default' },
);

const npcFilesObject = import.meta.glob<storyTypes.NpcData>(
  '../../data/npcs/npc-*.json',
  { eager: true, import: 'default' },
);

const qteFilesObject = import.meta.glob<storyTypes.QteData>(
  '../../data/qte/qte-*.json',
  { eager: true, import: 'default' },
);

function createRecordFromArray<T extends { id: string }>(
  sourceArray: T[],
): Record<string, T> {
  return Object.fromEntries(
    sourceArray.map((sourceObject) => [sourceObject.id, sourceObject]),
  );
}

function createRecordFromFiles<T extends { id: string }>(
  filesObject: Record<string, T>,
): Record<string, T> {
  return createRecordFromArray(Object.values(filesObject));
}

export const storyDataObject = {
  flow: storyFlowJson as storyTypes.StoryFlow,
  locationsObject: createRecordFromFiles(locationFilesObject),
  npcsObject: createRecordFromFiles(npcFilesObject),
  dialoguesObject: createRecordFromArray(
    dialogueDataJson as storyTypes.DialogueData[],
  ),
  qteObject: createRecordFromFiles(qteFilesObject),
};
