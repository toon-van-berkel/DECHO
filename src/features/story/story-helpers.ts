/**
 * Story helpers for DECHO.
 *
 * Main responsibility:
 * - Provides small helpers used by the story service.
 *
 * Made by: Toon
 */

import type * as storyTypes from './story-types';

export function createStoryResponse<T>(
  isSuccess: boolean,
  message: string,
  data: T,
): storyTypes.StoryResponse<T> {
  return { isSuccess, message, data };
}

export function getRequiredValue<T>(
  recordObject: Record<string, T>,
  key: string,
  label: string,
): storyTypes.StoryResponse<T | null> {
  const foundValue = recordObject[key] ?? null;
  return foundValue
    ? createStoryResponse(true, `${label} found.`, foundValue)
    : createStoryResponse(false, `${label} "${key}" is missing.`, null);
}
