import { app, ipcMain, dialog, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path$1 from "node:path";
import fs from "node:fs/promises";
import Database from "better-sqlite3";
import path from "path";
let db;
function initDb() {
  const dbPath = path.join(app.getPath("userData"), "notebook-lm.db");
  db = new Database(dbPath);
  db.exec(`
        CREATE TABLE IF NOT EXISTS notebooks (
            id TEXT PRIMARY KEY,
            name TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS sources (
            id TEXT PRIMARY KEY,
            notebook_id TEXT,
            name TEXT,
            type TEXT,
            content TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (notebook_id) REFERENCES notebooks(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            notebook_id TEXT,
            role TEXT,
            content TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (notebook_id) REFERENCES notebooks(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        );
    `);
  db.pragma("foreign_keys = ON");
}
function getAllNotebooks() {
  return db.prepare("SELECT * FROM notebooks ORDER BY created_at DESC").all();
}
function createNotebook(id, name) {
  return db.prepare("INSERT INTO notebooks (id, name) VALUES (?, ?)").run(id, name);
}
function updateNotebookName(id, name) {
  return db.prepare("UPDATE notebooks SET name = ? WHERE id = ?").run(name, id);
}
function deleteNotebook(id) {
  return db.prepare("DELETE FROM notebooks WHERE id = ?").run(id);
}
function getSourcesForNotebook(notebookId) {
  return db.prepare("SELECT * FROM sources WHERE notebook_id = ? ORDER BY created_at ASC").all(notebookId);
}
function saveSource(source, notebookId) {
  return db.prepare(`
        INSERT OR REPLACE INTO sources (id, notebook_id, name, type, content)
        VALUES (?, ?, ?, ?, ?)
    `).run(source.id, notebookId, source.name, source.type, source.content);
}
function deleteSource(id) {
  return db.prepare("DELETE FROM sources WHERE id = ?").run(id);
}
function getMessagesForNotebook(notebookId) {
  return db.prepare("SELECT role, content FROM messages WHERE notebook_id = ? ORDER BY id ASC").all(notebookId);
}
function saveMessage(notebookId, role, content) {
  return db.prepare("INSERT INTO messages (notebook_id, role, content) VALUES (?, ?, ?)").run(notebookId, role, content);
}
function clearMessages(notebookId) {
  return db.prepare("DELETE FROM messages WHERE notebook_id = ?").run(notebookId);
}
function saveSetting(key, value) {
  return db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(key, value);
}
function getAllSettings() {
  return db.prepare("SELECT * FROM settings").all();
}
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path$1.dirname(__filename$1);
process.env.APP_ROOT = path$1.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path$1.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path$1.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path$1.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path$1.join(process.env.VITE_PUBLIC || "", "electron-vite.svg"),
    webPreferences: {
      preload: path$1.join(__dirname$1, "preload.mjs")
    },
    width: 1200,
    height: 800,
    titleBarStyle: "hiddenInset",
    backgroundColor: "#ffffff"
  });
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path$1.join(RENDERER_DIST, "index.html"));
  }
}
initDb();
ipcMain.handle("db:get-notebooks", async () => {
  return getAllNotebooks();
});
ipcMain.handle("db:create-notebook", async (_, id, name) => {
  return createNotebook(id, name);
});
ipcMain.handle("db:update-notebook-name", async (_, id, name) => {
  return updateNotebookName(id, name);
});
ipcMain.handle("db:delete-notebook", async (_, id) => {
  return deleteNotebook(id);
});
ipcMain.handle("db:get-sources", async (_, notebookId) => {
  return getSourcesForNotebook(notebookId);
});
ipcMain.handle("db:save-source", async (_, source, notebookId) => {
  return saveSource(source, notebookId);
});
ipcMain.handle("db:delete-source", async (_, id) => {
  return deleteSource(id);
});
ipcMain.handle("db:get-messages", async (_, notebookId) => {
  return getMessagesForNotebook(notebookId);
});
ipcMain.handle("db:save-message", async (_, notebookId, role, content) => {
  return saveMessage(notebookId, role, content);
});
ipcMain.handle("db:clear-messages", async (_, notebookId) => {
  return clearMessages(notebookId);
});
ipcMain.handle("db:save-setting", async (_, key, value) => {
  return saveSetting(key, value);
});
ipcMain.handle("db:get-settings", async () => {
  return getAllSettings();
});
ipcMain.handle("select-files", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile", "multiSelections"],
    filters: [
      { name: "Documents", extensions: ["txt", "md", "pdf"] }
    ]
  });
  if (result.canceled) return [];
  const files = [];
  for (const filePath of result.filePaths) {
    const stats = await fs.stat(filePath);
    const fileName = path$1.basename(filePath);
    const extension = path$1.extname(filePath).toLowerCase().substring(1);
    let content = "";
    if (extension === "txt" || extension === "md") {
      content = await fs.readFile(filePath, "utf-8");
    } else if (extension === "pdf") {
      content = `[PDF Content Placeholder for ${fileName}] - PDF parsing to be implemented.`;
    }
    files.push({
      name: fileName,
      path: filePath,
      size: stats.size,
      type: extension,
      content
    });
  }
  return files;
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
