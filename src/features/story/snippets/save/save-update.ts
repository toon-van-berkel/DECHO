import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";
import * as save from "./save-overwrite";
import * as existingSave from "./save-load";

export function update(
    id: string,
    partialData: unknown
): types.StoryResponse<types.SaveData | null> {
    const existingResponse = existingSave.load(id);

    if (!existingResponse.success || !existingResponse.returningData) {
        return helpers.createResponse(false, existingResponse.message, { id, partialData }, null);
    }

    const currentData = existingResponse.returningData.data;
    const data =
        helpers.isObject(currentData) && helpers.isObject(partialData)
            ? { ...currentData, ...partialData }
            : partialData;

    return save.overwrite(id, data);
}
