import type { DialogProgress, OptionEffect } from './dialog-types';

export function createDialogProgress(): DialogProgress {
  return {
    clues: new Set<string>(),
    trust: {},
  };
}

export function applyOptionEffect(
  progress: DialogProgress,
  effect: OptionEffect | undefined,
): void {
  for (const clue of effect?.clues ?? []) {
    progress.clues.add(clue);
  }

  for (const [characterId, change] of Object.entries(effect?.trust ?? {})) {
    progress.trust[characterId] = (progress.trust[characterId] ?? 0) + change;
  }
}

export function wrapCanvasText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && context.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) {
    lines.push(line);
  }

  return lines;
}
