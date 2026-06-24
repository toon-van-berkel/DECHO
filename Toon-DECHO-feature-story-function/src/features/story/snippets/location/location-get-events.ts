import { storyData } from "../../story-data";
import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";
import * as location from "./location-get";

export function getEvents(
    locationId: string | null | undefined
): types.StoryResponse<types.QuickTimeEvent[] | null> {
    const locationResponse = location.get(locationId);

    if (!locationResponse.success || !locationResponse.returningData) {
        return helpers.createResponse(false, locationResponse.message, locationId, null);
    }

    const events = (locationResponse.returningData.eventIds ?? [])
        .map((eventId) => storyData.quickTimeEvents[eventId])
        .filter((event): event is types.QuickTimeEvent => Boolean(event));

    return helpers.createResponse(true, "Events found for location.", locationId, events);
}
