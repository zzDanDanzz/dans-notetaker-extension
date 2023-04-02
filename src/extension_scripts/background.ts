// Add a listener to create the initial context menu items,
// context menu items only need to be created at runtime.onInstalled
chrome.runtime.onInstalled.addListener(async () => {
  [1, 2, 3].forEach((n) =>
    chrome.contextMenus.create({
      id: n.toString(),
      title: n.toString(),
      type: "normal",
      contexts: ["selection"],
    })
  );
});
