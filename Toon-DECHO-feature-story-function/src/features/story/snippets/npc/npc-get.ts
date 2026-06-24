import { storyData } from "../../story-data";
import type * as types from "../../story-types";
import * as shared from "../shared/shared-index";

export function get(
    npcId: string | null | undefined
): types.StoryResponse<types.StoryNpc | null> {
    return shared.getById(storyData.npcs, npcId, "NPC");
}
