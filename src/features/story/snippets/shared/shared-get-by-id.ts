import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";

export function getById<T>(
    items: Record<string, T>,
    id: string | null | undefined,
    label: string
): types.StoryResponse<T | null> {
    if (!id) {
        return helpers.createResponse(false, `The ${label} id is not given.`, id, null);
    }

    const item = items[id];

    if (!item) {
        return helpers.createResponse(false, `This ${label} does not exist.`, id, null);
    }

    return helpers.createResponse(true, `${label} found.`, id, item);
}
