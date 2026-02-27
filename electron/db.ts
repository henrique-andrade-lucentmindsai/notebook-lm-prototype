import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

let db: Database.Database;

export function initDb() {
    const dbPath = path.join(app.getPath('userData'), 'notebook-lm.db');
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

    // Enable foreign keys
    db.pragma('foreign_keys = ON');
}

// Notebook Operations
export function getAllNotebooks() {
    return db.prepare('SELECT * FROM notebooks ORDER BY created_at DESC').all();
}

export function createNotebook(id: string, name: string) {
    return db.prepare('INSERT INTO notebooks (id, name) VALUES (?, ?)').run(id, name);
}

export function updateNotebookName(id: string, name: string) {
    return db.prepare('UPDATE notebooks SET name = ? WHERE id = ?').run(name, id);
}

export function deleteNotebook(id: string) {
    return db.prepare('DELETE FROM notebooks WHERE id = ?').run(id);
}

// Source Operations
export function getSourcesForNotebook(notebookId: string) {
    return db.prepare('SELECT * FROM sources WHERE notebook_id = ? ORDER BY created_at ASC').all(notebookId);
}

export function saveSource(source: any, notebookId: string) {
    return db.prepare(`
        INSERT OR REPLACE INTO sources (id, notebook_id, name, type, content)
        VALUES (?, ?, ?, ?, ?)
    `).run(source.id, notebookId, source.name, source.type, source.content);
}

export function deleteSource(id: string) {
    return db.prepare('DELETE FROM sources WHERE id = ?').run(id);
}

// Message Operations
export function getMessagesForNotebook(notebookId: string) {
    return db.prepare('SELECT role, content, created_at FROM messages WHERE notebook_id = ? ORDER BY id ASC').all(notebookId);
}

export function saveMessage(notebookId: string, role: string, content: string) {
    return db.prepare('INSERT INTO messages (notebook_id, role, content) VALUES (?, ?, ?)').run(notebookId, role, content);
}

export function clearMessages(notebookId: string) {
    return db.prepare('DELETE FROM messages WHERE notebook_id = ?').run(notebookId);
}

// Settings Operations
export function getSetting(key: string) {
    return db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
}

export function saveSetting(key: string, value: string) {
    return db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);
}

export function getAllSettings() {
    return db.prepare('SELECT * FROM settings').all();
}
