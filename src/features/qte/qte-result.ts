/**
 * QTE result helpers for DECHO.
 *
 * Main responsibility:
 * - Creates consistent QTE result objects.
 *
 * Made by: Vince
 */

import type * as qteTypes from './qte-types';

export function createQteResult(
  isSuccess: boolean,
  remainingTimeMs: number,
): qteTypes.QteResult {
  return { isSuccess, remainingTimeMs };
}
