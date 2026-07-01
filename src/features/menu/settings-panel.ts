/**
 * Settings panel for DECHO.
 *
 * Main responsibility:
 * - Shows a themed placeholder settings card (no options yet).
 *
 * Made by: Richie
 */

import * as excalibur from 'excalibur';
import { UiButton } from '../../components/ui/button';
import { drawDivider, drawHudPanel } from '../../components/ui/hud-drawing';
import { mapRenderSize } from '../../core/engine/engine-config';
import { THEME, withAlpha } from '../../core/theme/theme-index';

const SCREEN_WIDTH = mapRenderSize.width;
const SCREEN_HEIGHT = mapRenderSize.height;

const CARD_WIDTH = 480;
const CARD_HEIGHT = 300;
const CARD_X = (SCREEN_WIDTH - CARD_WIDTH) / 2;
const CARD_Y = (SCREEN_HEIGHT - CARD_HEIGHT) / 2;
const CENTER_X = CARD_X + CARD_WIDTH / 2;
const PADDING = THEME.spacing.panelPadding;

const BACKDROP_Z = 300;
const BUTTON_Z = 310;

export class SettingsPanel extends excalibur.ScreenElement {
  private isOpen = false;
  private readonly backButton: UiButton;

  constructor(private readonly onClosePanel: () => void) {
    super({
      x: 0,
      y: 0,
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      z: BACKDROP_Z,
    });

    this.graphics.use(
      new excalibur.Canvas({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        cache: false,
        smoothing: true,
        draw: (context) => this.drawPanel(context),
      }),
    );

    this.backButton = new UiButton({
      text: 'Terug',
      x: CENTER_X - 100,
      y: CARD_Y + 226,
      width: 200,
      height: 46,
      accent: THEME.accent.violet,
      variant: 'secondary',
      z: BUTTON_Z,
      onClick: () => this.onClosePanel(),
    });
  }

  override onInitialize(): void {
    this.addChild(this.backButton);

    this.on('pointerup', (event) => {
      if (this.isOpen) {
        event.cancel();
      }
    });
    this.on('pointerdown', (event) => {
      if (this.isOpen) {
        event.cancel();
      }
    });

    this.close();
  }

  open(): void {
    this.isOpen = true;
    this.graphics.isVisible = true;
    this.pointer.useGraphicsBounds = true;
    this.backButton.setEnabled(true);
  }

  close(): void {
    this.isOpen = false;
    this.graphics.isVisible = false;
    this.pointer.useGraphicsBounds = false;
    this.backButton.setEnabled(false);
  }

  private drawPanel(context: CanvasRenderingContext2D): void {
    context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    context.fillStyle = withAlpha(THEME.color.bg, 0.78);
    context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    context.save();
    context.translate(CARD_X, CARD_Y);
    drawHudPanel(context, CARD_WIDTH, CARD_HEIGHT, THEME.accent.amber);

    context.textAlign = 'center';
    context.textBaseline = 'alphabetic';
    context.fillStyle = THEME.accent.amber;
    context.font = `900 28px ${THEME.font.heading}`;
    context.fillText('INSTELLINGEN', CARD_WIDTH / 2, 54);

    context.fillStyle = THEME.color.muted;
    context.font = `700 13px ${THEME.font.label}`;
    context.fillText('AUDIO EN BEELD', CARD_WIDTH / 2, 78);

    drawDivider(context, 24, 94, CARD_WIDTH - 48);

    context.textAlign = 'left';
    context.fillStyle = THEME.color.softText;
    context.font = `700 16px ${THEME.font.label}`;
    context.fillText('Geluid', PADDING, 142);

    context.textAlign = 'right';
    context.fillStyle = THEME.color.muted;
    context.font = `700 13px ${THEME.font.label}`;
    context.fillText('BINNENKORT', CARD_WIDTH - PADDING, 142);

    context.textAlign = 'center';
    context.fillStyle = withAlpha(THEME.color.softText, 0.7);
    context.font = `400 13px ${THEME.font.body}`;
    context.fillText(
      'Meer opties worden later toegevoegd.',
      CARD_WIDTH / 2,
      182,
    );
    context.restore();
  }
}
