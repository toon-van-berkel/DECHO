import {
  Actor,
  Color,
  Engine,
  FadeInOut,
  Scene,
  ScreenElement,
  vec,
} from 'excalibur';
import type { SceneActivationContext, Subscription } from 'excalibur';
import {
  getBackgroundResource,
  getCharacterResource,
} from '../../core/resources';
import { THEME } from '../../core/theme';
import {
  applyOptionEffect,
  createDialogProgress,
} from '../../features/map/dialog/dialog-helpers';
import {
  getCharacter,
  getDialogNode,
  getLocation,
  getOptionGroup,
} from '../../features/map/dialog/dialog-loader';
import { DialogOptionButton } from '../../features/map/dialog/dialog-option-button';
import {
  DialogPanel,
} from '../../features/map/dialog/dialog-panel';
import {
  getCharacterLayout,
  getCoverScale,
  getOptionButtonLayout,
  getVisualNovelLayout,
} from '../../features/map/dialog/dialog-layout';
import type {
  LayoutBounds,
  VisualNovelLayout,
} from '../../features/map/dialog/dialog-layout';
import type {
  CharacterDialogData,
  DialogNode,
  LocationDialogData,
  LocationSceneActivationData,
  PlayerOption,
} from '../../features/map/dialog/dialog-types';

export class LocationScene extends Scene {
  private gameEngine!: Engine;
  private location: LocationDialogData | null = null;
  private panel!: DialogPanel;
  private optionButtons: DialogOptionButton[] = [];
  private accent: string = THEME.accent.cyan;
  private progress = createDialogProgress();
  private currentNodeId = '';
  private layout!: VisualNovelLayout;
  private resizeSubscription?: Subscription;

  override onActivate(
    context: SceneActivationContext<LocationSceneActivationData>,
  ): void {
    this.gameEngine = context.engine;
    this.gameEngine.canvas.style.cursor = 'default';
    this.clear();
    this.optionButtons = [];
    this.progress = createDialogProgress();
    this.accent = THEME.accent[context.data?.theme ?? 'cyan'];
    this.resizeSubscription?.close();
    this.updateLayout();

    const locationId = context.data?.locationId ?? 'map';
    this.location = getLocation(locationId) ?? null;
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
    const safeArea: LayoutBounds = {
      x: contentArea.left,
      y: contentArea.top,
      width: contentArea.width,
      height: contentArea.height,
    };
    this.layout = getVisualNovelLayout(
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
      const character = getCharacter(characterId);
      if (character?.sprite) {
        const actor = this.buildCharacter(character);
        if (actor) {
          this.add(actor);
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

    const node = getDialogNode(this.location, nodeId);
    if (!node) {
      this.showFallback(`Dialoogknooppunt "${nodeId}" ontbreekt.`);
      return;
    }

    this.currentNodeId = nodeId;
    const speaker = getCharacter(node.speaker)?.name ?? 'Systeem';
    this.panel.setContent(speaker, node.text, this.accent);

    if (node.optionGroup) {
      const options = getOptionGroup(node.optionGroup);
      if (!options) {
        this.showFallback(`Optiegroep "${node.optionGroup}" ontbreekt.`);
        return;
      }
      this.setOptions(options);
      return;
    }

    this.setOptions([this.createProgressOption(node)]);
  }

  private createProgressOption(node: DialogNode): PlayerOption {
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

  private setOptions(options: PlayerOption[]): void {
    for (const button of this.optionButtons) {
      this.remove(button);
    }
    const buttonLayout = getOptionButtonLayout(this.layout, options.length);
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

  private selectOption(option: PlayerOption): void {
    applyOptionEffect(this.progress, option.effects);

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
    this.panel.setContent('Systeem', message, THEME.accent.red);
    this.accent = THEME.accent.red;
    this.setOptions([
      {
        id: 'fallback-return',
        label: 'Terug naar de kaart.',
        nextNode: null,
        action: 'returnToMap',
      },
    ]);
  }

  private buildBackground(resourceKey: string): Actor {
    const image =
      getBackgroundResource(resourceKey) ??
      getBackgroundResource('background-map');
    if (!image) {
      const fallback = new ScreenElement({
        x: 0,
        y: 0,
        width: this.layout.screen.width,
        height: this.layout.screen.height,
        z: 0,
      });
      fallback.graphics.opacity = 0;
      return fallback;
    }

    const scale = getCoverScale(
      image.width,
      image.height,
      this.layout.screen.width,
      this.layout.screen.height,
    );
    const background = new Actor({
      pos: vec(
        this.layout.screen.width / 2,
        this.layout.screen.height / 2,
      ),
      anchor: vec(0.5, 0.5),
      z: 0,
    });
    background.graphics.use(image.toSprite());
    background.scale = vec(scale, scale);
    return background;
  }

  private buildCharacter(character: CharacterDialogData): Actor | null {
    if (!character.sprite) {
      return null;
    }
    const image = getCharacterResource(character.sprite);
    if (!image) {
      return null;
    }

    const characterLayout = getCharacterLayout(character.position, this.layout);
    const scale = characterLayout.targetHeight / image.height;
    const actor = new Actor({
      pos: vec(characterLayout.x, characterLayout.feetY),
      anchor: vec(0.5, 1),
      z: 10,
    });
    actor.graphics.use(image.toSprite());
    actor.scale = vec(scale, scale);
    return actor;
  }

  private returnToMap(): void {
    void this.gameEngine.goToScene('map', {
      destinationIn: new FadeInOut({
        duration: 400,
        direction: 'in',
        color: Color.Black,
      }),
      sourceOut: new FadeInOut({
        duration: 300,
        direction: 'out',
        color: Color.Black,
      }),
    });
  }
}
