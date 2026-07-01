/**
 * QTE types for DECHO.
 *
 * Main responsibility:
 * - Defines reusable quick-time event data.
 *
 * Made by: Vince
 */

import * as excalibur from 'excalibur';

export type QteKeyConfig = {
  key: excalibur.Keys;
  label: string;
};

export type QteRunConfig = {
  title: string;
  prompt: string;
  successText: string;
  failText: string;
  sequenceLength: number;
  timeLimitMs: number;
};

export type QteResult = {
  isSuccess: boolean;
  remainingTimeMs: number;
};
