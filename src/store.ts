import { create } from "zustand";
import { Notebook } from "./types";
import { notebooks as mockNotebooks } from "./mock-data";

interface NotebooksState {
  notebooks: Notebook[];

  updateNotebook: (id: Notebook["id"], newData: Omit<Notebook, "id">) => void;
  addNotebook: (newNotebook: Notebook) => void;
  retrieveNotebooks: () => Promise<void>;
}

export const useNotebooksStore = create<NotebooksState>()((set) => ({
  notebooks: [],
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
  async retrieveNotebooks() {
    let result = await getNotebooksFromStorage();
    if (!result) {
      await writeNotebooksToStorage();
      set((prev) => ({ ...prev, notebooks: mockNotebooks }));
    }

    set((prev) => ({ ...prev, notebooks: result }));
  },
}));

async function getNotebooksFromStorage(): Promise<Notebook[] | undefined> {
  if (import.meta.env.DEV) {
    let result = localStorage.getItem("notebooks");
    console.log("🚀 getNotebooksFromStorage : from localStorage", result);
    if (!result) {
      return undefined;
    }
    return JSON.parse(result);
  }

  let result = (await chrome.storage.local.get(["notebooks"])).notebooks;
  console.log("🚀 getNotebooksFromStorage : from chrome storage", result);

  return result;
}

function writeNotebooksToStorage() {
  if (import.meta.env.DEV) {
    let result = localStorage.setItem(
      "notebooks",
      JSON.stringify(mockNotebooks)
    );
    return result;
  }
  let result = chrome.storage.local.set({ notebooks: mockNotebooks });
  return result;
}
