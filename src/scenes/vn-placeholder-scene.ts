import { Canvas, Color, Engine, FadeInOut, Scene, ScreenElement } from 'excalibur';
import type { SceneActivationContext } from 'excalibur';
import type { CheckpointConfig } from '../map/checkpoint-config';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { THEME, themeColorHex } from '../theme';

/** "Back to map" button rectangle, kept within the always-visible center band. */
const BACK_RECT = { x: GAME_WIDTH / 2 - 110, y: 540, w: 220, h: 48 };

/**
 * Placeholder destination for a checkpoint's "travel" action. Shows the chosen
 * location's name and a button back to the map. Point a checkpoint's
 * `targetScene` at your own scene to replace this with a real visual novel.
 */
export class VNPlaceholderScene extends Scene {
  private locationTitle = 'ONBEKEND';
  private accentHex: string = THEME.accent.cyan;

  override onActivate(context: SceneActivationContext<CheckpointConfig>): void {
    const data = context.data;
    if (data) {
      this.locationTitle = data.title;
      this.accentHex = themeColorHex(data.theme);
    }
    // Rebuild on every entry so the title and accent match the latest checkpoint.
    this.clear();
    this.add(this.buildBackground());
    this.add(this.buildBackButton(context.engine));
  }

  private buildBackground(): ScreenElement {
    const element = new ScreenElement({ x: 0, y: 0, width: GAME_WIDTH, height: GAME_HEIGHT, z: 0 });
    element.graphics.use(
      new Canvas({
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        cache: true,
        smoothing: true,
        draw: (ctx) => {
          ctx.fillStyle = THEME.color.bg;
          ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = THEME.color.muted;
          ctx.font = `500 14px ${THEME.font.body}`;
          ctx.fillText('LOCATIE', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 70);
          ctx.fillStyle = this.accentHex;
          ctx.font = `900 40px ${THEME.font.heading}`;
          ctx.fillText(this.locationTitle, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20);
          ctx.fillStyle = THEME.color.text;
          ctx.font = `400 16px ${THEME.font.body}`;
          ctx.fillText('Visual novel komt hier.', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30);
        },
      }),
    );
    return element;
  }

  // Builds the "Back to map" button, which is always visible in the bottom center of the screen.
  private buildBackButton(engine: Engine): ScreenElement {
    const button = new ScreenElement({
      x: BACK_RECT.x,
      y: BACK_RECT.y,
      width: BACK_RECT.w,
      height: BACK_RECT.h,
      z: 1,
    });
    button.graphics.use(
      new Canvas({
        width: BACK_RECT.w,
        height: BACK_RECT.h,
        cache: true,
        smoothing: true,
        draw: (ctx) => {
          ctx.clearRect(0, 0, BACK_RECT.w, BACK_RECT.h);
          ctx.strokeStyle = this.accentHex;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(1, 1, BACK_RECT.w - 2, BACK_RECT.h - 2);
          ctx.fillStyle = this.accentHex;
          ctx.font = `700 14px ${THEME.font.heading}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('← TERUG NAAR KAART', BACK_RECT.w / 2, BACK_RECT.h / 2);
        },
      }),
    );
    button.on('pointerup', (evt) => {
      evt.cancel();
      engine.canvas.style.cursor = 'default';
      void engine.goToScene('map', {
        destinationIn: new FadeInOut({ duration: 400, direction: 'in', color: Color.Black }),
        sourceOut: new FadeInOut({ duration: 300, direction: 'out', color: Color.Black }),
      });
    });
    button.on('pointerenter', () => (engine.canvas.style.cursor = 'pointer'));
    button.on('pointerleave', () => (engine.canvas.style.cursor = 'default'));
    return button;
  }
}
