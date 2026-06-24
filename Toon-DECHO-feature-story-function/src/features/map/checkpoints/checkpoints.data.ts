import type { CheckpointConfig } from './checkpoint-config';

/**
 * The checkpoints shown on the map. This is the file teammates edit: copy an
 * entry, give it a unique `id`, set its `position` (a fraction of the map),
 * pick a `theme` color, and point `targetScene` at your own registered scene.
 *
 * Keep `description` short (~6 lines): the info panel wraps at ~52 characters
 * per line and does not scroll.
 */
export const CHECKPOINTS: CheckpointConfig[] = [
  {
    id: 'data-tower',
    title: 'DATA TOWER',
    subtitle: 'Hoofdkantoor',
    description:
      'Placeholder. Het zenuwcentrum van Nova City waar alle chip-verkeer samenkomt. Streng beveiligd, maar vol sporen.',
    position: { x: 0.5, y: 0.3 },
    theme: 'cyan',
    targetScene: 'location',
    locationId: 'tower',
  },
  {
    id: 'cyber-clinic',
    title: 'CYBER CLINIC',
    subtitle: 'Upgrades & implants',
    description:
      'Placeholder. Hier laten mensen hun chips bijwerken. De dokter heeft mogelijk gekraakte implants langs zien komen.',
    position: { x: 0.56, y: 0.47 },
    theme: 'green',
    targetScene: 'location',
    locationId: 'clinic',
  },
  {
    id: 'the-docks',
    title: 'THE DOCKS',
    subtitle: 'Transport hub',
    description:
      'Placeholder. Vracht en mensen komen hier de stad in en uit. Wie ongezien wil verdwijnen, begint vaak bij de kades.',
    position: { x: 0.4, y: 0.44 },
    theme: 'cyan',
    targetScene: 'location',
    locationId: 'docks',
  },
  {
    id: 'neon-bar',
    title: 'NEON BAR',
    subtitle: 'Praat met mensen',
    description:
      'Placeholder. Drank, muziek en losse tongen. De vaste klanten weten meer dan ze loslaten — win hun vertrouwen.',
    position: { x: 0.8, y: 0.4 },
    theme: 'magenta',
    targetScene: 'location',
    locationId: 'bar',
  },
  {
    id: 'black-market',
    title: 'BLACK MARKET',
    subtitle: 'Illegale handel',
    description:
      'Placeholder. Hier worden gestolen chip-data en verboden implants verhandeld. Een goede plek om geruchten over de hacker op te vangen.',
    position: { x: 0.18, y: 0.66 },
    theme: 'red',
    targetScene: 'location',
    locationId: 'black-market',
  },
  {
    id: 'habitat-blocks',
    title: 'HABITAT BLOCKS',
    subtitle: 'Woonwijken',
    description:
      'Placeholder. Dichtbevolkte woontorens. Tussen duizenden bewoners verbergt de hacker zich misschien in het zicht.',
    position: { x: 0.76, y: 0.66 },
    theme: 'amber',
    targetScene: 'location',
    locationId: 'blocks',
  },
];
