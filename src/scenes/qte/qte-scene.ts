/**
 * QTE scene for DECHO.
 *
 * Main responsibility:
 * - Runs reusable QTE moments requested by the story service.
 *
 * Made by: Vince
 */

import * as excalibur from 'excalibur';
import { mapRenderSize } from '../../core/engine/engine-config';
import { THEME, withAlpha } from '../../core/theme/theme-index';
import { QteUi } from '../../features/qte/qte-ui';
import * as storyService from '../../features/story/story-service';

type QteSceneData = {
  qteId: string;
};

export class QteScene extends excalibur.Scene {
  override onActivate(
    context: excalibur.SceneActivationContext<QteSceneData>,
  ): void {
    this.clear();
    this.add(this.createBackdrop());
    const qteId = context.data?.qteId;
    if (!qteId) {
      void context.engine.goToScene('location');
      return;
    }

    const qteResponse = storyService.startQte(qteId);
    if (!qteResponse.isSuccess || !qteResponse.data) {
      void context.engine.goToScene('location');
      return;
    }

    const qteUi = new QteUi();
    this.add(qteUi);
    qteUi.start(qteResponse.data, (qteResult) => {
      storyService.completeQte(qteId, qteResult.isSuccess);
      void context.engine.goToScene('location');
    });
  }

  private createBackdrop(): excalibur.ScreenElement {
    const backdropElement = new excalibur.ScreenElement({
      x: 0,
      y: 0,
      width: mapRenderSize.width,
      height: mapRenderSize.height,
      z: 0,
    });

    backdropElement.graphics.use(
      new excalibur.Canvas({
        width: mapRenderSize.width,
        height: mapRenderSize.height,
        cache: true,
        smoothing: true,
        draw: (context) => {
          context.fillStyle = THEME.color.bg;
          context.fillRect(0, 0, mapRenderSize.width, mapRenderSize.height);
          context.strokeStyle = withAlpha(THEME.accent.violet, 0.12);
          context.lineWidth = 1;

          for (let x = 0; x <= mapRenderSize.width; x += 96) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, mapRenderSize.height);
            context.stroke();
          }

          for (let y = 0; y <= mapRenderSize.height; y += 72) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(mapRenderSize.width, y);
            context.stroke();
          }
        },
      }),
    );

    return backdropElement;
  }
}
