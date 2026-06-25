/**
 * QTE service for DECHO.
 *
 * Main responsibility:
 * - Creates reusable QTE key sequences.
 *
 * Made by: Vince
 */

import * as excalibur from 'excalibur';
import type * as qteTypes from './qte-types';

export const qteKeysArray: qteTypes.QteKeyConfig[] = [
  { key: excalibur.Keys.Up, label: '↑' },
  { key: excalibur.Keys.Down, label: '↓' },
  { key: excalibur.Keys.Left, label: '←' },
  { key: excalibur.Keys.Right, label: '→' },
];

export function createQteSequence(
  sequenceLength: number,
): qteTypes.QteKeyConfig[] {
  return Array.from({ length: sequenceLength }, () => {
    const keyIndex = Math.floor(Math.random() * qteKeysArray.length);
    return qteKeysArray[keyIndex] ?? qteKeysArray[0];
  });
}
