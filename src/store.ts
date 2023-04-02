import { create } from "zustand";
import { Notebook } from "./types";
import { notebooks } from "./mock-data";

interface NotebooksState {
  notebooks: Notebook[];

  updateNotebook: (id: Notebook["id"], newData: Omit<Notebook, "id">) => void;
  addNotebook: (newNotebook: Notebook) => void;
}

export const useNotebooksStore = create<NotebooksState>()((set) => ({
  notebooks,
  updateNotebook(id, { title, content }) {
    set((s) => {
      let indexOfUpdated = s.notebooks.findIndex((n) => n.id === id);

      if (indexOfUpdated === -1) {
        throw new Error("The notebook you tried to update was not found");
      }

      return {
        ...s,
        notebooks: s.notebooks.map((n) =>
          n.id === id ? { id: n.id, title, content } : n
        ),
      };
    });
  },
  addNotebook(newNotebook) {
    set((s) => {
      return { ...s, notebooks: [newNotebook, ...s.notebooks] };
    });
  },
}));
