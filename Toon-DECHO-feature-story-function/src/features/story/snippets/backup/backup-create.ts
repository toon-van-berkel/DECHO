import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";
import * as save from "../save/save-index";
import * as storage from "../storage/storage-index";
import * as keys from "./backup-keys";

export function create(saveId: string): types.StoryResponse<types.BackupData | null> {
    const saveResponse = save.load(saveId);

    if (!saveResponse.success || !saveResponse.returningData) {
        return helpers.createResponse(false, saveResponse.message, saveId, null);
    }

    const id = helpers.createId("backup");
    const now = new Date().toISOString();
    const backupData: types.BackupData = {
        id,
        saveId,
        createdAt: now,
        updatedAt: now,
        data: saveResponse.returningData.data
    };
    const listResponse = storage.get<string[]>(keys.BACKUP_LIST_KEY);

    if (!listResponse.success) {
        return helpers.createResponse(false, listResponse.message, saveId, null);
    }

    const backupIds = listResponse.returningData ?? [];

    if (!Array.isArray(backupIds)) {
        return helpers.createResponse(false, "The backup list is invalid.", saveId, null);
    }

    const backupResponse = storage.set(keys.getBackupKey(id), backupData);

    if (!backupResponse.success) {
        return helpers.createResponse(false, backupResponse.message, saveId, null);
    }

    const listSaveResponse = storage.set(keys.BACKUP_LIST_KEY, [...backupIds, id]);

    if (!listSaveResponse.success) {
        storage.remove(keys.getBackupKey(id));
        return helpers.createResponse(false, listSaveResponse.message, saveId, null);
    }

    return helpers.createResponse(true, "Backup created.", saveId, backupData);
}
