/**
 * Map checkpoint for DECHO.
 *
 * Main responsibility:
 * - Shows a styled clickable marker on the map.
 *
 * Made by: Richie
 */

import * as excalibur from 'excalibur';
import {
  approach,
  hexagonPoints,
  lerp,
} from '../../components/ui/hud-drawing';
import { THEME, toExcaliburColor, withAlpha } from '../../core/theme/theme-index';
import type * as mapTypes from './map-types';

const markerBitmapSize = 138;
const markerHitSize = 70;
const markerRadius = 25;
const markerCoreRadius = 4;

export class Checkpoint extends excalibur.Actor {
  private readonly accentColor: string;
  private hoverProgress = 0;
  private hoverTarget = 0;
  private pulseMs = 0;
  private isLocationSelected = false;

  constructor(
    private readonly checkpointConfig: mapTypes.MapCheckpointConfig,
    position: excalibur.Vector,
    onSelect: (checkpointConfig: mapTypes.MapCheckpointConfig) => void,
  ) {
    super({
      name: `checkpoint-${checkpointConfig.id}`,
      pos: position,
      width: markerHitSize,
      height: markerHitSize,
      z: 20,
    });

    this.accentColor = THEME.accent[checkpointConfig.theme];

    this.graphics.use(
      new excalibur.Canvas({
        width: markerBitmapSize,
        height: markerBitmapSize,
        cache: false,
        smoothing: true,
        draw: (context) => this.drawMarker(context),
      }),
    );

    this.pointer.useGraphicsBounds = false;
    this.on('pointerup', () => onSelect(this.checkpointConfig));
  }

  override onInitialize(engine: excalibur.Engine): void {
    this.addChild(this.createLabel(this.checkpointConfig.title, -9, 14, true));
    this.addChild(this.createLabel(this.checkpointConfig.subtitle, 11, 12, false));

    this.on('pointerenter', () => {
      this.hoverTarget = 1;
      engine.canvas.style.cursor = 'pointer';
    });
    this.on('pointerleave', () => {
      this.hoverTarget = 0;
      engine.canvas.style.cursor = 'default';
    });
    this.on('pointerup', () => {
      engine.canvas.style.cursor = 'default';
    });
  }

  override onPreUpdate(_engine: excalibur.Engine, elapsedMs: number): void {
    this.pulseMs += elapsedMs;
    this.hoverProgress = approach(
      this.hoverProgress,
      this.hoverTarget,
      elapsedMs,
      THEME.motion.hoverMs,
    );
  }

  setSelected(selectedLocationId: string | null): void {
    this.isLocationSelected = selectedLocationId === this.checkpointConfig.id;
  }

  private createLabel(
    text: string,
    yOffset: number,
    fontSize: number,
    isBold: boolean,
  ): excalibur.Actor {
    const labelActor = new excalibur.Actor({
      x: markerRadius + 17,
      y: yOffset,
      anchor: excalibur.vec(0, 0.5),
      z: 21,
    });

    labelActor.graphics.use(
      new excalibur.Text({
        text,
        font: new excalibur.Font({
          family: isBold ? THEME.font.heading : THEME.font.label,
          size: fontSize,
          unit: excalibur.FontUnit.Px,
          bold: isBold,
          color: toExcaliburColor(
            isBold ? THEME.color.text : THEME.color.muted,
          ),
          textAlign: excalibur.TextAlign.Left,
          baseAlign: excalibur.BaseAlign.Middle,
        }),
      }),
    );

    return labelActor;
  }

  private drawMarker(context: CanvasRenderingContext2D): void {
    const center = markerBitmapSize / 2;
    const selectedBoost = this.isLocationSelected ? 1 : 0;
    const pulse =
      (Math.sin((this.pulseMs / THEME.glow.pulseMs) * Math.PI * 2) + 1) / 2;
    const glow = lerp(
      THEME.glow.idleBlur,
      THEME.glow.hoverBlur + selectedBoost * 10,
      Math.max(this.hoverProgress, selectedBoost),
    );
    const radius =
      markerRadius + this.hoverProgress * 4 + selectedBoost * 3 + pulse * 1.5;
    const pointsArray = hexagonPoints(radius);

    context.clearRect(0, 0, markerBitmapSize, markerBitmapSize);
    context.save();
    context.translate(center, center);

    context.beginPath();
    pointsArray.forEach((point, pointIndex) => {
      if (pointIndex === 0) {
        context.moveTo(point.x, point.y);
        return;
      }

      context.lineTo(point.x, point.y);
    });
    context.closePath();

    context.shadowColor = this.accentColor;
    context.shadowBlur = glow * (0.82 + pulse * 0.18);
    context.fillStyle = withAlpha(
      this.accentColor,
      0.16 + this.hoverProgress * 0.1 + selectedBoost * 0.12,
    );
    context.fill();
    context.shadowBlur = 0;
    context.lineWidth = this.isLocationSelected ? 3 : 2;
    context.strokeStyle = this.accentColor;
    context.stroke();

    context.beginPath();
    context.arc(0, 0, markerCoreRadius, 0, Math.PI * 2);
    context.fillStyle = this.accentColor;
    context.fill();

    context.beginPath();
    context.arc(0, 0, radius + 9, 0, Math.PI * 2);
    context.strokeStyle = withAlpha(
      this.accentColor,
      this.isLocationSelected ? 0.28 : 0.08 + pulse * 0.08,
    );
    context.lineWidth = 1;
    context.stroke();

    context.restore();
  }
}
