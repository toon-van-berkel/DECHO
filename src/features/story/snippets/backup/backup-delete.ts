import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";
import * as storage from "../storage/storage-index";
import * as keys from "./backup-keys";
import * as backup from "./backup-load";

export function deleteBackup(id: string): types.StoryResponse<boolean> {
    const existingResponse = backup.load(id);

    if (!existingResponse.success) {
        return helpers.createResponse(false, existingResponse.message, id, false);
    }

    const listResponse = storage.get<string[]>(keys.BACKUP_LIST_KEY);

    if (!listResponse.success) {
        return helpers.createResponse(false, listResponse.message, id, false);
    }

    const backupIds = listResponse.returningData ?? [];

    if (!Array.isArray(backupIds)) {
        return helpers.createResponse(false, "The backup list is invalid.", id, false);
    }

    const removeResponse = storage.remove(keys.getBackupKey(id));

    if (!removeResponse.success) {
        return helpers.createResponse(false, removeResponse.message, id, false);
    }

    const listSaveResponse = storage.set(
        keys.BACKUP_LIST_KEY,
        backupIds.filter((backupId) => backupId !== id)
    );

    if (!listSaveResponse.success) {
        return helpers.createResponse(false, listSaveResponse.message, id, false);
    }

    return helpers.createResponse(true, "Backup deleted.", id, true);
}
