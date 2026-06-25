/**
 * HSL theme tokens for DECHO.
 *
 * Main responsibility:
 * - Provides shared color and timing values for UI rendering.
 *
 * Made by: Richie
 */

import * as excalibur from 'excalibur';

export const THEME = {
  font: {
    heading: 'Orbitron',
    label: 'Chakra Petch',
    body: 'JetBrains Mono',
  },
  color: {
    bg: 'hsl(222, 47%, 11%)',
    text: 'hsl(0, 0%, 100%)',
    muted: 'hsl(215, 20%, 65%)',
    softText: 'hsl(215, 46%, 89%)',
    panelFill: 'hsla(222, 47%, 11%, 0.72)',
    border: 'hsla(0, 0%, 100%, 0.1)',
    overlay: 'hsl(0, 0%, 0%)',
  },
  accent: {
    cyan: 'hsl(188, 86%, 53%)',
    magenta: 'hsl(329, 86%, 70%)',
    green: 'hsl(142, 71%, 45%)',
    amber: 'hsl(38, 92%, 50%)',
    violet: 'hsl(271, 91%, 65%)',
    red: 'hsl(0, 84%, 60%)',
  },
  glow: { idleBlur: 14, hoverBlur: 28, panelBlur: 22, pulseMs: 2200 },
  motion: { hoverMs: 160, panelInMs: 200, panelOutMs: 140 },
  shape: { panelRadius: 8, buttonRadius: 6 },
  spacing: { panelPadding: 22 },
} as const;

export type ThemeAccentKey = keyof typeof THEME.accent;

export function parseHsl(cssColor: string): [number, number, number] | null {
  const hslMatch = cssColor.match(/(\d+),\s*(\d+)%,\s*(\d+)%/);
  return hslMatch
    ? [Number(hslMatch[1]), Number(hslMatch[2]), Number(hslMatch[3])]
    : null;
}

export function withAlpha(cssColor: string, alpha: number): string {
  const hslPartsArray = parseHsl(cssColor);
  return hslPartsArray
    ? `hsla(${hslPartsArray[0]}, ${hslPartsArray[1]}%, ${hslPartsArray[2]}%, ${alpha})`
    : cssColor;
}

export function toExcaliburColor(cssColor: string): excalibur.Color {
  const hslPartsArray = parseHsl(cssColor);
  if (!hslPartsArray) {
    return excalibur.Color.White;
  }

  const alphaMatch = cssColor.match(/,\s*(0?\.\d+|1(?:\.0)?|0)\s*\)$/);
  const alpha = alphaMatch ? Number(alphaMatch[1]) : 1;
  const [hue, saturation, lightness] = hslPartsArray;
  const chroma = (1 - Math.abs((2 * lightness) / 100 - 1)) * (saturation / 100);
  const hueSegment = hue / 60;
  const x = chroma * (1 - Math.abs((hueSegment % 2) - 1));
  const match = lightness / 100 - chroma / 2;

  const [redPrime, greenPrime, bluePrime] =
    hueSegment < 1
      ? [chroma, x, 0]
      : hueSegment < 2
        ? [x, chroma, 0]
        : hueSegment < 3
          ? [0, chroma, x]
          : hueSegment < 4
            ? [0, x, chroma]
            : hueSegment < 5
              ? [x, 0, chroma]
              : [chroma, 0, x];

  return new excalibur.Color(
    Math.round((redPrime + match) * 255),
    Math.round((greenPrime + match) * 255),
    Math.round((bluePrime + match) * 255),
    alpha,
  );
}
