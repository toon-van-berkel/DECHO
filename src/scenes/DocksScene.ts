import * as ex from "excalibur";
import { BaseScene } from "./BaseScene";
import miraData from "../data/mira.json";
import { NpcData } from "../types/NpcData";
import { Resources } from "../resources";

// extentie van BaseScene
export class DocksScene extends BaseScene {
  constructor(engine: ex.Engine) {
    super(engine, miraData as NpcData, "blackMarket");
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

    const mira = new ex.Actor({
      pos: ex.vec(width / 2, height / 1.2),
      anchor: ex.vec(0.5, 0.5),
      z: -100,
      width,
      height,
    });

    background.graphics.use(
      new ex.Sprite({
        image: Resources.Backgrounds.harborclean,
        destSize: {
          width,
          height,
        },
      }),
    );
    mira.graphics.use(
      new ex.Sprite({
        image: Resources.Characters.mira,
        destSize: {
          width: width * 0.44,
          height: height * 0.88,
        },
      }),
    );

    this.add(background);
    this.add(mira);
  }
  onActivate() {
    super.onActivate();
  }
}
