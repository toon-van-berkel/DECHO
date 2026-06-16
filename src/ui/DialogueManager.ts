import { Engine } from "excalibur";
import { Dialogue } from "./Dialogue";

export class DialogManager {
  private dialogElement: HTMLDialogElement;
  private contentContainer: HTMLElement;
  private engine: Engine;
  private currentDialogue: Dialogue | null = null;
  private currentSectionIndex: number = 0;

  constructor(dialogId: string, engine: Engine) {
    this.dialogElement = document.getElementById(dialogId) as HTMLDialogElement;
    this.contentContainer = this.dialogElement.querySelector(
      "#dialog-content",
    ) as HTMLElement;
    this.engine = engine;
  }

  public showDialogue(data: Dialogue) {
    this.currentDialogue = data;
    this.currentSectionIndex = 0;

    this.engine.stop();

    this.renderSection();
    this.dialogElement.showModal();
  }

  private renderSection() {
    if (!this.currentDialogue) return;
    const section = this.currentDialogue.sections[this.currentSectionIndex];
    this.contentContainer.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = section.speakerName || "Speaker";
    const text = document.createElement("p");
    text.textContent = section.text;
    this.contentContainer.append(title, text);

    const btn = document.createElement("button");
    if (this.currentSectionIndex < this.currentDialogue.sections.length - 1) {
      btn.textContent = "Volgende";
      btn.onclick = () => {
        this.currentSectionIndex++;
        this.renderSection();
      };
    } else {
      btn.textContent = "Sluiten";
      btn.onclick = () => {
        this.dialogElement.close();
        this.engine.start();
      };
    }
    this.contentContainer.appendChild(btn);
  }
}
