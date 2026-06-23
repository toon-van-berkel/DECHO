import { npcRisk } from '../state/GameState';

export interface DialogueOption {
  buttonText: string;
  consequence: Consequence;
}

export interface Consequence {
  action: string;
  statChange: {
    dataEcho: number;
  };
  npcRisk: npcRisk;
}

export interface DialogueStep {
  id: string;
  speakerName: string;
  text: string;
  type: 'message' | 'decision';
  options?: DialogueOption[];
}

export interface NpcData {
  npcId: string;
  dialogueFlow: DialogueStep[];
  requiredSkill: string;
}
