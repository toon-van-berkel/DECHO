import type * as types from "./story-types";

export function createResponse<T>(
    success: boolean,
    message: string,
    received: unknown,
    returningData: T
): types.StoryResponse<T> {
    return { success, message, received, returningData };
}

export function createId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
