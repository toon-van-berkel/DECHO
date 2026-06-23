import { NpcState } from '../state/NpcState';
import { Consequence, NpcData } from '../types/NpcData';
import { DialogueUI } from '../ui/DialogueUI';
import { QteUI } from '../ui/QteUI';

export const handleHighRisk = (
  npcData: NpcData,
  consequence: Consequence,
  qteUI: QteUI,
  dialogueUI: DialogueUI,
  onComplete: () => void,
) => {
  qteUI.onFinished = (success: boolean) => {
    const finalEchoChange = success
      ? 0
      : Number(consequence.statChange?.dataEcho) || 0;

    NpcState.updateState(
      npcData.npcId,
      npcData.requiredSkill,
      {
        npcRisk: consequence.npcRisk,
        // controleren of qte gelukt is
        qteResult: success ? 'passed' : 'failed',
      },
      finalEchoChange,
    );

    dialogueUI.graphics.isVisible = true;
    onComplete();
  };

  qteUI.start();
};
