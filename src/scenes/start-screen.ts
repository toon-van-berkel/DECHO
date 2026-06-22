import * as ex from "excalibur";
import { Resources } from "../resources";

export class StartScreen extends ex.Scene {
  onInitialize(engine: ex.Engine): void {
    this.backgroundColor = ex.Color.Black;

    const width = engine.drawWidth;
    const height = engine.drawHeight;

    // ik maak een background actor 
    const background = new ex.Actor({
      pos: ex.vec(width / 3.3, height / 2),
      anchor: ex.vec(0.5, 0.5),
      z: -100,
      width,
      height,
    });

    background.graphics.use(
      new ex.Sprite({
        image: Resources.Backgrounds.startscreen,
        destSize: {
          width,
          height,
        },
      }),
    );

    this.add(background);

    // ik maak de text aan voor het startscherm
    const startText = new ex.Label({
      text: "Klik om te starten",
      pos: ex.vec(width / 3.3, height - 220),
      z: 10,
      font: new ex.Font({
        family: "Orbitron",
        size: 32,
        unit: ex.FontUnit.Px,
        color: ex.Color.White, 
        textAlign: ex.TextAlign.Center,
      }),
    });

    // ik voeg de text toe
    this.add(startText);

    // ik zorg ervoor dat het hele scherm drukbaar is
    engine.input.pointers.primary.on("up", () => {
      engine.goToScene("mainMenu");
    });
  }
}
