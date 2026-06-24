/**
 * Map data for DECHO.
 *
 * Main responsibility:
 * - Stores clickable locations shown on the map.
 *
 * Made by: Richie
 */

import type * as mapTypes from './map-types';

export const mapCheckpointsArray: mapTypes.MapCheckpointConfig[] = [
  {
    id: 'market-square',
    title: 'MARKET SQUARE',
    subtitle: 'First contact',
    description: 'Jax can mark the first route toward the tower.',
    locationId: 'market_square',
    position: { x: 0.5, y: 0.3 },
    theme: 'cyan',
  },
  {
    id: 'the-docks',
    title: 'THE DOCKS',
    subtitle: 'Drone routes',
    description: 'Mira knows which paths stay out of scanner range.',
    locationId: 'the_docks',
    position: { x: 0.4, y: 0.44 },
    theme: 'cyan',
  },
  {
    id: 'black-market',
    title: 'BLACK MARKET',
    subtitle: 'Hardware key',
    description: 'Kael can help with the physical tower connection.',
    locationId: 'black_market',
    position: { x: 0.18, y: 0.66 },
    theme: 'red',
    opensShop: true,
  },
  {
    id: 'cyber-clinic',
    title: 'CYBER CLINIC',
    subtitle: 'Interface repair',
    description: 'Dr. Vex can stabilize damaged neural hardware.',
    locationId: 'cyber_clinic',
    position: { x: 0.56, y: 0.47 },
    theme: 'green',
  },
  {
    id: 'sky-platform',
    title: 'SKY PLATFORM',
    subtitle: 'Final layer',
    description: 'Elias waits near the tower entrance.',
    locationId: 'sky_platform',
    position: { x: 0.76, y: 0.66 },
    theme: 'violet',
  },
];
