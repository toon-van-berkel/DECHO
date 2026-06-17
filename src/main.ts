import { Color, DisplayMode, Engine, FadeInOut } from "excalibur";
import { loader } from "./resources";
import { MyLevel } from "./level";
import { DialogueUI } from "./ui/Dialogue";

const game = new Engine({
  width: 800,
  height: 600,
  displayMode: DisplayMode.FitScreenAndFill,
  pixelArt: true,
  scenes: {
    start: MyLevel,
  },
});

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
    const dialogueUI = new DialogueUI(game);
    game.currentScene.add(dialogueUI);

    dialogueUI.showDialogue("Vince");
  });
