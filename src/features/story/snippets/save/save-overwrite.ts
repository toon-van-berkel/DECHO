import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";
import * as storage from "../storage/storage-index";
import * as keys from "./save-keys";
import * as save from "./save-load";

export function overwrite(id: string, data: unknown): types.StoryResponse<types.SaveData | null> {
    const existingResponse = save.load(id);

    if (!existingResponse.success || !existingResponse.returningData) {
        return helpers.createResponse(false, existingResponse.message, { id, data }, null);
    }

    const saveData: types.SaveData = {
        ...existingResponse.returningData,
        updatedAt: new Date().toISOString(),
        data
    };
    const response = storage.set(keys.getSaveKey(id), saveData);

    if (!response.success) {
        return helpers.createResponse(false, response.message, { id, data }, null);
    }

    return helpers.createResponse(true, "Save overwritten.", { id, data }, saveData);
}
