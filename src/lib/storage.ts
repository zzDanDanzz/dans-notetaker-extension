import { Notebook } from "../types";
import { isDevMode } from "./is-dev-mode";
import { timestampSortFn } from "./sort";

const NOTEBOOKS_STORAGE_KEY = "notebooks";
const SEPERATOR_STORAGE_KEY = "seperator";

/** general helper functions */
export async function getDataFromStorage<T>(
  key: string
): Promise<T | undefined> {
  if (isDevMode()) {
    let result = localStorage.getItem(key);
    if (!result) {
      return undefined;
    }
    return JSON.parse(result);
  }

  return (await chrome.storage.local.get([key]))?.[key];
}

export function writeDataToStorage(key: string, value: unknown) {
  if (isDevMode()) {
    return localStorage.setItem(key, JSON.stringify(value));
  }
  return chrome.storage.local.set({ [key]: value });
}

export function removeDataFromStorage(key: string) {
  if (isDevMode()) {
    localStorage.removeItem(key);
  } else {
    chrome.storage.local.remove(key);
  }
}

/** notebook helper functions */
export function writeNotebooksToStorage(data: Notebook[]) {
  writeDataToStorage(NOTEBOOKS_STORAGE_KEY, data);
}

export function removeNotebooksFromStorage() {
  removeDataFromStorage(NOTEBOOKS_STORAGE_KEY);
}

export async function getSortedNotebooksFromStorage(): Promise<
  Notebook[] | undefined
> {
  return (await getDataFromStorage<Notebook[]>(NOTEBOOKS_STORAGE_KEY))?.sort(
    timestampSortFn
  );
}

/** seperator helper functions */
export async function getSeperatorFromStorage() {
  return (await getDataFromStorage<string>(SEPERATOR_STORAGE_KEY)) ?? "";
}

export function writeSeperatorToStorage(data: string) {
  writeDataToStorage(SEPERATOR_STORAGE_KEY, data);
}

export function removeSeperatorFromStorage() {
  removeDataFromStorage(SEPERATOR_STORAGE_KEY);
}
