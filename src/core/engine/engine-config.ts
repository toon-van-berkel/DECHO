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

// FitScreen scales the whole game to the device while keeping the aspect ratio,
// so the full screen is visible everywhere (letterboxed if needed). FitScreenAndZoom
// was zooming in and clipping content differently per device.
export const engineDisplayMode = excalibur.DisplayMode.FitScreen;
