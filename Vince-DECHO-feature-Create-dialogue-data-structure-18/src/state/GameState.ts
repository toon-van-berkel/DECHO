export interface NpcRecord {
  npcId: string;
  survivalStatus: 'alive' | 'dead';
  supportStatus: 'secured' | 'lost' | 'pending';
  npcRisk: npcRisk;
  qteResult: 'passed' | 'failed' | 'pending';
  requiredSkill: string;
}

export const GameState = {
  dataEcho: 0,
  securedSkills: [] as string[],
  npcDetails: {} as Record<string, NpcRecord>,
};

export type npcRisk = 'low' | 'high' | null;
