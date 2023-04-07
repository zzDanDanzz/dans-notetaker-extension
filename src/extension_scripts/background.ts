import { Notebook } from "../types";

const getNotebooksFromStorage = async () =>
  (await chrome.storage.local.get(["notebooks"])).notebooks;

const main = () => {
  // Add a listener to create the initial context menu items,
  // context menu items only need to be created at runtime.onInstalled
  chrome.runtime.onInstalled.addListener(async () => {
    let notebooks: Notebook[] = await getNotebooksFromStorage();
    for (const notebook of notebooks) {
      chrome.contextMenus.create({
        id: notebook.id,
        title: notebook.title,
        type: "normal",
        contexts: ["selection"],
      });
    }
  });
};

main();
