/**
 * Central design tokens for the map UI. Colours are plain CSS `hsl()` strings —
 * readable at a glance and used by the canvas as-is; tweak one by editing the
 * string. Helpers: `withAlpha` (runtime alpha) and `parseHsl` (raw components,
 * e.g. to build an engine `Color`). Render-agnostic — no Excalibur import.
 */
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
  glow: { idleBlur: 14, hoverBlur: 28, pulseMs: 2200 },
  motion: { hoverMs: 160, panelInMs: 200, panelOutMs: 140 },
} as const;

export type ThemeAccentKey = keyof typeof THEME.accent;

/** Parses the numeric `h, s, l` out of an `hsl()` / `hsla()` string. */
export function parseHsl(css: string): [number, number, number] | null {
  const m = css.match(/(\d+),\s*(\d+)%,\s*(\d+)%/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

/** Returns `css` with `alpha` applied: `hsl(...)` / `hsla(...)` → `hsla(...)`. */
export function withAlpha(css: string, alpha: number): string {
  const p = parseHsl(css);
  return p ? `hsla(${p[0]}, ${p[1]}%, ${p[2]}%, ${alpha})` : css;
}
