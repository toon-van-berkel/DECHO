import {
  ScreenElement,
  Engine,
  Color,
  Label,
  Font,
  vec,
  FontUnit,
} from "excalibur";
import dialogues from "../data/dialogues.json";

export class DialogueUI extends ScreenElement {
  private textLabel: Label;
  public isVisible: boolean = false;

  private currentSections: any[] = [];
  private currentSectionIndex: number = 0;

  constructor(engine: Engine) {
    super({
      x: 0,
      y: engine.drawHeight - 150,
      width: engine.drawWidth,
      height: 150,
      z: 100,
      color: new Color(0, 0, 0, 0.8),
    });

    //label waar de tekst in komt te staan
    this.textLabel = new Label({
      text: "",
      pos: vec(20, 20),
      font: new Font({
        family: "sans-serif",
        size: 18,
        unit: FontUnit.Px,
        color: Color.White,
      }),
    });

    this.addChild(this.textLabel);

    this.graphics.visible = false;
    this.textLabel.graphics.visible = false;

    // Luister naar klikken op de dialoogbox om door te gaan
    this.on("pointerup", () => {
      this.nextSection();
    });
  }

  public showDialogue(npcId: string) {
    const data = dialogues as any[];

    // Komt het npcId overeen met de data die wordt gevraagd
    const dialogueData = data.find((dialogue) => dialogue.npcId === npcId);

    if (dialogueData && dialogueData.sections.length > 0) {
      this.currentSections = dialogueData.sections;
      this.currentSectionIndex = 0;
      this.updateText();

      this.graphics.visible = true;
      this.textLabel.graphics.visible = true;
      this.isVisible = true;
    } else {
      console.error("Geen dialoog gevonden voor:", npcId);
    }
  }

  private nextSection() {
    // Alleen doorgaan als de dialoog daadwerkelijk zichtbaar is
    if (!this.isVisible) return;

    this.currentSectionIndex++;

    // Check of we nog zinnen over hebben
    if (this.currentSectionIndex < this.currentSections.length) {
      this.updateText();
    } else {
      // Geen zinnen meer? Verberg de dialoog box!
      this.graphics.visible = false;
      this.textLabel.graphics.visible = false;
      this.isVisible = false;
    }
  }

  private updateText() {
    this.textLabel.text = this.currentSections[this.currentSectionIndex].text;
    console.log("Dialoog veranderd naar:", this.textLabel.text);
  }
}
