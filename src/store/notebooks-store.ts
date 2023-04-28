import { create } from "zustand";
import { Notebook } from "../types";
import {
  writeDataToStorage,
  getNotebooksFromStorage,
  removeFromStorage,
} from "../lib/storage";
import { v4 as uuid } from "uuid";
import { timestampSortFn } from "../lib/sort";

type Create = Omit<Notebook, "id" | "timestamps">;
type Update = Omit<Notebook, "timestamps">;

interface NotebooksState {
  notebooks: Notebook[];

  updateNotebook: (nb: Update) => Promise<void>;
  addNotebook: (nb: Create) => Promise<void>;
  retrieveNotebooks: () => Promise<void>;
  deleteNotebook: (id: Notebook["id"]) => Promise<void>;
  deleteEverything: () => Promise<void>;
}

export const useNotebooksStore = create<NotebooksState>()((set, get) => ({
  notebooks: [],

  async updateNotebook({ title, content, id }) {
    let currentState = get();
    let indexOfUpdated = currentState.notebooks.findIndex((n) => n.id === id);

    if (indexOfUpdated === -1) {
      throw new Error("The notebook you tried to update was not found");
    }

    let updatedNotesbooks = currentState.notebooks.map((n) =>
      n.id === id
        ? {
            id: n.id,
            title,
            content,
            timestamps: {
              created: n.timestamps.created,
              updated: Date.now(),
            },
          }
        : n
    );

    await writeDataToStorage(updatedNotesbooks);

    set({ ...currentState, notebooks: updatedNotesbooks });
  },

  async addNotebook({ title, content }) {
    let currentState = get();

    let id = uuid();
    let now = Date.now();

    let newNotebook = {
      id,
      title,
      content,
      timestamps: {
        created: now,
        updated: now,
      },
    };

    let updatedNotesbooks = [newNotebook, ...currentState.notebooks];
    await writeDataToStorage(updatedNotesbooks);

    set({ ...currentState, notebooks: updatedNotesbooks });
  },

  async retrieveNotebooks() {
    let result = await getNotebooksFromStorage();

    if (!result) return;

    result.sort(timestampSortFn);

    set((prev) => ({ ...prev, notebooks: result }));
  },

  async deleteNotebook(id) {
    let currentState = get();
    let updatedNotesbooks = currentState.notebooks.filter((n) => n.id !== id);
    await writeDataToStorage(updatedNotesbooks);

    set({ ...currentState, notebooks: updatedNotesbooks });
  },

  async deleteEverything() {
    let currentState = get();
    removeFromStorage();
    set({ ...currentState, notebooks: [] });
  },
}));
