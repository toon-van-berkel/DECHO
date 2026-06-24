import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";
import * as location from "./location-get";

export function hasNpc(
    locationId: string | null | undefined
): types.StoryResponse<boolean | null> {
    const locationResponse = location.get(locationId);

    if (!locationResponse.success || !locationResponse.returningData) {
        return helpers.createResponse(false, locationResponse.message, locationId, null);
    }

    const hasNpc = (locationResponse.returningData.npcIds?.length ?? 0) > 0;
    const message = hasNpc
        ? "This location has at least one NPC."
        : "This location has no NPCs.";

    return helpers.createResponse(true, message, locationId, hasNpc);
}
