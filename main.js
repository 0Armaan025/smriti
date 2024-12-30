const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Correctly reference preload.js
      contextIsolation: true, // Enable context isolation for security
      nodeIntegration: false, // Disable node integration (security reason)
    },
  });

  mainWindow.loadFile("index.html");

  // Handle saving journal in the main process
  ipcMain.handle("save-journal", async (event, content) => {
    try {
      // Convert the content to markdown or just save the raw HTML
      const markdownContent = convertToMarkdown(content); // Assuming you have a function to convert HTML to Markdown

      const userDocumentsPath = app.getPath("documents"); // Get the user's Documents folder

      const filePath = path.join(userDocumentsPath, "journal.md");
      fs.writeFileSync(filePath, markdownContent, "utf-8");
      console.log("Journal saved successfully!");
      return "Journal saved successfully!";
    } catch (error) {
      console.error("Error saving journal:", error);
      return `Error: ${error.message}`;
    }
  });

  // Function to convert HTML to markdown (basic conversion)
  function convertToMarkdown(htmlContent) {
    // For simplicity, just remove some basic HTML tags (use a library like 'turndown' for better conversion)
    let markdown = htmlContent.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
    return markdown;
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
