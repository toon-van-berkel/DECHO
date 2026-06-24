import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";
import * as storage from "../storage/storage-index";
import * as keys from "./backup-keys";

export function load(id: string): types.StoryResponse<types.BackupData | null> {
    const response = storage.get<types.BackupData>(keys.getBackupKey(id));

    if (!response.success) {
        return helpers.createResponse(false, response.message, id, null);
    }

    if (!response.returningData) {
        return helpers.createResponse(false, "Backup does not exist.", id, null);
    }

    return helpers.createResponse(true, "Backup loaded.", id, response.returningData);
}
