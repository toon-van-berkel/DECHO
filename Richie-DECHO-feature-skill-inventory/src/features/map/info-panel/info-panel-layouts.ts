import { GAME_HEIGHT, GAME_WIDTH } from '../../../core/config';

export const INFO_PANEL_LAYOUT = {
  card: {
    width: 540,
    height: 320,
    padding: 32,
    radius: 16,
  },
  travelButton: {
    width: 200,
    height: 44,
  },
  closeButton: {
    width: 110,
    height: 44,
  },
  description: {
    maxCharactersPerLine: 52,
    lineHeight: 22,
  },
  scrimAlpha: 0.55,
} as const;

export const INFO_CARD_X = (GAME_WIDTH - INFO_PANEL_LAYOUT.card.width) / 2;
export const INFO_CARD_Y = (GAME_HEIGHT - INFO_PANEL_LAYOUT.card.height) / 2;
