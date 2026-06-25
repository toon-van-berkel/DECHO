/**
 * Shop panel for DECHO.
 *
 * Main responsibility:
 * - Shows a compact map shop card.
 *
 * Made by: Richie
 */

import * as excalibur from 'excalibur';
import {
  drawDivider,
  drawHudPanel,
} from '../../components/ui/hud-drawing';
import { mapRenderSize } from '../../core/engine/engine-config';
import { THEME } from '../../core/theme/theme-index';

const panelWidth = 330;
const panelHeight = 154;

export class ShopPanel extends excalibur.ScreenElement {
  private locationName = 'Black Market';
  private accentColor: string = THEME.accent.amber;

  constructor() {
    super({
      x: mapRenderSize.width - panelWidth - 34,
      y: 42,
      width: panelWidth,
      height: panelHeight,
      z: 92,
    });

    this.graphics.use(
      new excalibur.Canvas({
        width: panelWidth,
        height: panelHeight,
        cache: false,
        smoothing: true,
        draw: (context) => this.drawPanel(context),
      }),
    );
  }

  show(locationName: string, accentColor: string): void {
    this.locationName = locationName;
    this.accentColor = accentColor;
  }

  private drawPanel(context: CanvasRenderingContext2D): void {
    context.clearRect(0, 0, panelWidth, panelHeight);
    drawHudPanel(context, panelWidth, panelHeight, this.accentColor);

    context.textAlign = 'left';
    context.textBaseline = 'alphabetic';
    context.fillStyle = this.accentColor;
    context.font = `900 20px ${THEME.font.heading}`;
    context.fillText('TOKEN SHOP', 20, 34);

    context.fillStyle = THEME.color.muted;
    context.font = `700 12px ${THEME.font.label}`;
    context.fillText(this.locationName.toUpperCase(), 20, 58);

    drawDivider(context, 20, 74, panelWidth - 40);

    context.fillStyle = THEME.color.softText;
    context.font = `400 13px ${THEME.font.body}`;
    context.fillText('Inventory sync is ready.', 20, 102);
    context.fillText('Items can be connected later.', 20, 122);
  }
}
