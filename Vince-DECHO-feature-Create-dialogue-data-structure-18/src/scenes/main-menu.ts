import * as ex from 'excalibur';
import { UiButton } from '../components/ui/button';
import { Button } from '../types/ui/Button';

export class MainMenu extends ex.Scene {
  // Add a private startButtonText of type string for later use within this class
  private startButtonText: string;

  constructor() {
    super();
    // Initiate the startButtonText and set it to an empty string
    this.startButtonText = '';
  }
  // onInitialize to create the buttons only once on starting -- fixed
  onInitialize(engine: ex.Engine): void {
    // Once this scene activates decide if there is playerData stored in the localStorage
    const playerData = localStorage.getItem('playerData');
    // Label to define the games current version, may later be changed
    const gameVersion = new ex.Label({
      text: 'Game ver: 0.0.01',
      pos: ex.vec(10, 10),
    });

    // Set the startButtonText based on if there is existing playerData
    this.startButtonText = playerData ? 'Continue' : 'Start Game';

    // From this point on, I am experimenting with ways to get the best dynamic results for the buttons
    // Create an array of Buttons
    const sceneButtons: Button[] = [
      //naar de eerste scene de market
      { text: this.startButtonText, destination: 'marketSquare' },
      { text: 'Load Game', destination: 'mainMenu' },
      { text: 'Settings', destination: 'mainMenu' },
    ];

    // Define a starting value for the y on the UiButton and spacing between those values
    const startY = 200;
    const spacing = 80;

    // For each of the scene buttons get the buttonData and i (index)
    sceneButtons.forEach((buttonData, i) => {
      // Calculate the y position of the UiButtons
      const slotY = startY + i * spacing;
      // Create the new UiButton based on the values
      const button = new UiButton(
        buttonData.text,
        buttonData.destination,
        slotY,
      );
      // Add the new button
      this.add(button);
    });
    // Add the game version label
    this.add(gameVersion);
  }
}
