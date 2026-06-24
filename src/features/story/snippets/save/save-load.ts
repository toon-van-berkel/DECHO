import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";
import * as storage from "../storage/storage-index";
import * as keys from "./save-keys";

export function load(id: string): types.StoryResponse<types.SaveData | null> {
    const response = storage.get<types.SaveData>(keys.getSaveKey(id));

    if (!response.success) {
        return helpers.createResponse(false, response.message, id, null);
    }

    if (!response.returningData) {
        return helpers.createResponse(false, "Save does not exist.", id, null);
    }

    return helpers.createResponse(true, "Save loaded.", id, response.returningData);
}
