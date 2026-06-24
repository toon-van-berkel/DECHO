import * as ex from "excalibur";
import { BaseScene } from "./BaseScene";
import jaxData from "../data/jax.json";
import { NpcData } from "../types/NpcData";
import { Resources } from "../resources";


export class MarketSquareScene extends BaseScene {
  constructor(engine: ex.Engine) {
    super(engine, jaxData as NpcData, "theDocks");
  }
  onInitialize(engine: ex.Engine): void {
    this.backgroundColor = ex.Color.Black;

    const width = engine.drawWidth;
    const height = engine.drawHeight;


    const background = new ex.Actor({
      pos: ex.vec(width / 3.3, height / 2),
      anchor: ex.vec(0.5, 0.5),
      z: -100,
      width,
      height,
    });

    const jax = new ex.Actor({
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
    jax.graphics.use(
      new ex.Sprite({
        image: Resources.Characters.jax,
        destSize: {
          width: width * 0.44,
          height: height * 0.88,
        },
      }),
    );

    this.add(background);
    this.add(jax);
  }
  onActivate() {
    super.onActivate();
  }
}
