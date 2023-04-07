import { Notebook } from "../types";

const getNotebooksFromStorage = async () =>
  (await chrome.storage.local.get(["notebooks"])).notebooks;

const writeDataToStorage = (data: Notebook[]) =>
  chrome.storage.local.set({ notebooks: data });

const createMenuItem = (id: string, title: string) =>
  chrome.contextMenus.create({
    id,
    title: `Add to: "${title}"`,
    type: "normal",
    contexts: ["selection"],
  });

const initiallizeMenuOnFirstInstall = () => {
  // Add a listener to create the initial context menu items,
  // context menu items only need to be created at runtime.onInstalled
  chrome.runtime.onInstalled.addListener(async () => {
    let notebooks: Notebook[] = await getNotebooksFromStorage();
    for (const { id, title } of notebooks) {
      createMenuItem(id, title);
    }
  });
};

const addClickListenersToItems = () => {
  chrome.contextMenus.onClicked.addListener(async (item) => {
    const id = item.menuItemId;
    let textToAdd = item.selectionText;
    let notebooks: Notebook[] = await getNotebooksFromStorage();
    let updatedNotebooks = notebooks.map((n) => {
      if (n.id === id) {
        return { ...n, content: `${n.content} ${textToAdd}` };
      }
      return n;
    });

    writeDataToStorage(updatedNotebooks);
  });
};

const main = () => {
  initiallizeMenuOnFirstInstall();
  addClickListenersToItems();

  // Add or removes the notebook title from context menu
  // when the user updates notebooks
  chrome.storage.onChanged.addListener(({ notebooks }) => {
    const currNotebooks: Notebook[] = notebooks.newValue;
    const prevNotebooks: Notebook[] = notebooks.oldValue ?? notebooks.newValue;
    let notebookWasAdded = currNotebooks.length > prevNotebooks.length;
    let notebookWasRemoved = currNotebooks.length < prevNotebooks.length;
    if (notebookWasAdded) {
      let { id, title } = currNotebooks[0];
      createMenuItem(id, title);
      return;
    }
    if (notebookWasRemoved) {
      for (const nb of prevNotebooks) {
        const deletedNotebook = currNotebooks.find((currNb) => {
          const notebookStillExists = nb.id === currNb.id;
          if (notebookStillExists) {
            return false
          } else {
            return true
          }

        });
        if (deletedNotebook) {
          return chrome.contextMenus.remove(deletedNotebook.id);
        }
      }
    }
  });
};

main();
