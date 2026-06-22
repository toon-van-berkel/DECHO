import * as ex from "excalibur";
import { Resources } from "../resources";

export class TestScene extends ex.Scene {
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

    const mira = new ex.Actor({
      pos: ex.vec(width / 2, height / 1.2),
      anchor: ex.vec(0.5, 0.5),
      z: -100,
      width,
      height,
    });

    background.graphics.use(
      new ex.Sprite({
        image: Resources.Backgrounds.labclean,
        destSize: {
          width,
          height,
        },
      }),
    );
    mira.graphics.use(
      new ex.Sprite({
        image: Resources.Characters.vex,
        destSize: {
          width: width * 0.44, 
          height: height * 0.88,
        },
      }),
    );

    this.add(background);
    this.add(mira);
    // ik zorg ervoor dat het hele scherm drukbaar is
    engine.input.pointers.primary.on("up", () => {
      engine.goToScene("mainMenu");
    });
  }
}
