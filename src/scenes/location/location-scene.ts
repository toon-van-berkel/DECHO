/**
 * Location scene for DECHO.
 *
 * Main responsibility:
 * - Renders current story dialogue through scene-facing story functions.
 *
 * Made by: Richie
 */

import * as excalibur from 'excalibur';
import { mapRenderSize } from '../../core/engine/engine-config';
import { fadeToScene } from '../../core/navigation/navigate';
import {
  getBackgroundResource,
  getCharacterResource,
} from '../../core/resources/resource-loader';
import { DialogueBox } from '../../features/dialogue/dialogue-box';
import * as dialogueOptions from '../../features/dialogue/dialogue-options';
import * as dialogueService from '../../features/dialogue/dialogue-service';
import { PauseOverlay } from '../../features/menu/pause-overlay';
import * as saveService from '../../features/save/save-service';
import * as storyService from '../../features/story/story-service';
import type * as storyTypes from '../../features/story/story-types';

export class LocationScene extends excalibur.Scene {
  private dialogueBox?: DialogueBox;
  private pauseOverlay?: PauseOverlay;
  private optionButtonsArray: excalibur.ScreenElement[] = [];
  private renderedActorsArray: excalibur.Actor[] = [];
  private isLeaving = false;

  override onInitialize(engine: excalibur.Engine): void {
    // Created once and reused so it survives the per-dialogue re-render.
    this.pauseOverlay = new PauseOverlay(() => {
      this.isLeaving = true;
      saveService.autosave();
      fadeToScene(engine, 'mainMenu');
    });
    this.add(this.pauseOverlay);
  }

  override onActivate(): void {
    this.isLeaving = false;
    this.renderCurrentDialogue();
  }

  override onPreUpdate(engine: excalibur.Engine): void {
    if (this.isLeaving) {
      return;
    }

    if (engine.input.keyboard.wasPressed(excalibur.Keys.Escape)) {
      this.pauseOverlay?.toggle();
    }
  }

  private renderCurrentDialogue(): void {
    // Remove only the previous dialogue actors so the pause overlay persists.
    this.clearRenderedActors();
    this.pauseOverlay?.hide();

    const currentDialogueView = storyService.getCurrentDialogue();
    this.addRendered(this.createBackground(currentDialogueView.location));
    this.addCharacters(currentDialogueView.location);

    this.dialogueBox = new DialogueBox();
    this.addRendered(this.dialogueBox);

    const dialogueView = dialogueService.createDialogueView(currentDialogueView);
    this.dialogueBox.setContent(dialogueView.speakerName, dialogueView.text);

    this.optionButtonsArray = dialogueOptions.createDialogueOptionButtons(
      dialogueView.optionsArray,
      (choiceId) => this.chooseOption(choiceId),
    );
    this.optionButtonsArray.forEach((button) => this.addRendered(button));
  }

  private addRendered(actor: excalibur.Actor): void {
    this.renderedActorsArray.push(actor);
    this.add(actor);
  }

  private clearRenderedActors(): void {
    this.renderedActorsArray.forEach((actor) => this.remove(actor));
    this.renderedActorsArray = [];
    this.optionButtonsArray = [];
  }

  private chooseOption(choiceId: string): void {
    const choiceResponse = storyService.chooseDialogueOption(choiceId);
    if (!choiceResponse.isSuccess || !choiceResponse.data) {
      return;
    }

    if (choiceResponse.data.nextScene === 'qte' && choiceResponse.data.qteId) {
      void this.engine.goToScene('qte', {
        sceneActivationData: { qteId: choiceResponse.data.qteId },
      });
      return;
    }

    if (choiceResponse.data.nextScene === 'map') {
      void this.engine.goToScene('map');
      return;
    }

    this.renderCurrentDialogue();
  }

  private createBackground(
    locationDataObject: storyTypes.LocationData,
  ): excalibur.Actor {
    const backgroundResource =
      getBackgroundResource(locationDataObject.backgroundResourceKey) ??
      getBackgroundResource('background-map');

    if (!backgroundResource) {
      throw new Error('No background resource could be loaded.');
    }

    const coverScale = Math.max(
      mapRenderSize.width / backgroundResource.width,
      mapRenderSize.height / backgroundResource.height,
    );
    const backgroundActor = new excalibur.Actor({
      pos: excalibur.vec(mapRenderSize.width / 2, mapRenderSize.height / 2),
      anchor: excalibur.vec(0.5, 0.5),
      z: 0,
    });

    backgroundActor.graphics.use(backgroundResource.toSprite());
    backgroundActor.scale = excalibur.vec(coverScale, coverScale);
    return backgroundActor;
  }

  private addCharacters(locationDataObject: storyTypes.LocationData): void {
    locationDataObject.characterResourceKeysArray.forEach((characterKey) => {
      const characterResource = getCharacterResource(characterKey);
      if (!characterResource) {
        return;
      }

      const characterActor = new excalibur.Actor({
        pos: excalibur.vec(300, 580),
        anchor: excalibur.vec(0.5, 1),
        z: 10,
      });
      characterActor.graphics.use(characterResource.toSprite());
      characterActor.scale = excalibur.vec(0.28, 0.28);
      this.addRendered(characterActor);
    });
  }
}
