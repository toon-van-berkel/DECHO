import { storyData } from "../../story-data";
import type * as types from "../../story-types";
import * as shared from "../shared/shared-index";

export function get(
    dialogId: string | null | undefined
): types.StoryResponse<types.Dialog | null> {
    return shared.getById(storyData.dialogs, dialogId, "dialog");
}
