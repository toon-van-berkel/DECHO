import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";

export function get<T = unknown>(key: string): types.StoryResponse<T | null> {
    try {
        const storedValue = localStorage.getItem(key);

        if (storedValue === null) {
            return helpers.createResponse(true, "Storage key does not exist.", key, null);
        }

        return helpers.createResponse(
            true,
            "Storage value loaded.",
            key,
            JSON.parse(storedValue) as T
        );
    } catch {
        return helpers.createResponse(false, "Storage value could not be parsed.", key, null);
    }
}
