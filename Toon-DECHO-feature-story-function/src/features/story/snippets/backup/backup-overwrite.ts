import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";
import * as storage from "../storage/storage-index";
import * as keys from "./backup-keys";
import * as backup from "./backup-load";

export function overwrite(
    id: string,
    data: unknown
): types.StoryResponse<types.BackupData | null> {
    const existingResponse = backup.load(id);

    if (!existingResponse.success || !existingResponse.returningData) {
        return helpers.createResponse(false, existingResponse.message, { id, data }, null);
    }

    const backupData: types.BackupData = {
        ...existingResponse.returningData,
        updatedAt: new Date().toISOString(),
        data
    };
    const response = storage.set(keys.getBackupKey(id), backupData);

    if (!response.success) {
        return helpers.createResponse(false, response.message, { id, data }, null);
    }

    return helpers.createResponse(true, "Backup overwritten.", { id, data }, backupData);
}
