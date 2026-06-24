import { storyData } from "../../story-data";
import type * as types from "../../story-types";
import * as shared from "../shared/shared-index";

export function get(
    qteId: string | null | undefined
): types.StoryResponse<types.QuickTimeEvent | null> {
    return shared.getById(storyData.quickTimeEvents, qteId, "quick time event");
}
