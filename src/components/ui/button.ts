/**
 * UI button component for DECHO.
 *
 * Main responsibility:
 * - Draws reusable HSL-styled buttons without external UI assets.
 *
 * Made by: Casper
 */

import * as excalibur from 'excalibur';
import { approach, lerp } from './hud-drawing';
import { THEME, withAlpha } from '../../core/theme/theme-index';

export type UiButtonOptions = {
  text: string;
  x: number;
  y: number;
  z?: number;
  width: number;
  height: number;
  accent?: string;
  variant?: 'primary' | 'secondary';
  hideArrow?: boolean;
  renderIcon?: (
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    color: string,
  ) => void;
  onClick: () => void;
};

export class UiButton extends excalibur.ScreenElement {
  private readonly accentColor: string;
  private readonly buttonCanvas: excalibur.Canvas;
  private isPointerHovering = false;
  private isButtonEnabled = true;
  private hoverProgress = 0;

  constructor(private readonly buttonOptions: UiButtonOptions) {
    super({
      x: buttonOptions.x,
      y: buttonOptions.y,
      z: buttonOptions.z ?? 100,
      width: buttonOptions.width,
      height: buttonOptions.height,
    });

    this.accentColor = buttonOptions.accent ?? THEME.accent.cyan;
    this.buttonCanvas = new excalibur.Canvas({
      width: buttonOptions.width,
      height: buttonOptions.height,
      cache: false,
      smoothing: true,
      draw: (context) => this.drawButton(context),
    });
  }

  override onInitialize(engine: excalibur.Engine): void {
    this.graphics.use(this.buttonCanvas);

    this.on('pointerenter', () => {
      if (!this.isButtonEnabled) {
        return;
      }

      this.isPointerHovering = true;
      engine.canvas.style.cursor = 'pointer';
    });
    this.on('pointerleave', () => {
      this.isPointerHovering = false;
      engine.canvas.style.cursor = 'default';
    });
    this.on('pointerup', (event) => {
      if (!this.isButtonEnabled) {
        return;
      }

      event.cancel();
      this.buttonOptions.onClick();
    });
  }

  override onPreUpdate(_engine: excalibur.Engine, elapsedMs: number): void {
    this.hoverProgress = approach(
      this.hoverProgress,
      this.isPointerHovering && this.isButtonEnabled ? 1 : 0,
      elapsedMs,
      THEME.motion.hoverMs,
    );
  }

  /**
   * Enables or disables the button.
   *
   * By default a disabled button is hidden (legacy behavior). Pass
   * keepVisible = true to keep it on screen as a dimmed, non-interactive row
   * (used for empty load slots).
   */
  setEnabled(isButtonEnabled: boolean, keepVisible = false): void {
    this.isButtonEnabled = isButtonEnabled;
    this.graphics.isVisible = isButtonEnabled || keepVisible;
    this.pointer.useColliderShape = isButtonEnabled;
    this.pointer.useGraphicsBounds = isButtonEnabled;
    if (!isButtonEnabled) {
      this.isPointerHovering = false;
    }
  }

  setText(text: string): void {
    this.buttonOptions.text = text;
  }

  private drawButton(context: CanvasRenderingContext2D): void {
    const { width, height, text } = this.buttonOptions;
    const variant = this.buttonOptions.variant ?? 'primary';
    const glowBlur = lerp(4, 18, this.hoverProgress);
    const horizontalPadding = 22;
    const arrowX = width - 28;

    context.clearRect(0, 0, width, height);
    context.save();
    context.globalAlpha = this.isButtonEnabled ? 1 : 0.35;

    context.beginPath();
    context.roundRect(1, 1, width - 2, height - 2, THEME.shape.buttonRadius);
    context.shadowColor = this.accentColor;
    context.shadowBlur = glowBlur;
    context.fillStyle =
      variant === 'primary'
        ? withAlpha(this.accentColor, lerp(0.18, 0.32, this.hoverProgress))
        : withAlpha(THEME.color.bg, 0.62);
    context.fill();
    context.shadowBlur = 0;
    context.lineWidth = 1.5;
    context.strokeStyle = this.accentColor;
    context.stroke();

    if (this.buttonOptions.renderIcon) {
      this.buttonOptions.renderIcon(context, width, height, this.accentColor);
      context.restore();
      return;
    }

    const hideArrow = this.buttonOptions.hideArrow ?? false;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillStyle =
      variant === 'primary' ? THEME.color.text : withAlpha(THEME.color.text, 0.9);
    context.font = `800 15px ${THEME.font.heading}`;
    context.fillText(
      text.toUpperCase(),
      horizontalPadding,
      height / 2 + 1,
      width - horizontalPadding * 2 - (hideArrow ? 0 : 28),
    );

    if (!hideArrow) {
      context.textAlign = 'center';
      context.fillStyle = withAlpha(this.accentColor, 0.78);
      context.font = `800 14px ${THEME.font.heading}`;
      context.fillText('>', arrowX, height / 2 + 1);
    }
    context.restore();
  }
}
