/**
 * Engine configuration for DECHO.
 *
 * Main responsibility:
 * - Stores shared Excalibur engine size and display settings.
 *
 * Made by: Richie
 */

import * as excalibur from 'excalibur';

export const mapRenderSize = {
  width: 1280,
  height: 720,
} as const;

export const engineDisplayMode = excalibur.DisplayMode.FitScreenAndZoom;
