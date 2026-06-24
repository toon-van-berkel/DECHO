import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";

export function remove(key: string): types.StoryResponse<boolean> {
    try {
        localStorage.removeItem(key);
        return helpers.createResponse(true, "Storage value removed.", key, true);
    } catch {
        return helpers.createResponse(false, "Storage value could not be removed.", key, false);
    }
}
