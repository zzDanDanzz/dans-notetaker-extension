import { Notebook } from "../types";

export async function getNotebooksFromStorage(): Promise<
  Notebook[] | undefined
> {
  if (import.meta.env.DEV) {
    let result = localStorage.getItem("notebooks");
    if (!result) {
      return undefined;
    }
    return JSON.parse(result);
  }

  let result = (await chrome.storage.local.get(["notebooks"])).notebooks;
  return result;
}

export function writeDataToStorage(data: Notebook[]) {
  if (import.meta.env.DEV) {
    let result = localStorage.setItem("notebooks", JSON.stringify(data));
    return result;
  }
  let result = chrome.storage.local.set({ notebooks: data });
  return result;
}
