import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs/promises'
import * as db from './db'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
    win = new BrowserWindow({
        icon: path.join(process.env.VITE_PUBLIC || '', 'electron-vite.svg'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
        },
        width: 1200,
        height: 800,
        titleBarStyle: 'hiddenInset',
        backgroundColor: '#ffffff',
    })

    win.maximize()
    win.setMenu(null)

    // Test active push message to Renderer-process.
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', (new Date()).toLocaleString())
    })

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
    } else {
        // win.loadFile('dist/index.html')
        win.loadFile(path.join(RENDERER_DIST, 'index.html'))
    }
}

// Initialize Database
db.initDb()

// --- Database IPC Handlers ---

// Notebooks
ipcMain.handle('db:get-notebooks', async () => {
    return db.getAllNotebooks()
})

ipcMain.handle('db:create-notebook', async (_, id: string, name: string) => {
    return db.createNotebook(id, name)
})

ipcMain.handle('db:update-notebook-name', async (_, id: string, name: string) => {
    return db.updateNotebookName(id, name)
})

ipcMain.handle('db:delete-notebook', async (_, id: string) => {
    return db.deleteNotebook(id)
})

// Sources
ipcMain.handle('db:get-sources', async (_, notebookId: string) => {
    return db.getSourcesForNotebook(notebookId)
})

ipcMain.handle('db:save-source', async (_, source: any, notebookId: string) => {
    return db.saveSource(source, notebookId)
})

ipcMain.handle('db:delete-source', async (_, id: string) => {
    return db.deleteSource(id)
})

// Messages
ipcMain.handle('db:get-messages', async (_, notebookId: string) => {
    return db.getMessagesForNotebook(notebookId)
})

ipcMain.handle('db:save-message', async (_, notebookId: string, role: string, content: string) => {
    return db.saveMessage(notebookId, role, content)
})

ipcMain.handle('db:clear-messages', async (_, notebookId: string) => {
    return db.clearMessages(notebookId)
})

// Settings
ipcMain.handle('db:save-setting', async (_, key: string, value: string) => {
    return db.saveSetting(key, value)
})

ipcMain.handle('db:get-settings', async () => {
    return db.getAllSettings()
})

// Handle file selection
ipcMain.handle('select-files', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [
            { name: 'Documents', extensions: ['txt', 'md', 'pdf'] }
        ]
    })

    if (result.canceled) return []

    const files = []
    for (const filePath of result.filePaths) {
        const stats = await fs.stat(filePath)
        const fileName = path.basename(filePath)
        const extension = path.extname(filePath).toLowerCase().substring(1)

        // For now, only read text-based files. PDF will need extra logic.
        let content = ''
        if (extension === 'txt' || extension === 'md') {
            content = await fs.readFile(filePath, 'utf-8')
        } else if (extension === 'pdf') {
            content = `[PDF Content Placeholder for ${fileName}] - PDF parsing to be implemented.`
        }

        files.push({
            name: fileName,
            path: filePath,
            size: stats.size,
            type: extension,
            content: content
        })
    }
    return files
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        win = null
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.whenReady().then(createWindow)
