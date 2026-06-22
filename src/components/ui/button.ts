import * as ex from 'excalibur';
import { Button } from '../../types/ui/Button';
import { Resources } from '../../resources';

function drawButton(width: number, height: number): ex.Rectangle {
    return new ex.Rectangle({
        width: width,
        height: height,
    });
}

export class UiButton extends ex.ScreenElement implements Button {
    // Initiating the Button variables
    public text: string;
    public destination: string;

    // Use for later checks on the buttons hover state
    private isHovering: boolean;

    // Initiaite the mainButton and sideButton, there is no functional difference I just like the look
    private mainButton!: ex.Rectangle;
    private sideButton!: ex.Rectangle;

    // Constructor with the text and destination as params
    constructor(text: string, destination: string, y: number) {
        super({
            width: 193,
            height: 100,
            x: 300,
            y: y,
        });

        // Set the text and destination to the param values
        this.text = text;
        this.destination = destination;
        this.isHovering = false;
    }

    onInitialize(engine: ex.Engine): void {
        const container = Resources.UIElements['container'];
        const containerSprite = container.toSprite(container);

        containerSprite.scale = ex.vec(.6, .6);

        // Draw the mainButton and sideButton elements
        this.mainButton = drawButton(120, 50);
        this.sideButton = drawButton(60, 50);

        // Instantiate a new button GraphicsGroup to layer the buttons
        const buttonGroup = new ex.GraphicsGroup({
            useAnchor: false,
            members: [
                {
                    graphic: containerSprite,
                    offset: ex.vec(0, 0),
                },
                {
                    graphic: this.mainButton,
                    offset: ex.vec(4, 14),
                },
                {
                    graphic: this.sideButton,
                    offset: ex.vec(128, 14),
                },
            ]
        });

        // Check for hovering on the button group, and change the boolean
        this.on('pointerenter', () => this.isHovering = true);
        this.on('pointerleave', () => this.isHovering = false);

        // Create a new label for the text in the center of the mainButton element
        const label = new ex.Label({
            text: this.text,
            pos: ex.vec(40, 20),
        });
        // Set the label graphics to excalibur text
        label.graphics.use(new ex.Text({
            text: this.text,
            // Use excalibur font to align the text in the center middle
            font: new ex.Font({
                textAlign: ex.TextAlign.Center,
                baseAlign: ex.BaseAlign.Middle,
            })
        }));

        // Add the buttonGroup
        this.graphics.use(buttonGroup);
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

    // After frame updates change the state of the buttons based on the hover state
    onPostUpdate(engine: ex.Engine, elapsed: number): void {
        if (this.isHovering) {
            this.mainButton.color = ex.Color.Blue;
            this.sideButton.color = ex.Color.Blue;
        } else {
            this.mainButton.color = ex.Color.White;
            this.sideButton.color = ex.Color.White;
        }
    }
}