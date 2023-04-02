import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Notebook } from "./types";
import { notebooks } from "./mock-data";

interface NotebooksState {
  notebooks: Notebook[];
  updateNotebook: (updatedNotebook: Notebook) => void;
  addNotebook: (newNotebook: Notebook) => void;
}

export const useNotebooksStore = create<NotebooksState>()(
  immer((set) => ({
    notebooks,
    updateNotebook(updatedNotebook) {},
    addNotebook(newNotebook) {
      set((s) => {
        s.notebooks.unshift(newNotebook);
      });
    },
  }))
);
