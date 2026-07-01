/**
 * Save slot panel for DECHO.
 *
 * Main responsibility:
 * - Lists the 3 save slots for Load Game and New Game (with overwrite confirm).
 *
 * Made by: Richie
 */

import * as excalibur from 'excalibur';
import { UiButton } from '../../components/ui/button';
import { drawDivider, drawHudPanel } from '../../components/ui/hud-drawing';
import { mapRenderSize } from '../../core/engine/engine-config';
import { THEME, withAlpha } from '../../core/theme/theme-index';
import * as saveService from '../save/save-service';
import { SAVE_SLOT_COUNT } from '../save/save-types';
import type { SaveSlot, SaveSlotId } from '../save/save-types';

export type SaveSlotPanelMode = 'load' | 'new';

const SCREEN_WIDTH = mapRenderSize.width;
const SCREEN_HEIGHT = mapRenderSize.height;

const CARD_WIDTH = 560;
const CARD_HEIGHT = 420;
const CARD_X = (SCREEN_WIDTH - CARD_WIDTH) / 2;
const CARD_Y = (SCREEN_HEIGHT - CARD_HEIGHT) / 2;
const CENTER_X = CARD_X + CARD_WIDTH / 2;
const INNER_X = CARD_X + 24;

const SLOT_X = CARD_X + 22;
const SLOT_WIDTH = CARD_WIDTH - 44;
const SLOT_HEIGHT = 58;
const SLOT_GAP = 16;
const SLOT_START_Y = CARD_Y + 106;

// The trash button matches the slot row height and sits beside the compact
// slot button used only for filled Load Game slots.
const TRASH_SIZE = SLOT_HEIGHT;
const TRASH_GAP = 8;
const TRASH_X = SLOT_X + SLOT_WIDTH - TRASH_SIZE;
const SLOT_COMPACT_WIDTH = SLOT_WIDTH - TRASH_SIZE - TRASH_GAP;

const BACKDROP_Z = 200;
const BUTTON_Z = 210;
const TRASH_Z = 215;

const MONTHS_ARRAY = [
  'jan', 'feb', 'mrt', 'apr', 'mei', 'jun',
  'jul', 'aug', 'sep', 'okt', 'nov', 'dec',
];

function formatSavedAt(savedAtMs: number): string {
  const date = new Date(savedAtMs);
  const day = date.getDate();
  const month = MONTHS_ARRAY[date.getMonth()] ?? '';
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${hours}:${minutes}`;
}

/** Draws a trash-can icon centred in a button, used as the delete control. */
function drawTrashIcon(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
): void {
  const centerX = width / 2;
  const iconWidth = 16;
  const iconHeight = 18;
  const left = centerX - iconWidth / 2;
  const right = centerX + iconWidth / 2;
  const top = height / 2 - iconHeight / 2 + 2;

  context.strokeStyle = color;
  context.lineWidth = 1.8;
  context.lineJoin = 'round';
  context.lineCap = 'round';

  context.beginPath();
  context.moveTo(left - 3, top);
  context.lineTo(right + 3, top);
  context.stroke();

  context.beginPath();
  context.moveTo(centerX - 4, top);
  context.lineTo(centerX - 4, top - 3);
  context.lineTo(centerX + 4, top - 3);
  context.lineTo(centerX + 4, top);
  context.stroke();

  context.beginPath();
  context.moveTo(left + 1, top + 3);
  context.lineTo(left + 3, top + iconHeight);
  context.lineTo(right - 3, top + iconHeight);
  context.lineTo(right - 1, top + 3);
  context.stroke();

  context.beginPath();
  context.moveTo(centerX - 3.5, top + 6);
  context.lineTo(centerX - 3.5, top + iconHeight - 3);
  context.moveTo(centerX, top + 6);
  context.lineTo(centerX, top + iconHeight - 3);
  context.moveTo(centerX + 3.5, top + 6);
  context.lineTo(centerX + 3.5, top + iconHeight - 3);
  context.stroke();
}

/** 'on' = clickable, 'dimmed' = visible but disabled, 'off' = hidden. */
function setRowState(button: UiButton, state: 'on' | 'dimmed' | 'off'): void {
  if (state === 'on') {
    button.setEnabled(true);
  } else if (state === 'dimmed') {
    button.setEnabled(false, true);
  } else {
    button.setEnabled(false);
  }
}

export class SaveSlotPanel extends excalibur.ScreenElement {
  private mode: SaveSlotPanelMode = 'load';
  private confirmSlotId: SaveSlotId | null = null;
  private confirmKind: 'overwrite' | 'delete' = 'overwrite';
  private isOpen = false;
  private slotsArray: (SaveSlot | null)[] = [];

  private readonly slotFullButtonsArray: UiButton[] = [];
  private readonly slotCompactButtonsArray: UiButton[] = [];
  private readonly trashButtonsArray: UiButton[] = [];
  private readonly backButton: UiButton;
  private readonly confirmYesButton: UiButton;
  private readonly confirmNoButton: UiButton;

  constructor(
    private readonly onEnterGame: (isNewGame: boolean) => void,
    private readonly onClosePanel: () => void,
  ) {
    super({
      x: 0,
      y: 0,
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      z: BACKDROP_Z,
    });

    this.graphics.use(
      new excalibur.Canvas({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        cache: false,
        smoothing: true,
        draw: (context) => this.drawPanel(context),
      }),
    );

    for (let slotIndex = 0; slotIndex < SAVE_SLOT_COUNT; slotIndex += 1) {
      const slotId = slotIndex as SaveSlotId;
      const slotY = SLOT_START_Y + slotIndex * (SLOT_HEIGHT + SLOT_GAP);

      // Full-width row: used in New Game and for empty Load Game slots.
      this.slotFullButtonsArray.push(
        new UiButton({
          text: '',
          x: SLOT_X,
          y: slotY,
          width: SLOT_WIDTH,
          height: SLOT_HEIGHT,
          accent: THEME.accent.cyan,
          z: BUTTON_Z,
          hideArrow: true,
          onClick: () => this.handleSlotClick(slotId),
        }),
      );

      // Compact row: used for filled Load Game slots, leaving room for trash.
      this.slotCompactButtonsArray.push(
        new UiButton({
          text: '',
          x: SLOT_X,
          y: slotY,
          width: SLOT_COMPACT_WIDTH,
          height: SLOT_HEIGHT,
          accent: THEME.accent.cyan,
          z: BUTTON_Z,
          hideArrow: true,
          onClick: () => this.handleSlotClick(slotId),
        }),
      );

      this.trashButtonsArray.push(
        new UiButton({
          text: '',
          x: TRASH_X,
          y: slotY,
          width: TRASH_SIZE,
          height: TRASH_SIZE,
          accent: THEME.accent.red,
          variant: 'secondary',
          z: TRASH_Z,
          renderIcon: drawTrashIcon,
          onClick: () => this.handleTrashClick(slotId),
        }),
      );
    }

    this.backButton = new UiButton({
      text: 'Terug',
      x: CENTER_X - 100,
      y: CARD_Y + 336,
      width: 200,
      height: 46,
      accent: THEME.accent.violet,
      variant: 'secondary',
      z: BUTTON_Z,
      onClick: () => this.onClosePanel(),
    });

    this.confirmYesButton = new UiButton({
      text: 'Overschrijven',
      x: INNER_X,
      y: CARD_Y + 250,
      width: 240,
      height: 52,
      accent: THEME.accent.red,
      z: BUTTON_Z,
      onClick: () => this.handleConfirmYes(),
    });

    this.confirmNoButton = new UiButton({
      text: 'Annuleren',
      x: CARD_X + CARD_WIDTH - 24 - 240,
      y: CARD_Y + 250,
      width: 240,
      height: 52,
      accent: THEME.accent.violet,
      variant: 'secondary',
      z: BUTTON_Z,
      onClick: () => this.handleConfirmNo(),
    });
  }

  override onInitialize(): void {
    this.addChild(this.backButton);
    this.addChild(this.confirmYesButton);
    this.addChild(this.confirmNoButton);
    this.slotFullButtonsArray.forEach((button) => this.addChild(button));
    this.slotCompactButtonsArray.forEach((button) => this.addChild(button));
    this.trashButtonsArray.forEach((button) => this.addChild(button));

    this.on('pointerup', (event) => {
      if (this.isOpen) {
        event.cancel();
      }
    });
    this.on('pointerdown', (event) => {
      if (this.isOpen) {
        event.cancel();
      }
    });

    this.close();
  }

  open(mode: SaveSlotPanelMode): void {
    this.mode = mode;
    this.confirmSlotId = null;
    this.slotsArray = saveService.listSlots();
    this.isOpen = true;
    this.graphics.isVisible = true;
    this.pointer.useGraphicsBounds = true;
    this.refreshButtons();
  }

  close(): void {
    this.isOpen = false;
    this.confirmSlotId = null;
    this.graphics.isVisible = false;
    this.pointer.useGraphicsBounds = false;
    this.slotFullButtonsArray.forEach((button) => button.setEnabled(false));
    this.slotCompactButtonsArray.forEach((button) => button.setEnabled(false));
    this.trashButtonsArray.forEach((button) => button.setEnabled(false));
    this.backButton.setEnabled(false);
    this.confirmYesButton.setEnabled(false);
    this.confirmNoButton.setEnabled(false);
  }

  private handleSlotClick(slotId: SaveSlotId): void {
    // Read fresh state so the action is correct even if storage changed
    // since the panel opened (e.g. another browser tab).
    const slot = saveService.listSlots()[slotId] ?? null;

    if (this.mode === 'load') {
      if (slot && saveService.loadSlot(slotId)) {
        this.onEnterGame(false);
      }
      return;
    }

    if (slot) {
      this.confirmSlotId = slotId;
      this.confirmKind = 'overwrite';
      this.refreshButtons();
      return;
    }

    saveService.startNewGameInSlot(slotId);
    this.onEnterGame(true);
  }

  private handleTrashClick(slotId: SaveSlotId): void {
    // Only filled slots show a trash button, but re-check fresh state anyway.
    if (!saveService.listSlots()[slotId]) {
      return;
    }

    this.confirmSlotId = slotId;
    this.confirmKind = 'delete';
    this.refreshButtons();
  }

  private handleConfirmYes(): void {
    if (this.confirmSlotId === null) {
      return;
    }

    if (this.confirmKind === 'delete') {
      saveService.deleteSlot(this.confirmSlotId);
      this.confirmSlotId = null;
      this.slotsArray = saveService.listSlots();
      this.refreshButtons();
      return;
    }

    saveService.startNewGameInSlot(this.confirmSlotId);
    this.onEnterGame(true);
  }

  private handleConfirmNo(): void {
    this.confirmSlotId = null;
    this.refreshButtons();
  }

  private refreshButtons(): void {
    const isConfirming = this.confirmSlotId !== null;

    for (let slotIndex = 0; slotIndex < SAVE_SLOT_COUNT; slotIndex += 1) {
      const slot = this.slotsArray[slotIndex] ?? null;
      const fullButton = this.slotFullButtonsArray[slotIndex];
      const compactButton = this.slotCompactButtonsArray[slotIndex];
      const trashButton = this.trashButtonsArray[slotIndex];
      const label = this.formatSlotLabel(slotIndex, slot);
      fullButton.setText(label);
      compactButton.setText(label);

      if (isConfirming) {
        setRowState(fullButton, 'off');
        setRowState(compactButton, 'off');
        setRowState(trashButton, 'off');
      } else if (this.mode === 'new') {
        // New Game: every slot is a full-width clickable row, no trash.
        setRowState(fullButton, 'on');
        setRowState(compactButton, 'off');
        setRowState(trashButton, 'off');
      } else if (slot !== null) {
        // Filled Load slot: compact row + full-height trash button beside it.
        setRowState(fullButton, 'off');
        setRowState(compactButton, 'on');
        setRowState(trashButton, 'on');
      } else {
        // Empty Load slot: full-width, dimmed, no trash.
        setRowState(fullButton, 'dimmed');
        setRowState(compactButton, 'off');
        setRowState(trashButton, 'off');
      }
    }

    if (isConfirming) {
      this.confirmYesButton.setText(
        this.confirmKind === 'delete' ? 'Verwijderen' : 'Overschrijven',
      );
    }

    this.backButton.setEnabled(!isConfirming);
    this.confirmYesButton.setEnabled(isConfirming);
    this.confirmNoButton.setEnabled(isConfirming);
  }

  private formatSlotLabel(slotIndex: number, slot: SaveSlot | null): string {
    const slotName = `Opslag ${slotIndex + 1}`;
    if (!slot) {
      return `${slotName} · Leeg`;
    }

    return `${slotName} · ${slot.label} · ${formatSavedAt(slot.savedAtMs)}`;
  }

  private drawPanel(context: CanvasRenderingContext2D): void {
    context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    context.fillStyle = withAlpha(THEME.color.bg, 0.78);
    context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    context.save();
    context.translate(CARD_X, CARD_Y);
    drawHudPanel(context, CARD_WIDTH, CARD_HEIGHT, THEME.accent.cyan);

    context.textAlign = 'center';
    context.textBaseline = 'alphabetic';
    context.fillStyle = THEME.accent.cyan;
    context.font = `900 30px ${THEME.font.heading}`;
    context.fillText(
      this.mode === 'new' ? 'NIEUW SPEL' : 'SPEL LADEN',
      CARD_WIDTH / 2,
      58,
    );

    const isDeleteConfirm =
      this.confirmSlotId !== null && this.confirmKind === 'delete';
    const isConfirming = this.confirmSlotId !== null;

    context.fillStyle = THEME.color.muted;
    context.font = `700 13px ${THEME.font.label}`;
    context.fillText(
      isConfirming
        ? isDeleteConfirm
          ? 'VERWIJDEREN BEVESTIGEN'
          : 'OVERSCHRIJVEN BEVESTIGEN'
        : 'KIES EEN OPSLAGPLAATS',
      CARD_WIDTH / 2,
      82,
    );

    drawDivider(context, 24, 98, CARD_WIDTH - 48);
    context.restore();

    if (this.confirmSlotId !== null) {
      context.textAlign = 'center';
      context.fillStyle = THEME.color.text;
      context.font = `800 22px ${THEME.font.heading}`;
      context.fillText(
        `${isDeleteConfirm ? 'VERWIJDER' : 'OVERSCHRIJF'} OPSLAG ${this.confirmSlotId + 1}?`,
        CENTER_X,
        CARD_Y + 168,
      );

      context.fillStyle = THEME.color.softText;
      context.font = `400 14px ${THEME.font.body}`;
      context.fillText(
        isDeleteConfirm
          ? 'Hiermee wordt deze opslag definitief verwijderd.'
          : 'Hiermee start een nieuw spel en verdwijnt deze opslag.',
        CENTER_X,
        CARD_Y + 200,
      );
    }
  }
}
