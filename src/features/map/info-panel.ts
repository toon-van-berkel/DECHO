/**
 * Map info panel for DECHO.
 *
 * Main responsibility:
 * - Shows selected location details and actions.
 *
 * Made by: Richie
 */

import * as excalibur from 'excalibur';
import { UiButton } from '../../components/ui/button';
import {
  drawDivider,
  drawHudPanel,
  wrapText,
} from '../../components/ui/hud-drawing';
import { THEME } from '../../core/theme/theme-index';
import type * as mapTypes from './map-types';

const panelWidth = 390;
const panelHeight = 226;
const panelPadding = THEME.spacing.panelPadding;

export class InfoPanel extends excalibur.ScreenElement {
  private selectedCheckpoint: mapTypes.MapCheckpointConfig | null = null;
  private readonly travelButton: UiButton;
  private readonly shopButton: UiButton;

  constructor(
    private readonly onTravel: (
      checkpointConfig: mapTypes.MapCheckpointConfig,
    ) => void,
    private readonly onOpenShop: (
      checkpointConfig: mapTypes.MapCheckpointConfig,
    ) => void,
  ) {
    super({ x: 42, y: 42, width: panelWidth, height: panelHeight, z: 80 });

    this.graphics.use(
      new excalibur.Canvas({
        width: panelWidth,
        height: panelHeight,
        cache: false,
        smoothing: true,
        draw: (context) => this.drawPanel(context),
      }),
    );

    this.travelButton = new UiButton({
      text: 'Travel',
      x: panelPadding,
      y: 166,
      width: 160,
      height: 42,
      onClick: () => {
        if (this.selectedCheckpoint) {
          this.onTravel(this.selectedCheckpoint);
        }
      },
    });

    this.shopButton = new UiButton({
      text: 'Shop',
      x: 196,
      y: 166,
      width: 150,
      height: 42,
      accent: THEME.accent.amber,
      onClick: () => {
        if (this.selectedCheckpoint) {
          this.onOpenShop(this.selectedCheckpoint);
        }
      },
    });
  }

  override onInitialize(): void {
    this.addChild(this.travelButton);
    this.addChild(this.shopButton);
    this.updateActions();
  }

  show(checkpointConfig: mapTypes.MapCheckpointConfig): void {
    this.selectedCheckpoint = checkpointConfig;
    this.updateActions();
  }

  private updateActions(): void {
    const hasSelectedLocation = this.selectedCheckpoint !== null;
    this.travelButton.setEnabled(hasSelectedLocation);
    this.shopButton.setEnabled(
      hasSelectedLocation && this.selectedCheckpoint?.opensShop === true,
    );
  }

  private drawPanel(context: CanvasRenderingContext2D): void {
    const accentColor = this.selectedCheckpoint
      ? THEME.accent[this.selectedCheckpoint.theme]
      : THEME.accent.cyan;
    const titleText = this.selectedCheckpoint?.title ?? 'CITY MAP';
    const subtitleText =
      this.selectedCheckpoint?.subtitle ?? 'Select a marked location';
    const descriptionText =
      this.selectedCheckpoint?.description ??
      'Hover and click a signal marker to inspect a route.';
    const linesArray = wrapText(descriptionText, 42).slice(0, 3);

    context.clearRect(0, 0, panelWidth, panelHeight);
    drawHudPanel(context, panelWidth, panelHeight, accentColor);

    context.textAlign = 'left';
    context.textBaseline = 'alphabetic';
    context.fillStyle = accentColor;
    context.font = `900 23px ${THEME.font.heading}`;
    context.fillText(titleText, panelPadding, 40);

    context.fillStyle = THEME.color.muted;
    context.font = `700 13px ${THEME.font.label}`;
    context.fillText(subtitleText.toUpperCase(), panelPadding, 64);

    drawDivider(context, panelPadding, 80, panelWidth - panelPadding * 2);

    context.fillStyle = THEME.color.softText;
    context.font = `400 14px ${THEME.font.body}`;
    linesArray.forEach((lineText, lineIndex) => {
      context.fillText(lineText, panelPadding, 108 + lineIndex * 20);
    });

    if (!this.selectedCheckpoint) {
      context.fillStyle = THEME.color.muted;
      context.font = `700 12px ${THEME.font.label}`;
      context.fillText('WAITING FOR SIGNAL', panelPadding, 184);
    }
  }
}
