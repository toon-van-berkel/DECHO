import type { CharacterPosition } from './dialog-types';

export interface LayoutBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DialogPanelLayout extends LayoutBounds {
  padding: number;
  speakerFontSize: number;
  dialogueFontSize: number;
  lineHeight: number;
}

export interface OptionButtonLayout {
  x: number;
  startY: number;
  width: number;
  height: number;
  gap: number;
  fontSize: number;
}

export interface CharacterLayout {
  x: number;
  feetY: number;
  targetHeight: number;
}

export interface VisualNovelLayout {
  screen: LayoutBounds;
  safeArea: LayoutBounds;
  worldSafeArea: LayoutBounds;
  panel: DialogPanelLayout;
  characterTargetHeight: number;
}

export function getCoverScale(
  imageWidth: number,
  imageHeight: number,
  targetWidth: number,
  targetHeight: number,
): number {
  return Math.max(targetWidth / imageWidth, targetHeight / imageHeight);
}

export function getVisualNovelLayout(
  screenWidth: number,
  screenHeight: number,
  safeArea: LayoutBounds = { x: 0, y: 0, width: screenWidth, height: screenHeight },
  worldSafeArea: LayoutBounds = safeArea,
): VisualNovelLayout {
  const panelWidth = safeArea.width * 0.9;
  const panelHeight = safeArea.height * 0.28;
  const bottomMargin = Math.min(24, safeArea.height * 0.035);
  const panelX = safeArea.x + (safeArea.width - panelWidth) / 2;
  const panelY = safeArea.y + safeArea.height - panelHeight - bottomMargin;
  const padding = Math.max(20, Math.round(safeArea.width * 0.025));

  return {
    screen: { x: 0, y: 0, width: screenWidth, height: screenHeight },
    safeArea,
    worldSafeArea,
    panel: {
      x: panelX,
      y: panelY,
      width: panelWidth,
      height: panelHeight,
      padding,
      speakerFontSize: Math.max(18, Math.round(safeArea.height * 0.035)),
      dialogueFontSize: Math.max(16, Math.round(safeArea.height * 0.03)),
      lineHeight: Math.max(24, Math.round(safeArea.height * 0.043)),
    },
    characterTargetHeight: Math.min(
      safeArea.height * 0.72,
      (panelY - safeArea.y) * 0.96,
    ),
  };
}

export function getCharacterLayout(
  position: CharacterPosition,
  layout: VisualNovelLayout,
): CharacterLayout {
  const horizontalPosition = {
    left: 0.25,
    center: 0.5,
    right: 0.75,
  }[position];

  return {
    x:
      layout.worldSafeArea.x +
      layout.worldSafeArea.width * horizontalPosition,
    feetY:
      layout.worldSafeArea.y +
      (layout.panel.y - layout.safeArea.y) +
      Math.min(8, layout.safeArea.height * 0.01),
    targetHeight: layout.characterTargetHeight,
  };
}

export function getOptionButtonLayout(
  layout: VisualNovelLayout,
  optionCount: number,
): OptionButtonLayout {
  const width = layout.safeArea.width * 0.75;
  const gap = Math.max(8, Math.round(layout.safeArea.height * 0.014));
  const preferredHeight = Math.max(42, layout.safeArea.height * 0.07);
  const availableHeight = Math.max(
    preferredHeight,
    layout.panel.y - layout.safeArea.y - 32,
  );
  const height = Math.min(
    preferredHeight,
    (availableHeight - gap * Math.max(0, optionCount - 1)) /
      Math.max(1, optionCount),
  );
  const stackHeight = height * optionCount + gap * Math.max(0, optionCount - 1);

  return {
    x: layout.safeArea.x + (layout.safeArea.width - width) / 2,
    startY: Math.max(
      layout.safeArea.y + 16,
      layout.panel.y - stackHeight - Math.max(16, gap * 1.5),
    ),
    width,
    height,
    gap,
    fontSize: Math.max(14, Math.round(layout.safeArea.height * 0.022)),
  };
}
