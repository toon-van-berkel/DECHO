/**
 * Logical render resolution (16:9). The map is drawn in this fixed coordinate
 * space and scaled to fill the screen by the engine's display mode, so layout
 * maths can always assume these dimensions. Keep it 16:9 to match the 16:9
 * background image, so it fills widescreen displays without bars or cropping.
 */
export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
