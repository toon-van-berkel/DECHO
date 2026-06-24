import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";
import * as backup from "./backup-overwrite";
import * as existingBackup from "./backup-load";

export function update(
    id: string,
    partialData: unknown
): types.StoryResponse<types.BackupData | null> {
    const existingResponse = existingBackup.load(id);

    if (!existingResponse.success || !existingResponse.returningData) {
        return helpers.createResponse(false, existingResponse.message, { id, partialData }, null);
    }

    const currentData = existingResponse.returningData.data;
    const data =
        helpers.isObject(currentData) && helpers.isObject(partialData)
            ? { ...currentData, ...partialData }
            : partialData;

    return backup.overwrite(id, data);
}
