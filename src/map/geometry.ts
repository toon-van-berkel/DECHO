/** A 2D point. */
export interface Point {
  x: number;
  y: number;
}

/**
 * Returns the six vertices of a flat-top regular hexagon centered on the
 * origin. The first vertex lies on the positive x-axis at `(radius, 0)`.
 * @param radius - Distance from the center to each vertex.
 */
export function hexagonPoints(radius: number): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    points.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) });
  }
  return points;
}

/**
 * Splits text into lines so no line exceeds `maxChars`, breaking only on
 * spaces. A single word longer than `maxChars` is kept whole on its own line.
 * @param text - The text to wrap.
 * @param maxChars - Maximum characters per line.
 */
export function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) {
    lines.push(current);
  }
  return lines;
}

/** Linearly interpolates between `a` and `b` by `t` (0–1). */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Clamps `value` to the inclusive range [`min`, `max`]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
