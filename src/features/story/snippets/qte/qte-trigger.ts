import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";
import * as qte from "./qte-get";

export function trigger(
    qteId: string | null | undefined
): types.StoryResponse<{
    event: types.QuickTimeEvent;
    passed: boolean;
    text: string;
    effects: types.StoryEffect[];
} | null> {
    const eventResponse = qte.get(qteId);

    if (!eventResponse.success || !eventResponse.returningData) {
        return helpers.createResponse(false, eventResponse.message, qteId, null);
    }

    const event = eventResponse.returningData;
    const passed = Math.random() >= 0.5;

    return helpers.createResponse(true, "Quick time event completed.", qteId, {
        event,
        passed,
        text: passed ? event.successText : event.failText,
        effects: passed ? event.successEffects ?? [] : event.failEffects ?? []
    });
}
