const { contextBridge, ipcRenderer } = require("electron");

// Expose a safe API to the renderer process
contextBridge.exposeInMainWorld("electron", {
  saveJournal: (content) => ipcRenderer.invoke("save-journal", content),
  showPrompt: () => ipcRenderer.invoke("show-prompt"),
});
