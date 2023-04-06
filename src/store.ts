import { create } from "zustand";
import { Notebook } from "./types";
import { notebooks as mockNotebooks } from "./mock-data";
import {
  writeDataToStorage,
  getNotebooksFromStorage,
  writeMockDataToStorage,
} from "./lib/storage";

interface NotebooksState {
  notebooks: Notebook[];

  updateNotebook: (
    id: Notebook["id"],
    newData: Omit<Notebook, "id">
  ) => Promise<void>;
  addNotebook: (newNotebook: Notebook) => Promise<void>;
  retrieveNotebooks: () => Promise<void>;
  deleteNotebook: (id: Notebook["id"]) => Promise<void>;
}

export const useNotebooksStore = create<NotebooksState>()((set, get) => ({
  notebooks: [],

  async updateNotebook(id, { title, content }) {
    let currentState = get();
    let indexOfUpdated = currentState.notebooks.findIndex((n) => n.id === id);

    if (indexOfUpdated === -1) {
      throw new Error("The notebook you tried to update was not found");
    }

    let updatedNotesbooks = currentState.notebooks.map((n) =>
      n.id === id ? { id: n.id, title, content } : n
    );

    await writeDataToStorage(updatedNotesbooks);

    set({ ...currentState, notebooks: updatedNotesbooks });
  },

  async addNotebook(newNotebook) {
    let currentState = get();
    let updatedNotesbooks = [newNotebook, ...currentState.notebooks];
    await writeDataToStorage(updatedNotesbooks);

    set({ ...currentState, notebooks: updatedNotesbooks });
  },

  async retrieveNotebooks() {
    let result = await getNotebooksFromStorage();

    if (!result) {
      await writeMockDataToStorage();
      return set((prev) => ({ ...prev, notebooks: mockNotebooks }));
    }

    set((prev) => ({ ...prev, notebooks: result }));
  },

  async deleteNotebook(id) {
    let currentState = get();
    let updatedNotesbooks = currentState.notebooks.filter((n) => n.id !== id);
    await writeDataToStorage(updatedNotesbooks);

    set({ ...currentState, notebooks: updatedNotesbooks });
  },
}));
