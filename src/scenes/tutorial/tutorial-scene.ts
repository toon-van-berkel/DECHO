/**
 * Tutorial and instructions scene for DECHO.
 *
 * Made by: Toon van Berkel
 */

import * as excalibur from 'excalibur';
import { UiButton } from '../../components/ui/button';
import { drawDivider, drawHudPanel, wrapText } from '../../components/ui/hud-drawing';
import { mapRenderSize } from '../../core/engine/engine-config';
import { THEME, withAlpha } from '../../core/theme/theme-index';
import * as saveService from '../../features/save/save-service';
import * as runTimerService from '../../features/timer/run-timer-service';

type TutorialSceneData = { canStartRun?: boolean };

const panel = { x: 180, y: 56, width: 920, height: 540 };

export class TutorialScene extends excalibur.Scene {
  private canStartRun = false;
  private startButton?: UiButton;

  override onInitialize(engine: excalibur.Engine): void {
    this.add(this.createBackdrop());
    this.add(this.createPanel());
    this.startButton = new UiButton({
      text: 'Start onderzoek',
      x: 650,
      y: 620,
      width: 280,
      height: 50,
      accent: THEME.accent.green,
      onClick: () => {
        runTimerService.startRun();
        saveService.autosave();
        void engine.goToScene('map');
      },
    });
    this.add(this.startButton);
    this.add(
      new UiButton({
        text: 'Terug naar menu',
        x: 350,
        y: 620,
        width: 280,
        height: 50,
        accent: THEME.accent.violet,
        variant: 'secondary',
        onClick: () => void engine.goToScene('mainMenu'),
      }),
    );
  }

  override onActivate(
    context: excalibur.SceneActivationContext<TutorialSceneData>,
  ): void {
    this.canStartRun = context.data?.canStartRun === true;
    this.startButton?.setEnabled(this.canStartRun, true);
  }

  private createBackdrop(): excalibur.ScreenElement {
    const element = new excalibur.ScreenElement({
      x: 0,
      y: 0,
      width: mapRenderSize.width,
      height: mapRenderSize.height,
      z: 0,
    });
    element.graphics.use(
      new excalibur.Canvas({
        width: mapRenderSize.width,
        height: mapRenderSize.height,
        cache: true,
        draw: (context) => {
          context.fillStyle = THEME.color.bg;
          context.fillRect(0, 0, mapRenderSize.width, mapRenderSize.height);
          context.strokeStyle = withAlpha(THEME.accent.cyan, 0.12);
          for (let x = 0; x < mapRenderSize.width; x += 80) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, mapRenderSize.height);
            context.stroke();
          }
        },
      }),
    );
    return element;
  }

  private createPanel(): excalibur.ScreenElement {
    const element = new excalibur.ScreenElement({ ...panel, z: 10 });
    element.graphics.use(
      new excalibur.Canvas({
        width: panel.width,
        height: panel.height,
        cache: false,
        draw: (context) => this.drawInstructions(context),
      }),
    );
    return element;
  }

  private drawInstructions(context: CanvasRenderingContext2D): void {
    context.clearRect(0, 0, panel.width, panel.height);
    drawHudPanel(context, panel.width, panel.height, THEME.accent.cyan);
    context.textAlign = 'left';
    context.fillStyle = THEME.accent.cyan;
    context.font = `900 30px ${THEME.font.heading}`;
    context.fillText('INSTRUCTIES', 44, 58);
    context.fillStyle = THEME.color.muted;
    context.font = `700 13px ${THEME.font.label}`;
    context.fillText('ONDERCOVER PRIVACY-ONDERZOEK', 44, 84);
    drawDivider(context, 44, 102, panel.width - 88);

    const sections = [
      ['MISSIE', 'Je bent een undercover detective in een stad waar datachips persoonlijke informatie delen. Onderzoek locaties, praat met NPC’s en maak keuzes.'],
      ['BESTURING', 'Klik op locaties, dialoogkeuzes en knoppen. Gebruik de pijltjestoetsen tijdens snelle data-uitdagingen. Druk Escape om te pauzeren.'],
      ['DATA-ECHO', 'Elke keuze laat een digitaal spoor achter. Hoe meer data je achterlaat, hoe groter het risico. Privacy gaat over controle over je eigen informatie.'],
      ['VOORTGANG EN TIJD', 'Rond 10 opdrachten af: twee per locatie. Je voortgang staat op de kaart. Speel de volledige route zo snel mogelijk voor een betere lokale tijd.'],
    ];
    sections.forEach(([title, body], index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      const x = 44 + column * 420;
      const y = 142 + row * 170;
      context.fillStyle = index === 2 ? THEME.accent.magenta : THEME.accent.green;
      context.font = `900 16px ${THEME.font.heading}`;
      context.fillText(title, x, y);
      context.fillStyle = THEME.color.softText;
      context.font = `400 14px ${THEME.font.body}`;
      wrapText(body, 48).slice(0, 6).forEach((line, lineIndex) => {
        context.fillText(line, x, y + 28 + lineIndex * 21);
      });
    });

    context.fillStyle = withAlpha(THEME.accent.amber, 0.95);
    context.font = `700 13px ${THEME.font.label}`;
    context.fillText(
      this.canStartRun
        ? 'DE TIMER START WANNEER JE OP START ONDERZOEK KLIKT.'
        : 'START EEN NIEUW SPEL VIA HET MENU OM EEN RUN TE BEGINNEN.',
      44,
      506,
    );
  }
}
