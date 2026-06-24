import type * as types from "./story-types";

function createRecordFromJsonFiles<T extends { id: string }>(
    files: Record<string, T>
): Record<string, T> {
    return Object.fromEntries(Object.values(files).map((item) => [item.id, item]));
}

const locationFiles = import.meta.glob("../features/story/data/locations/location-*.json", {
    eager: true,
    import: "default"
}) as Record<string, types.StoryLocation>;

const npcFiles = import.meta.glob("../features/story/data/npcs/npc-*.json", {
    eager: true,
    import: "default"
}) as Record<string, types.StoryNpc>;

const dialogFiles = import.meta.glob("../features/story/data/dialogs/**/dialog-*.json", {
    eager: true,
    import: "default"
}) as Record<string, types.Dialog>;

const quickTimeEventFiles = import.meta.glob(
    "../features/story/data/quick-time-events/qte-*.json",
    {
        eager: true,
        import: "default"
    }
) as Record<string, types.QuickTimeEvent>;

export const storyData: types.StoryData = {
    locations: createRecordFromJsonFiles(locationFiles),
    npcs: createRecordFromJsonFiles(npcFiles),
    dialogs: createRecordFromJsonFiles(dialogFiles),
    quickTimeEvents: createRecordFromJsonFiles(quickTimeEventFiles)
};
