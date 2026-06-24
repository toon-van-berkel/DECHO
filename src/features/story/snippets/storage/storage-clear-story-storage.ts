import * as helpers from "../../story-helpers";
import type * as types from "../../story-types";

export function clearStoryStorage(): types.StoryResponse<boolean> {
    try {
        const storyKeys: string[] = [];

        for (let index = 0; index < localStorage.length; index += 1) {
            const key = localStorage.key(index);

            if (key?.startsWith("decho:")) {
                storyKeys.push(key);
            }
        }

        storyKeys.forEach((key) => localStorage.removeItem(key));
        return helpers.createResponse(true, "Story storage cleared.", storyKeys, true);
    } catch {
        return helpers.createResponse(false, "Story storage could not be cleared.", null, false);
    }
}
