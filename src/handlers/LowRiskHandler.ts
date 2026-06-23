import { NpcState } from '../state/NpcState';
import { Consequence, NpcData } from '../types/NpcData';

export const handleLowRisk = (npcData: NpcData, consequence: Consequence) => {
  const echoChange = Number(consequence.statChange?.dataEcho) || 0;
  // Dit kan dus 'low' of 'high' zijn uit de JSON
  const npcRisk = consequence.npcRisk;

  NpcState.updateState(
    npcData.npcId,
    npcData.requiredSkill,
    {
      npcRisk: npcRisk,
      // geen qte nodig is gelijk veilig
      supportStatus: 'secured',
    },
    echoChange,
  );

  console.log(`[LowRisk] ${npcData.npcId} geüpdatet. dataEcho +${echoChange}`);
};
