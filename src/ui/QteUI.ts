import * as ex from 'excalibur';

// Definieert de toegestane toetsen en hun visuele representatie
const KEY_MAP = [
  { key: ex.Keys.Up, symbol: '↑' },
  { key: ex.Keys.Down, symbol: '↓' },
  { key: ex.Keys.Left, symbol: '←' },
  { key: ex.Keys.Right, symbol: '→' },
];

export class QteUI extends ex.ScreenElement {
  private currentSequence: typeof KEY_MAP = [];
  private index = 0;
  private time = 0;

  public onFinished?: (success: boolean) => void;
  private sequenceLabel: ex.Label;
  private timerLabel: ex.Label;

  constructor() {
    super({
      x: 50,
      y: 50,
      width: 400,
      height: 200,
      z: 200,
      color: new ex.Color(30, 30, 30, 0.95),
    });

    // labels aanmaken
    this.sequenceLabel = this.createLabel(ex.vec(200, 90), 36, ex.Color.Yellow);
    this.timerLabel = this.createLabel(ex.vec(200, 160), 22, ex.Color.Red);

    this.addChild(this.sequenceLabel);
    this.addChild(this.timerLabel);
    this.graphics.isVisible = false;
  }

  private createLabel(pos: ex.Vector, size: number, color: ex.Color) {
    return new ex.Label({
      pos,
      font: new ex.Font({ size, color, textAlign: ex.TextAlign.Center }),
    });
  }

  // Activeert de QTE: reset status, genereert een nieuwe willekeurige reeks en start de timer
  public start() {
    if (this.graphics.isVisible) return;

    // Genereert een reeks van 5 willekeurige toetsen
    this.currentSequence = Array.from(
      { length: 5 },
      () => KEY_MAP[Math.floor(Math.random() * KEY_MAP.length)],
    );
    this.index = 0;
    this.time = 4000;
    this.graphics.isVisible = true;
    this.updateDisplay();
  }

  // Frame-update functie: draait continu terwijl de scene actief is
  public onPreUpdate(engine: ex.Engine, delta: number) {
    if (!this.graphics.isVisible) return;

    // delta verwerkt tijd
    this.handleTimer(delta);
    //invoer
    this.handleInput(engine);
  }

  private handleTimer(delta: number) {
    // aftellen
    this.time -= delta;
    this.timerLabel.text = (this.time / 1000).toFixed(1) + 's';
    //niet gehaald als tijd om is
    if (this.time <= 0) this.finish(false);
  }

  // Controleert of de ingedrukte toets overeenkomt met de huidige stap in de reeks
  private handleInput(engine: ex.Engine) {
    const pressedKey = KEY_MAP.find((m) =>
      engine.input.keyboard.wasPressed(m.key),
    );
    if (!pressedKey) return;

    if (pressedKey.key === this.currentSequence[this.index].key) {
      //juiste toets door naar volgende
      this.index++;
      this.updateDisplay();
      //totdat alle toetsen zijn gehad
      if (this.index >= this.currentSequence.length) this.finish(true);
    } else {
      //bij fout niet gehaald
      this.finish(false);
    }
  }

  // stap voor stap visueel updaten
  private updateDisplay() {
    this.sequenceLabel.text = this.currentSequence
      .map(
        (item, i) =>
          i < this.index
            ? //wanneer deze key al is geweest toon -
              ' - '
            : i === this.index
              ? //huidige key die ingedrukt moet worden
                `[${item.symbol}]`
              : //key die nog ingedrukt moet worden
                ` ${item.symbol} `,

        // [↑] ↓ ← →
        //  - [↑] ← →
      )
      .join('');
  }

  private finish(success: boolean) {
    this.graphics.isVisible = false;
    this.onFinished?.(success);
  }
}
