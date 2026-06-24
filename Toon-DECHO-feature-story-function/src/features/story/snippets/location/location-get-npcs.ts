import { storyData } from "../../story-data";
import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";
import * as location from "./location-get";

export function getNpcs(
    locationId: string | null | undefined
): types.StoryResponse<types.StoryNpc[] | null> {
    const locationResponse = location.get(locationId);

    if (!locationResponse.success || !locationResponse.returningData) {
        return helpers.createResponse(false, locationResponse.message, locationId, null);
    }

    const npcs = (locationResponse.returningData.npcIds ?? [])
        .map((npcId) => storyData.npcs[npcId])
        .filter((npc): npc is types.StoryNpc => Boolean(npc));

    return helpers.createResponse(true, "NPCs found for location.", locationId, npcs);
}
