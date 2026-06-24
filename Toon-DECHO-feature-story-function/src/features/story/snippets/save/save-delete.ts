import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";
import * as storage from "../storage/storage-index";
import * as keys from "./save-keys";
import * as save from "./save-load";

export function deleteSave(id: string): types.StoryResponse<boolean> {
    const existingResponse = save.load(id);

    if (!existingResponse.success) {
        return helpers.createResponse(false, existingResponse.message, id, false);
    }

    const listResponse = storage.get<string[]>(keys.SAVE_LIST_KEY);

    if (!listResponse.success) {
        return helpers.createResponse(false, listResponse.message, id, false);
    }

    const saveIds = listResponse.returningData ?? [];

    if (!Array.isArray(saveIds)) {
        return helpers.createResponse(false, "The save list is invalid.", id, false);
    }

    const removeResponse = storage.remove(keys.getSaveKey(id));

    if (!removeResponse.success) {
        return helpers.createResponse(false, removeResponse.message, id, false);
    }

    const listSaveResponse = storage.set(
        keys.SAVE_LIST_KEY,
        saveIds.filter((saveId) => saveId !== id)
    );

    if (!listSaveResponse.success) {
        return helpers.createResponse(false, listSaveResponse.message, id, false);
    }

    return helpers.createResponse(true, "Save deleted.", id, true);
}
