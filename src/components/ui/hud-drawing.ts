/**
 * HUD drawing helpers for DECHO.
 *
 * Main responsibility:
 * - Shares canvas styling for neon panels and text wrapping.
 *
 * Made by: Richie
 */

import { THEME, withAlpha } from '../../core/theme/theme-index';

export type Point = {
  x: number;
  y: number;
};

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(start: number, end: number, amount: number): number {
  return start + (end - start) * amount;
}

export function approach(
  currentValue: number,
  targetValue: number,
  elapsedMs: number,
  durationMs: number,
): number {
  const step = durationMs <= 0 ? 1 : elapsedMs / durationMs;
  const difference = targetValue - currentValue;
  return clamp(
    currentValue +
      Math.sign(difference) * Math.min(Math.abs(difference), step),
    0,
    1,
  );
}

export function hexagonPoints(radius: number): Point[] {
  return Array.from({ length: 6 }, (_, pointIndex) => {
    const angle = (Math.PI / 3) * pointIndex;
    return {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    };
  });
}

export function wrapText(text: string, maxCharacters: number): string[] {
  const wordsArray = text.split(/\s+/).filter(Boolean);
  const linesArray: string[] = [];
  let currentLine = '';

  wordsArray.forEach((word) => {
    const candidateLine = currentLine ? `${currentLine} ${word}` : word;
    if (candidateLine.length > maxCharacters && currentLine) {
      linesArray.push(currentLine);
      currentLine = word;
      return;
    }

    currentLine = candidateLine;
  });

  if (currentLine) {
    linesArray.push(currentLine);
  }

  return linesArray;
}

export function drawHudPanel(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  accentColor: string,
  radius = THEME.shape.panelRadius,
): void {
  context.beginPath();
  context.roundRect(1, 1, width - 2, height - 2, radius);
  context.fillStyle = THEME.color.panelFill;
  context.shadowColor = accentColor;
  context.shadowBlur = THEME.glow.panelBlur;
  context.fill();
  context.shadowBlur = 0;
  context.lineWidth = 1.5;
  context.strokeStyle = accentColor;
  context.stroke();

  context.beginPath();
  context.moveTo(18, height - 14);
  context.lineTo(width - 18, height - 14);
  context.strokeStyle = withAlpha(accentColor, 0.28);
  context.lineWidth = 1;
  context.stroke();
}

export function drawDivider(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
): void {
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + width, y);
  context.strokeStyle = THEME.color.border;
  context.lineWidth = 1;
  context.stroke();
}
