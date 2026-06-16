import { Color, DisplayMode, Engine, FadeInOut } from "excalibur";
import { loader } from "./resources";
import { MyLevel } from "./level";

import { DialogManager } from "./ui/DialogueManager";
import { Dialogue } from "./ui/Dialogue";

const game = new Engine({
  width: 800,
  height: 600,
  displayMode: DisplayMode.FitScreenAndFill,
  pixelArt: true,
  scenes: {
    start: MyLevel,
  },
});

const dialogManager = new DialogManager("test-dialog", game);

// voorbeeld data. deze roep je later aan in de npc zelf
const testDialoog: Dialogue = {
  npcId: "Vince",
  canClosedEarly: true,
  sections: [
    { id: "1", text: "Welkom bij de game!", speakerName: "Vince" },
    {
      id: "2",
      text: "Gebruik je pijltjestoetsen om te bewegen.",
      speakerName: "Vince",
    },
  ],
};

game
  .start("start", {
    loader,
    inTransition: new FadeInOut({
      duration: 1000,
      direction: "in",
      color: Color.ExcaliburBlue,
    }),
  })
  .then(() => {
    // na start game wordt dialog getoond
    dialogManager.showDialogue(testDialoog);
  });

export { dialogManager };
