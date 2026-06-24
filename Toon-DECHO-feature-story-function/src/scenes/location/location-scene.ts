import * as excalibur from 'excalibur';
import * as resources from '../../core/resources';
import * as dialogHelpers from '../../features/map/dialog/dialog-helpers';
import * as dialogLoader from '../../features/map/dialog/dialog-loader';
import * as dialogLayout from '../../features/map/dialog/dialog-layout';
import * as theme from '../../core/theme';

import type * as typeexcalibur from 'excalibur';
import type * as typeDialog from '../../features/map/dialog/dialog-types';
import type * as typeDialogLayout from '../../features/map/dialog/dialog-layout';

import { DialogOptionButton } from '../../features/map/dialog/dialog-option-button';
import { DialogPanel } from '../../features/map/dialog/dialog-panel';

export class LocationScene extends excalibur.Scene {
  private gameEngine!: excalibur.Engine;
  private location: typeDialog.LocationDialogData | null = null;
  private panel!: DialogPanel;
  private optionButtons: DialogOptionButton[] = [];
  private accent: string = theme.THEME.accent.cyan;
  private progress = dialogHelpers.createDialogProgress();
  private currentNodeId = '';
  private layout!: typeDialogLayout.VisualNovelLayout;
  private resizeSubscription?: typeexcalibur.Subscription;

  override onActivate(
    context: typeexcalibur.SceneActivationContext<typeDialog.LocationSceneActivationData>,
  ): void {
    this.gameEngine = context.engine;
    this.gameEngine.canvas.style.cursor = 'default';
    this.clear();
    this.optionButtons = [];
    this.progress = dialogHelpers.createDialogProgress();
    this.accent = theme.themeColorHex(context.data?.theme ?? 'cyan');
    this.resizeSubscription?.close();
    this.updateLayout();

    const locationId = context.data?.locationId ?? 'map';
    this.location = dialogLoader.getLocation(locationId) ?? null;
    this.currentNodeId = this.location?.startNode ?? '';
    this.renderLocation(locationId);
    this.resizeSubscription = this.gameEngine.screen.events.on('resize', () => {
      this.updateLayout();
      this.renderLocation(locationId);
    });
  }

  override onDeactivate(): void {
    this.resizeSubscription?.close();
    this.resizeSubscription = undefined;
  }

  private updateLayout(): void {
    const resolution = this.gameEngine.screen.resolution;
    const contentArea = this.gameEngine.screen.contentArea;
    const safeArea: typeDialogLayout.LayoutBounds = {
      x: contentArea.left,
      y: contentArea.top,
      width: contentArea.width,
      height: contentArea.height,
    };
    this.layout = dialogLayout.getVisualNovelLayout(
      resolution.width,
      resolution.height,
      {
        x: 0,
        y: 0,
        width: safeArea.width,
        height: safeArea.height,
      },
      safeArea,
    );
  }

  private renderLocation(locationId: string): void {
    this.clear();
    this.optionButtons = [];
    if (!this.location) {
      this.add(this.buildBackground('background-map'));
      this.panel = new DialogPanel(this.layout.panel);
      this.add(this.panel);
      this.showFallback(`Locatie "${locationId}" kon niet worden geladen.`);
      return;
    }

    this.add(this.buildBackground(this.location.background));
    for (const characterId of this.location.characters) {
      const character = dialogLoader.getCharacter(characterId);
      if (character?.sprite) {
        const Actor = this.buildCharacter(character);
        if (Actor) {
          this.add(Actor);
        }
      }
    }

    this.panel = new DialogPanel(this.layout.panel);
    this.add(this.panel);
    this.showNode(this.currentNodeId || this.location.startNode);
  }

  private showNode(nodeId: string): void {
    if (!this.location) {
      this.showFallback('Er is geen locatie actief.');
      return;
    }

    const node = dialogLoader.getDialogNode(this.location, nodeId);
    if (!node) {
      this.showFallback(`Dialoogknooppunt "${nodeId}" ontbreekt.`);
      return;
    }

    this.currentNodeId = nodeId;
    const speaker = dialogLoader.getCharacter(node.speaker)?.name ?? 'Systeem';
    this.panel.setContent(speaker, node.text, this.accent);

    if (node.optionGroup) {
      const options = dialogLoader.getOptionGroup(node.optionGroup);
      if (!options) {
        this.showFallback(`Optiegroep "${node.optionGroup}" ontbreekt.`);
        return;
      }
      this.setOptions(options);
      return;
    }

    this.setOptions([this.createProgressOption(node)]);
  }

  private createProgressOption(node: typeDialog.DialogNode): typeDialog.PlayerOption {
    if (node.action === 'returnToMap' || !node.nextNode) {
      return {
        id: `${node.id}-return`,
        label: 'Terug naar de kaart.',
        nextNode: null,
        action: 'returnToMap',
      };
    }

    return {
      id: `${node.id}-continue`,
      label: 'Verder.',
      nextNode: node.nextNode,
    };
  }

  private setOptions(options: typeDialog.PlayerOption[]): void {
    for (const button of this.optionButtons) {
      this.remove(button);
    }
    const buttonLayout = dialogLayout.getOptionButtonLayout(this.layout, options.length);
    this.optionButtons = options.map((option, index) => {
      const button = new DialogOptionButton({
        x: buttonLayout.x,
        y: buttonLayout.startY + index * (buttonLayout.height + buttonLayout.gap),
        width: buttonLayout.width,
        height: buttonLayout.height,
        fontSize: buttonLayout.fontSize,
        label: option.label,
        accent: this.accent,
        onSelect: () => this.selectOption(option),
      });
      this.add(button);
      return button;
    });
  }

  private selectOption(option: typeDialog.PlayerOption): void {
    dialogHelpers.applyOptionEffect(this.progress, option.effects);

    if (option.action === 'returnToMap') {
      this.returnToMap();
      return;
    }

    if (option.nextNode) {
      this.showNode(option.nextNode);
      return;
    }

    this.showFallback(`Optie "${option.id}" heeft geen vervolg.`);
  }

  private showFallback(message: string): void {
    this.panel.setContent('Systeem', message, theme.THEME.accent.red);
    this.accent = theme.THEME.accent.red;
    this.setOptions([
      {
        id: 'fallback-return',
        label: 'Terug naar de kaart.',
        nextNode: null,
        action: 'returnToMap',
      },
    ]);
  }

  private buildBackground(resourceKey: string): excalibur.Actor {
    const image =
      resources.getBackgroundResource(resourceKey) ??
      resources.getBackgroundResource('background-map');
    if (!image) {
      const fallback = new excalibur.ScreenElement({
        x: 0,
        y: 0,
        width: this.layout.screen.width,
        height: this.layout.screen.height,
        z: 0,
      });
      fallback.graphics.opacity = 0;
      return fallback;
    }

    const scale = dialogLayout.getCoverScale(
      image.width,
      image.height,
      this.layout.screen.width,
      this.layout.screen.height,
    );
    const background = new excalibur.Actor({
      pos: excalibur.vec(
        this.layout.screen.width / 2,
        this.layout.screen.height / 2,
      ),
      anchor: excalibur.vec(0.5, 0.5),
      z: 0,
    });
    background.graphics.use(image.toSprite());
    background.scale = excalibur.vec(scale, scale);
    return background;
  }

  private buildCharacter(character: typeDialog.CharacterDialogData): excalibur.Actor | null {
    if (!character.sprite) {
      return null;
    }
    const image = resources.getCharacterResource(character.sprite);
    if (!image) {
      return null;
    }

    const characterLayout = dialogLayout.getCharacterLayout(character.position, this.layout);
    const scale = characterLayout.targetHeight / image.height;
    const Actor = new excalibur.Actor({
      pos: excalibur.vec(characterLayout.x, characterLayout.feetY),
      anchor: excalibur.vec(0.5, 1),
      z: 10,
    });
    Actor.graphics.use(image.toSprite());
    Actor.scale = excalibur.vec(scale, scale);
    return Actor;
  }

  private returnToMap(): void {
    void this.gameEngine.goToScene('map', {
      destinationIn: new excalibur.FadeInOut({
        duration: 400,
        direction: 'in',
        color: excalibur.Color.Black,
      }),
      sourceOut: new excalibur.FadeInOut({
        duration: 300,
        direction: 'out',
        color: excalibur.Color.Black,
      }),
    });
  }
}
