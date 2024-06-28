import { Notebook } from "../types";
import {
  getSeperatorFromStorage,
  getSortedNotebooksFromStorage,
  writeNotebooksToStorage,
} from "../lib/storage";

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
  let notebooks: Notebook[] | undefined = await getSortedNotebooksFromStorage();

  chrome.runtime.onInstalled.addListener(() => {
    if (!notebooks) return;
    for (const { id, title } of notebooks) {
      createMenuItem(id, title);
    }
  });
};

const refreshContextMenu = async () => {
  chrome.contextMenus.removeAll(async () => {
    let notebooks: Notebook[] | undefined =
      await getSortedNotebooksFromStorage();
    if (!notebooks) return;
    for (const { id, title } of notebooks) {
      createMenuItem(id, title);
    }
  });
};

const addClickListenersToItems = () => {
  chrome.contextMenus.onClicked.addListener(async (item) => {
    const id = item.menuItemId;
    let textToAdd = item.selectionText;
    let notebooks: Notebook[] | undefined =
      await getSortedNotebooksFromStorage();

    const seperatorStr = await getSeperatorFromStorage();

    let updatedNotebooks = notebooks?.map((n) => {
      if (n.id === id) {
        return {
          ...n,
          content: `${n.content}${seperatorStr}${textToAdd}`,
          timestamps: { created: n.timestamps.created, updated: Date.now() },
        };
      }
      return n;
    });

    updatedNotebooks && writeNotebooksToStorage(updatedNotebooks);
  });
};

const main = () => {
  initiallizeMenuOnFirstInstall();
  addClickListenersToItems();

  // refresh context menu when the user updates storage
  chrome.storage.onChanged.addListener(refreshContextMenu);
};

main();
