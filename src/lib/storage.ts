import { Notebook } from "../types";

const STORAGE_KEY = "notebooks";

export async function getNotebooksFromStorage(): Promise<
  Notebook[] | undefined
> {
  if (import.meta.env.DEV) {
    let result = localStorage.getItem(STORAGE_KEY);
    if (!result) {
      return undefined;
    }
    return JSON.parse(result);
  }

  let result = (await chrome.storage.local.get([STORAGE_KEY])).notebooks;
  return result;
}

export function writeDataToStorage(data: Notebook[]) {
  if (import.meta.env.DEV) {
    let result = localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return result;
  }
  let result = chrome.storage.local.set({ notebooks: data });
  return result;
}

export function removeFromStorage() {
  if (import.meta.env.DEV) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    chrome.storage.local.remove(STORAGE_KEY);
  }
}
