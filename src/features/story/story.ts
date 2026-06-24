import * as backup from "./snippets/backup/backup-index";
import * as dialog from "./snippets/dialog/dialog-index";
import * as location from "./snippets/location/location-index";
import * as npc from "./snippets/npc/npc-index";
import * as qte from "./snippets/qte/qte-index";
import * as save from "./snippets/save/save-index";
import * as storage from "./snippets/storage/storage-index";
import { storyData } from "./story-data";

export const story = {
    data: storyData,

    storage: {
        get<T = unknown>(key: string) {
            return storage.get<T>(key);
        },

        set(key: string, value: unknown) {
            return storage.set(key, value);
        },

        remove(key: string) {
            return storage.remove(key);
        },

        exists(key: string) {
            return storage.exists(key);
        },

        clearStoryStorage() {
            return storage.clearStoryStorage();
        }
    },

    save: {
        create(data: unknown) {
            return save.create(data);
        },

        load(id: string) {
            return save.load(id);
        },

        overwrite(id: string, data: unknown) {
            return save.overwrite(id, data);
        },

        update(id: string, data: unknown) {
            return save.update(id, data);
        },

        delete(id: string) {
            return save.delete(id);
        },

        list() {
            return save.list();
        }
    },

    backup: {
        create(saveId: string) {
            return backup.create(saveId);
        },

        load(id: string) {
            return backup.load(id);
        },

        overwrite(id: string, data: unknown) {
            return backup.overwrite(id, data);
        },

        update(id: string, data: unknown) {
            return backup.update(id, data);
        },

        delete(id: string) {
            return backup.delete(id);
        },

        list() {
            return backup.list();
        }
    },

    location: {
        get(locationId: string | null | undefined) {
            return location.get(locationId);
        },

        hasNpc(locationId: string | null | undefined) {
            return location.hasNpc(locationId);
        },

        getNpcs(locationId: string | null | undefined) {
            return location.getNpcs(locationId);
        },

        getEvents(locationId: string | null | undefined) {
            return location.getEvents(locationId);
        }
    },

    npc: {
        get(npcId: string | null | undefined) {
            return npc.get(npcId);
        },

        getDialog(npcId: string | null | undefined) {
            return npc.getDialog(npcId);
        }
    },

    dialog: {
        get(dialogId: string | null | undefined) {
            return dialog.get(dialogId);
        }
    },

    qte: {
        get(qteId: string | null | undefined) {
            return qte.get(qteId);
        },

        trigger(qteId: string | null | undefined) {
            return qte.trigger(qteId);
        }
    }
};
