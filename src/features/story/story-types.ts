export type StoryResponse<T> = {
    success: boolean;
    message: string;
    received: unknown;
    returningData: T;
};

export type SaveData = {
    id: string;
    createdAt: string;
    updatedAt: string;
    data: unknown;
};

export type BackupData = {
    id: string;
    saveId: string;
    createdAt: string;
    updatedAt: string;
    data: unknown;
};

export type StoryData = {
    locations: Record<string, StoryLocation>;
    npcs: Record<string, StoryNpc>;
    dialogs: Record<string, Dialog>;
    quickTimeEvents: Record<string, QuickTimeEvent>;
};

export type StoryLocation = {
    id: string;
    name: string;
    description: string;
    npcIds?: string[];
    eventIds?: string[];
    connections: string[];
};

export type StoryNpc = {
    id: string;
    name: string;
    defaultDialogId: string;
};

export type Dialog = {
    id: string;
    text: string;
    options: DialogOption[];
};

export type DialogOption = {
    label: string;
    nextDialogId?: string;
    effects?: StoryEffect[];
};

export type QuickTimeEvent = {
    id: string;
    type: "combat" | "lockpick" | "infiltration" | "escape" | "hack";
    title: string;
    description: string;
    successText: string;
    failText: string;
    successEffects?: StoryEffect[];
    failEffects?: StoryEffect[];
};

export type StoryEffect =
    | {
          type: "setFlag";
          key: string;
          value: boolean | string | number;
      }
    | {
          type: "changeTrust";
          npcId: string;
          amount: number;
      }
    | {
          type: "startQte";
          qteId: string;
      }
    | {
          type: "unlockLocation";
          locationId: string;
      };
