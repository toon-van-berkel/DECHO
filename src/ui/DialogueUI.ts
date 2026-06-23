import * as ex from 'excalibur';
import { Consequence, DialogueStep } from '../types/NpcData';

export class DialogueUI extends ex.ScreenElement {
  private textLabel: ex.Label;
  private buttons: ex.ScreenElement[] = [];
  private isClickingButton: boolean = false;

  // Callbacks die vanuit de scene worden ingevuld
  public onChoiceMade?: (consequence: Consequence) => void;
  public onNext?: () => void;

  constructor() {
    // dialogue bar onderin het scherm
    super({
      x: 0,
      y: 450,
      width: 800,
      height: 150,
      color: new ex.Color(0, 0, 0, 0.8),
    });

    // Label opzetten
    this.textLabel = new ex.Label({
      text: '',
      pos: ex.vec(20, 20),
      font: new ex.Font({
        family: 'sans-serif',
        size: 18,
        color: ex.Color.White,
      }),
    });
    this.addChild(this.textLabel);

    // Event voor 'verder klikken' op de dialoogbox zelf
    this.on('pointerup', () => {
      // Alleen verder gaan als we niet specifiek op een knop hebben geklikt
      if (!this.isClickingButton) {
        this.onNext?.();
      }
      this.isClickingButton = false;
    });
  }

  public show(dialogueStep: DialogueStep) {
    // daadwerkelijke tekst tonen met daarvoor de spreker naam
    this.textLabel.text = `${dialogueStep.speakerName}: ${dialogueStep.text}`;

    // Verwijder oude knoppen voordat we nieuwe tonen
    this.buttons.forEach((buttons) => this.removeChild(buttons));
    this.buttons = [];

    if (dialogueStep.type === 'decision' && dialogueStep.options) {
      dialogueStep.options.forEach((option, i) => {
        const btn = new ex.ScreenElement({
          x: 20,
          y: 60 + i * 40,
          width: 400,
          height: 30,
          color: ex.Color.DarkGray,
        });

        // Voeg de tekst toe aan de knop
        btn.addChild(
          new ex.Label({
            // komt uit json
            text: option.buttonText,
            pos: ex.vec(10, 8),
            font: new ex.Font({ size: 14, color: ex.Color.White }),
          }),
        );

        // de keuze opties
        btn.on('pointerup', () => {
          this.isClickingButton = true;
          this.onChoiceMade?.(option.consequence);
        });

        this.addChild(btn);
        this.buttons.push(btn);
      });
    }
  }
}
