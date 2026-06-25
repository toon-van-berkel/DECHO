/**
 * Map types for DECHO.
 *
 * Main responsibility:
 * - Defines clickable map location data.
 *
 * Made by: Richie
 */

import type { ThemeAccentKey } from '../../core/theme/theme-index';

export type MapCheckpointConfig = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  locationId: string;
  position: { x: number; y: number };
  theme: ThemeAccentKey;
  opensShop?: boolean;
};
