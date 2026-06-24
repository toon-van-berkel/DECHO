import type { ThemeAccentKey } from '../../../core/theme';
import type { LocationId } from '../dialog/dialog-types';

/**
 * Describes one clickable location on the map. To add a checkpoint, append a
 * new object to {@link CHECKPOINTS} in `checkpoints.data.ts` — no other code
 * needs to change.
 */
export interface CheckpointConfig {
  /** Unique kebab-case id, e.g. `"data-tower"`. Also used as the actor name `checkpoint-<id>`. */
  id: string;
  /** Main label shown next to the marker, e.g. `"DATA TOWER"`. */
  title: string;
  /** Short subtitle under the title. */
  subtitle: string;
  /** Longer text shown in the info panel when the checkpoint is clicked. */
  description: string;
  /** Position of the marker in the map's fixed coordinate space. */
  position: { x: number; y: number };
  /** Accent color key driving the marker glow and info-panel border. */
  theme: ThemeAccentKey;
  /** Scene key to travel to when the player presses "Reis hierheen". */
  targetScene: string;
  /** Dialogue location loaded after travelling from the map. */
  locationId: LocationId;
}
