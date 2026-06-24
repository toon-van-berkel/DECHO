import { storyData } from "../../story-data";
import type * as types from "../../story-types";
import * as shared from "../shared/shared-index";

export function get(
    locationId: string | null | undefined
): types.StoryResponse<types.StoryLocation | null> {
    return shared.getById(storyData.locations, locationId, "location");
}
