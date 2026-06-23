import drVexData from '../data/dr-vex.json';
import eliasData from '../data/elias.json';
import jaxData from '../data/jax.json';
import kaelData from '../data/kael.json';
import miraData from '../data/mira.json';

// scene mapping om gemakkelijk te kunnen verwijzen naar de verschillende locaties
export const LocationScenes = {
  MARKET_SQUARE: { data: jaxData, id: 'market-square' },
  THE_DOCKS: { data: miraData, id: 'the-docks' },
  BLACK_MARKET: { data: kaelData, id: 'black-market' },
  CYBER_CLINIC: { data: drVexData, id: 'cyber-clinic' },
  SKY_PLATFORM: { data: eliasData, id: 'sky-platform' },
};
