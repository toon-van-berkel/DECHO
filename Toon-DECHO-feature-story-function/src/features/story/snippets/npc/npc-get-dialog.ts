import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";
import * as dialog from "../dialog/dialog-index";
import * as npc from "./npc-get";

export function getDialog(
    npcId: string | null | undefined
): types.StoryResponse<types.Dialog | null> {
    const npcResponse = npc.get(npcId);

    if (!npcResponse.success || !npcResponse.returningData) {
        return helpers.createResponse(false, npcResponse.message, npcId, null);
    }

    return dialog.get(npcResponse.returningData.defaultDialogId);
}
