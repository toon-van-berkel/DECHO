import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";

export function set(key: string, value: unknown): types.StoryResponse<boolean> {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return helpers.createResponse(true, "Storage value saved.", { key, value }, true);
    } catch {
        return helpers.createResponse(false, "Storage value could not be saved.", { key, value }, false);
    }
}
