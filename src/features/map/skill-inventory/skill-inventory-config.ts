import type { ThemeAccentKey } from '../../../core/theme';

export type SkillShape = 'triangle' | 'circle' | 'square' | 'diamond' | 'hexagon';

export interface SkillConfig {
  id: string;
  shape: SkillShape;
  theme: ThemeAccentKey;
}

/**
 * Placeholder skill definitions. Shape and colour are the permanent identity;
 * names and gameplay effects are wired up later per scene/level.
 */
export const SKILLS: SkillConfig[] = [
  { id: 'skill-alpha',   shape: 'triangle', theme: 'cyan'    },
  { id: 'skill-beta',    shape: 'circle',   theme: 'magenta' },
  { id: 'skill-gamma',   shape: 'square',   theme: 'green'   },
  { id: 'skill-delta',   shape: 'diamond',  theme: 'amber'   },
  { id: 'skill-epsilon', shape: 'hexagon',  theme: 'violet'  },
];
