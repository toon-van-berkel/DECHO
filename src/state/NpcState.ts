import { GameState, NpcRecord } from './GameState';

export const NpcState = {
  initNpc(npcId: string, skill: string) {
    if (!GameState.npcDetails[npcId]) {
      GameState.npcDetails[npcId] = {
        npcId,
        survivalStatus: 'alive',
        supportStatus: 'pending',
        npcRisk: null,
        qteResult: 'pending',
        requiredSkill: skill,
      };
    }
  },

  updateState(
    npcId: string,
    skill: string,
    updates: Partial<NpcRecord>,
    dataEchoChange?: number,
  ) {
    this.initNpc(npcId, skill);

    // Update de specifieke npc data in de gamestate
    Object.assign(GameState.npcDetails[npcId], updates);

    // Verwerk de gevolgen (dataEcho) indien meegegeven
    if (dataEchoChange !== undefined && dataEchoChange !== null) {
      GameState.dataEcho += dataEchoChange;
    }

    // Na elke update kijken we direct of de NPC status moet veranderen
    this.evaluateStatus(npcId);
  },

  evaluateStatus(npcId: string) {
    const npc = GameState.npcDetails[npcId];
    const skill = npc.requiredSkill;

    const qteSuccess = npc.qteResult === 'passed';
    const dialogueSuccess = npc.supportStatus === 'secured';
    // Een NPC is 'secured' bij succes in QTE or dialoog
    if (qteSuccess || dialogueSuccess) {
      npc.survivalStatus = 'alive';
      npc.supportStatus = 'secured';

      // skill toevoegen
      if (!GameState.securedSkills.includes(skill)) {
        GameState.securedSkills.push(skill);
      }
    }
    // Faal-conditie als QTE  'failed' is
    else if (npc.qteResult === 'failed') {
      npc.supportStatus = 'lost';
    }
  },
};
