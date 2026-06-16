export interface Dialogue {
  npcId: string;
  sections: DialogueSection[];
  canClosedEarly: boolean;
}

export interface DialogueSection {
  id: string;
  text: string;
  speakerName?: string;
  choices?: DialogChoice[];
}

export interface DialogChoice {
  text: string;
  nextSectionId?: string;
  action?: () => void;
}
