import * as ex from 'excalibur';
import { DialogueUI } from '../ui/DialogueUI';
import { Consequence, NpcData } from '../types/NpcData';
import { QteUI } from '../ui/QteUI';

import { handleHighRisk } from '../handlers/HighRiskHandler';
import { handleLowRisk } from '../handlers/LowRiskHandler';

export class BaseScene extends ex.Scene {
  dialogueUI: DialogueUI;
  qteUI: QteUI;
  npcData: NpcData;
  nextScene: string;
  private currentDialogueStepIndex: number = 0;

  constructor(engine: ex.Engine, data: NpcData, nextScene: string) {
    super();
    // Initialiseer de scene met de NPC-gegevens en de volgende bestemming
    this.npcData = data;
    this.nextScene = nextScene;

    //dialogs toevoegen
    this.dialogueUI = new DialogueUI();
    this.add(this.dialogueUI);

    // oftewel ui elementen die worden toegevoed aan de BaseScene
    this.setupEventListeners();

    this.qteUI = new QteUI();
    this.add(this.qteUI);
  }

  private setupEventListeners() {
    this.dialogueUI.onNext = () => this.handleNext();
    this.dialogueUI.onChoiceMade = (choice: Consequence) =>
      this.handleConsequence(choice);
  }

  // wordt iedere keer aangeroepen als je naar de volgende scene gaat en die begint dan weer bij dialogue 0
  public onActivate() {
    this.currentDialogueStepIndex = 0;
    this.showCurrentDialogueStep();
  }

  private get currentStep() {
    return this.npcData.dialogueFlow[this.currentDialogueStepIndex];
  }

  // of toon volgende tekst anders ga naar volgende scene
  private showCurrentDialogueStep() {
    if (this.currentStep) {
      this.dialogueUI.show(this.currentStep);
    } else {
      this.engine.goToScene(this.nextScene);
    }
  }

  private handleNext() {
    if (this.currentStep?.type === 'message') {
      this.currentDialogueStepIndex++;
      this.showCurrentDialogueStep();
    }
  }

  // hier consequence
  private handleConsequence(consequence: Consequence) {
    if (consequence.action === 'high_risk') {
      handleHighRisk(
        this.npcData,
        consequence,
        this.qteUI,
        this.dialogueUI,
        () => {
          this.currentDialogueStepIndex++;
          this.showCurrentDialogueStep();
        },
      );
      return;
    }

    if (consequence.action === 'low_risk') {
      handleLowRisk(this.npcData, consequence);
    }

    this.currentDialogueStepIndex++;
    this.showCurrentDialogueStep();
  }
}
