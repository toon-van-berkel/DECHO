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
    title: 'MARKTPLEIN',
    subtitle: 'Eerste contact',
    description: 'Jax kan de eerste route naar de datatoren markeren.',
    locationId: 'market_square',
    position: { x: 0.5, y: 0.3 },
    theme: 'cyan',
  },
  {
    id: 'the-docks',
    title: 'DE DOKKEN',
    subtitle: 'Droneroutes',
    description: 'Mira kent de paden buiten het bereik van scanners.',
    locationId: 'the_docks',
    position: { x: 0.4, y: 0.44 },
    theme: 'cyan',
  },
  {
    id: 'black-market',
    title: 'ZWARTE MARKT',
    subtitle: 'Hardwaresleutel',
    description: 'Kael kan helpen met de fysieke verbinding naar de toren.',
    locationId: 'black_market',
    position: { x: 0.18, y: 0.66 },
    theme: 'red',
    opensShop: true,
  },
  {
    id: 'cyber-clinic',
    title: 'CYBERKLINIEK',
    subtitle: 'Interfaceherstel',
    description: 'Dr. Vex kan beschadigde neurale hardware stabiliseren.',
    locationId: 'cyber_clinic',
    position: { x: 0.56, y: 0.47 },
    theme: 'green',
  },
  {
    id: 'sky-platform',
    title: 'TORENPLATFORM',
    subtitle: 'Laatste laag',
    description: 'Elias wacht bij de ingang van de datatoren.',
    locationId: 'sky_platform',
    position: { x: 0.76, y: 0.66 },
    theme: 'violet',
  },
];
