import { Notebook } from "../types";
import { timestampSortFn } from "../lib/sort";

const getNotebooksFromStorage = async () => {
  const notebooks = (await chrome.storage.local.get(["notebooks"])).notebooks;
  if (!notebooks) return null;
  (notebooks as Notebook[]).sort(timestampSortFn);
  return notebooks;
};

const writeDataToStorage = (data: Notebook[]) =>
  chrome.storage.local.set({ notebooks: data });

const createMenuItem = (id: string, title: string) =>
  chrome.contextMenus.create({
    id,
    title: `Add to: "${title}"`,
    type: "normal",
    contexts: ["selection"],
  });

const initiallizeMenuOnFirstInstall = async () => {
  // Add a listener to create the initial context menu items,
  // context menu items only need to be created at runtime.onInstalled
  let notebooks: Notebook[] = await getNotebooksFromStorage();
  if (!notebooks) return;
  chrome.runtime.onInstalled.addListener(() => {
    for (const { id, title } of notebooks) {
      createMenuItem(id, title);
    }
  });
};

const refreshContextMenu = async () => {
  chrome.contextMenus.removeAll();
  let notebooks: Notebook[] = await getNotebooksFromStorage();
  for (const { id, title } of notebooks) {
    createMenuItem(id, title);
  }
};

const addClickListenersToItems = () => {
  chrome.contextMenus.onClicked.addListener(async (item) => {
    const id = item.menuItemId;
    let textToAdd = item.selectionText;
    let notebooks: Notebook[] = await getNotebooksFromStorage();
    let updatedNotebooks = notebooks.map((n) => {
      if (n.id === id) {
        return {
          ...n,
          content: `${n.content} ${textToAdd}`,
          timestamps: { created: n.timestamps.created, updated: Date.now() },
        };
      }
      return n;
    });

    writeDataToStorage(updatedNotebooks);
  });
};

const main = () => {
  initiallizeMenuOnFirstInstall();
  addClickListenersToItems();

  // refresh context menu when the user updates storage
  chrome.storage.onChanged.addListener(({ notebooks }) => {
    const currNotebooks: Notebook[] = notebooks.newValue;
    const prevNotebooks: Notebook[] | undefined = notebooks.oldValue;

    let isFirstStorageChange = !prevNotebooks && currNotebooks?.length >= 1;

    if (isFirstStorageChange || (prevNotebooks && currNotebooks)) {
      refreshContextMenu();
    }
  });
};

main();
