import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";
import * as storage from "../storage/storage-index";
import * as keys from "./save-keys";

export function create(data: unknown): types.StoryResponse<types.SaveData | null> {
    const id = helpers.createId("save");
    const now = new Date().toISOString();
    const saveData: types.SaveData = {
        id,
        createdAt: now,
        updatedAt: now,
        data
    };
    const listResponse = storage.get<string[]>(keys.SAVE_LIST_KEY);

    if (!listResponse.success) {
        return helpers.createResponse(false, listResponse.message, data, null);
    }

    const saveIds = listResponse.returningData ?? [];

    if (!Array.isArray(saveIds)) {
        return helpers.createResponse(false, "The save list is invalid.", data, null);
    }

    const saveResponse = storage.set(keys.getSaveKey(id), saveData);

    if (!saveResponse.success) {
        return helpers.createResponse(false, saveResponse.message, data, null);
    }

    const listSaveResponse = storage.set(keys.SAVE_LIST_KEY, [...saveIds, id]);

    if (!listSaveResponse.success) {
        storage.remove(keys.getSaveKey(id));
        return helpers.createResponse(false, listSaveResponse.message, data, null);
    }

    return helpers.createResponse(true, "Save created.", data, saveData);
}
