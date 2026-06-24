import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";
import * as storage from "../storage/storage-index";
import * as keys from "./save-keys";
import * as save from "./save-load";

export function list(): types.StoryResponse<types.SaveData[]> {
    const listResponse = storage.get<string[]>(keys.SAVE_LIST_KEY);

    if (!listResponse.success) {
        return helpers.createResponse(false, listResponse.message, null, []);
    }

    const saveIds = listResponse.returningData ?? [];

    if (!Array.isArray(saveIds)) {
        return helpers.createResponse(false, "The save list is invalid.", saveIds, []);
    }

    const saves: types.SaveData[] = [];

    for (const id of saveIds) {
        const saveResponse = save.load(id);

        if (!saveResponse.success || !saveResponse.returningData) {
            return helpers.createResponse(false, saveResponse.message, saveIds, []);
        }

        saves.push(saveResponse.returningData);
    }

    return helpers.createResponse(true, "Saves loaded.", saveIds, saves);
}
