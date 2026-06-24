import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";
import * as storage from "../storage/storage-index";
import * as keys from "./backup-keys";
import * as backup from "./backup-load";

export function list(): types.StoryResponse<types.BackupData[]> {
    const listResponse = storage.get<string[]>(keys.BACKUP_LIST_KEY);

    if (!listResponse.success) {
        return helpers.createResponse(false, listResponse.message, null, []);
    }

    const backupIds = listResponse.returningData ?? [];

    if (!Array.isArray(backupIds)) {
        return helpers.createResponse(false, "The backup list is invalid.", backupIds, []);
    }

    const backups: types.BackupData[] = [];

    for (const id of backupIds) {
        const backupResponse = backup.load(id);

        if (!backupResponse.success || !backupResponse.returningData) {
            return helpers.createResponse(false, backupResponse.message, backupIds, []);
        }

        backups.push(backupResponse.returningData);
    }

    return helpers.createResponse(true, "Backups loaded.", backupIds, backups);
}
