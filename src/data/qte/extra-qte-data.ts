/**
 * Second QTE configuration for each DECHO NPC.
 *
 * Made by: Toon van Berkel
 */

import type { QteData } from '../../features/story/story-types';

export const extraQteDataArray: QteData[] = [
  {
    id: 'qte-market_square_trace_wipe',
    title: 'Marktspoor wissen',
    prompt: 'Blokkeer de resterende camerapulsen voordat ze jouw route koppelen.',
    successText: 'Gelukt: je marktspoor is tijdelijk gewist.',
    failText: 'Mislukt: de camera laat extra data-echo achter.',
    sequenceLength: 6,
    timeLimitMs: 3800,
  },
  {
    id: 'qte-dock_log_lock',
    title: 'Logboek beveiligen',
    prompt: 'Vergrendel de onderschepte routegegevens voordat de drones ze kopiëren.',
    successText: 'Gelukt: het logboek is afgeschermd.',
    failText: 'Mislukt: een drone kopieert een deel van het logboek.',
    sequenceLength: 4,
    timeLimitMs: 3000,
  },
  {
    id: 'qte-black_market_key_sync',
    title: 'Sleutel synchroniseren',
    prompt: 'Houd de hardwareverbinding stabiel terwijl de sleutel jouw signaal controleert.',
    successText: 'Gelukt: de hardwaresleutel reageert alleen op jouw signaal.',
    failText: 'Mislukt: de sleutel zendt een herkenbare puls uit.',
    sequenceLength: 6,
    timeLimitMs: 5200,
  },
  {
    id: 'qte-clinic_memory_filter',
    title: 'Geheugenfilter sluiten',
    prompt: 'Sluit de open geheugensegmenten voordat de kliniekscanner ze uitleest.',
    successText: 'Gelukt: de scanner verliest toegang tot je herinneringen.',
    failText: 'Mislukt: de scan houdt een extra herinneringsfragment vast.',
    sequenceLength: 4,
    timeLimitMs: 3200,
  },
  {
    id: 'qte-sky_platform_signal_cut',
    title: 'Torenverbinding verbreken',
    prompt: 'Verbreek de terugkoppeling voordat de datatoren jouw volledige spoor opslaat.',
    successText: 'Gelukt: de verbinding valt stil zonder jouw identiteit te bewaren.',
    failText: 'Mislukt: de datatoren registreert een laatste signaalpuls.',
    sequenceLength: 7,
    timeLimitMs: 5600,
  },
];

