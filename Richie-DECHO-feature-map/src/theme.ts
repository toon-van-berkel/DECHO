/**
 * Central design tokens for the map UI. Values are plain hex/rgba strings and
 * numbers so this module has no rendering dependency and stays the single place
 * to tweak the look.
 */
export const THEME = {
  /** Font families, loaded from Google Fonts in index.html. */
  font: {
    /** Display font for titles. */
    heading: 'Orbitron',
    /** Cyberpunk display font for subtitles and short labels. */
    label: 'Chakra Petch',
    /** Body font for descriptions and longer text. */
    body: 'JetBrains Mono',
  },
  /** Surface and text colors. */
  color: {
    bg: '#0F172A',
    text: '#FFFFFF',
    muted: '#94A3B8',
    panelFill: 'rgba(15, 23, 42, 0.72)',
    border: 'rgba(255, 255, 255, 0.10)',
    /** Dark scrim drawn behind modal panels. */
    overlay: '#000000',
  },
  /** Per-checkpoint accent colors; each checkpoint picks one by key. */
  accent: {
    cyan: '#22D3EE',
    magenta: '#F472B6',
    green: '#22C55E',
    amber: '#F59E0B',
    violet: '#A855F7',
    red: '#EF4444',
  },
  /** Neon glow blur radius (px) and pulse period (ms) for the markers. */
  glow: { idleBlur: 14, hoverBlur: 28, pulseMs: 2200 },
  /** Animation durations in milliseconds. */
  motion: { hoverMs: 160, panelInMs: 200, panelOutMs: 140 },
} as const;

/** Valid keys of {@link THEME.accent}; used to type a checkpoint's color. */
export type ThemeAccentKey = keyof typeof THEME.accent;

/**
 * Returns the hex color for an accent key.
 * @param key - One of the {@link THEME.accent} keys.
 */
export function themeColorHex(key: ThemeAccentKey): string {
  return THEME.accent[key];
}

/**
 * Converts a `#RRGGBB` hex color to an `rgba(...)` string with the given alpha.
 * @param hex - A 6-digit hex color, e.g. `#22D3EE`.
 * @param alpha - Opacity from 0 (transparent) to 1 (opaque).
 */
export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Blends two `#RRGGBB` colors. `t = 0` returns `a`, `t = 1` returns `b`.
 * @param a - Start color as a 6-digit hex.
 * @param b - End color as a 6-digit hex.
 * @param t - Blend amount from 0 to 1.
 */
export function mixHex(a: string, b: string, t: number): string {
  const channel = (hex: string, index: number) => parseInt(hex.replace('#', '').substring(index, index + 2), 16);
  const r = Math.round(channel(a, 0) + (channel(b, 0) - channel(a, 0)) * t);
  const g = Math.round(channel(a, 2) + (channel(b, 2) - channel(a, 2)) * t);
  const blue = Math.round(channel(a, 4) + (channel(b, 4) - channel(a, 4)) * t);
  return `rgb(${r}, ${g}, ${blue})`;
}
