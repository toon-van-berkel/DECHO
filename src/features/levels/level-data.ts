/**
 * CLE4 level registry for DECHO.
 *
 * Made by: Toon van Berkel
 */

export type LevelType =
  | 'dialogue'
  | 'location'
  | 'minigame'
  | 'choice'
  | 'privacy-check';

export type LevelConfig = {
  id: string;
  title: string;
  description: string;
  owner: 'Richie' | 'Liam' | 'Casper' | 'Vince' | 'Toon';
  locationId: string;
  type: LevelType;
  impact: string;
  completionChoiceIdsArray: string[];
  completionQteIdsArray?: string[];
};

export const levelsArray: LevelConfig[] = [
  {
    id: 'richie-market-investigation',
    title: 'Scannerroute doorbreken',
    description: 'Ontwijk de scanners in de marktstroom.',
    owner: 'Richie',
    locationId: 'market_square',
    type: 'minigame',
    impact: 'Publieke scanners koppelen gedrag aan identiteit.',
    completionChoiceIdsArray: [],
    completionQteIdsArray: ['qte-market_square_route'],
  },
  {
    id: 'richie-scanner-route',
    title: 'Marktspoor wissen',
    description: 'Wis de camerapulsen die jouw route herkennen.',
    owner: 'Richie',
    locationId: 'market_square',
    type: 'minigame',
    impact: 'Gemak kan betekenen dat je meer persoonsgegevens deelt.',
    completionChoiceIdsArray: [],
    completionQteIdsArray: ['qte-market_square_trace_wipe'],
  },
  {
    id: 'liam-docks-investigation',
    title: 'Droneroute ontwijken',
    description: 'Ontwijk de zoekende drones tussen de containers.',
    owner: 'Liam',
    locationId: 'the_docks',
    type: 'minigame',
    impact: 'Locatiedata maakt dagelijkse patronen voorspelbaar.',
    completionChoiceIdsArray: [],
    completionQteIdsArray: ['qte-dock_drone_path'],
  },
  {
    id: 'liam-log-decision',
    title: 'Logboek beveiligen',
    description: 'Vergrendel de onderschepte routegegevens.',
    owner: 'Liam',
    locationId: 'the_docks',
    type: 'minigame',
    impact: 'Gedeelde logs kunnen ook anderen blootstellen.',
    completionChoiceIdsArray: [],
    completionQteIdsArray: ['qte-dock_log_lock'],
  },
  {
    id: 'casper-black-market-trace',
    title: 'Sleutel stabiliseren',
    description: 'Stabiliseer de onveilige chip van Kael.',
    owner: 'Casper',
    locationId: 'black_market',
    type: 'minigame',
    impact: 'Verkochte data blijft circuleren buiten jouw controle.',
    completionChoiceIdsArray: [],
    completionQteIdsArray: ['qte-black_market_patch'],
  },
  {
    id: 'casper-hardware-key',
    title: 'Hardwaresleutel koppelen',
    description: 'Synchroniseer de sleutel met jouw signaal.',
    owner: 'Casper',
    locationId: 'black_market',
    type: 'minigame',
    impact: 'Onveilige hardware kan ongemerkt gegevens lekken.',
    completionChoiceIdsArray: [],
    completionQteIdsArray: ['qte-black_market_key_sync'],
  },
  {
    id: 'vince-clinic-scan',
    title: 'Neurale storing stoppen',
    description: 'Stabiliseer je interface tijdens de kliniekscan.',
    owner: 'Vince',
    locationId: 'cyber_clinic',
    type: 'minigame',
    impact: 'Medische data is gevoelig, ook als een scan helpt.',
    completionChoiceIdsArray: [],
    completionQteIdsArray: ['qte-clinic_stabilize'],
  },
  {
    id: 'vince-neural-choice',
    title: 'Geheugenfilter sluiten',
    description: 'Sluit je herinneringen af voor de scanner.',
    owner: 'Vince',
    locationId: 'cyber_clinic',
    type: 'minigame',
    impact: 'Toestemming bepaalt wie jouw informatie mag gebruiken.',
    completionChoiceIdsArray: [],
    completionQteIdsArray: ['qte-clinic_memory_filter'],
  },
  {
    id: 'toon-tower-access',
    title: 'Firewall doorbreken',
    description: 'Breek door de buitenste beveiligingslaag.',
    owner: 'Toon',
    locationId: 'sky_platform',
    type: 'minigame',
    impact: 'Losse datapunten vormen samen een herkenbaar profiel.',
    completionChoiceIdsArray: [],
    completionQteIdsArray: ['qte-sky_platform_firewall'],
  },
  {
    id: 'toon-final-data-decision',
    title: 'Torenverbinding verbreken',
    description: 'Stop de datatoren voordat jouw spoor wordt opgeslagen.',
    owner: 'Toon',
    locationId: 'sky_platform',
    type: 'minigame',
    impact: 'Privacy gaat over controle over je eigen informatie.',
    completionChoiceIdsArray: [],
    completionQteIdsArray: ['qte-sky_platform_signal_cut'],
  },
];
