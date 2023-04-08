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
  // when the user updates storage
  chrome.storage.onChanged.addListener(({ notebooks }) => {
    const currNotebooks: Notebook[] = notebooks.newValue;
    const prevNotebooks: Notebook[] = notebooks.oldValue;

    const addNewNotebookToMenu = () => {
      // currNotebooks[0] because I always add them to the beginning of the notebooks array
      let { id, title } = currNotebooks[0];
      createMenuItem(id, title);
    };

    // it's the first storage change for the extension
    if (!prevNotebooks && currNotebooks?.length >= 1) {
      addNewNotebookToMenu();
      return;
    }

    // if notebook was added
    if (currNotebooks.length > prevNotebooks.length) {
      addNewNotebookToMenu();
      return;
    }

    // if notebook was removed
    if (currNotebooks.length < prevNotebooks.length) {
      const deletedNotebook = findMissingNotebook({
        previous: prevNotebooks,
        current: currNotebooks,
      });
      deletedNotebook && chrome.contextMenus.remove(deletedNotebook.id);
    }
  });
};

const findMissingNotebook = ({
  previous,
  current,
}: {
  previous: Notebook[];
  current: Notebook[];
}) => {
  for (const notebook of previous) {
    let isTheMissingNotebook = !current.some(
      (currNotebook) => currNotebook.id === notebook.id
    );
    if (isTheMissingNotebook) {
      return notebook;
    }
  }
};

main();
