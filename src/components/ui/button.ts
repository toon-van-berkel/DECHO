import * as ex from 'excalibur';
import { Button } from '../../types/ui/Button';

export class UiButton extends ex.ScreenElement implements Button {
  // Initiating the Button variables
  public text: string;
  public destination: string;

  // Constructor with the text and destination as params
  constructor(text: string, destination: string, y: number) {
    super({
      width: 150,
      height: 50,
      x: 300,
      y: y,
    });

    // Set the text and destination to the param values
    this.text = text;
    this.destination = destination;
  }

  onInitialize(engine: ex.Engine): void {
    // Temporary white background for the UiButtons
    const background = new ex.Rectangle({
      width: this.width,
      height: this.height,
      color: ex.Color.White,
    });
    // Create a new label for the text in the center of the background element
    const label = new ex.Label({
      text: this.text,
      pos: ex.vec(this.width / 2, this.height / 2),
    });
    // Set the label graphics to excalibur text
    label.graphics.use(
      new ex.Text({
        text: this.text,
        // Use excalibur font to align the text in the center middle
        font: new ex.Font({
          textAlign: ex.TextAlign.Center,
          baseAlign: ex.BaseAlign.Middle,
        }),
      }),
    );

    // Add background to the class as the graphics
    this.graphics.use(background);
    // Add label as a child to the class / background
    this.addChild(label);

    // On mouse click a pointer event
    this.on('pointerup', (e: ex.PointerEvent) => {
      // Strict check => is the event of type excalibur PointerEvent?
      if (!(e instanceof ex.PointerEvent)) {
        return;
      }
      // Check if the player is using left click, if not return
      if (e.button !== ex.PointerButton.Left) {
        return;
      }
      // Call on the engine to get to the next scene as destination
      engine.goToScene(`${this.destination}`);
    });
  }
}
