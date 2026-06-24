import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";

export function exists(key: string): types.StoryResponse<boolean> {
    try {
        const keyExists = localStorage.getItem(key) !== null;
        return helpers.createResponse(true, "Storage key checked.", key, keyExists);
    } catch {
        return helpers.createResponse(false, "Storage key could not be checked.", key, false);
    }
}
