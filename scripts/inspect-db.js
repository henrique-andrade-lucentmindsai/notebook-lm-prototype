
import Database from 'better-sqlite3';
import path from 'path';
import os from 'os';

const dbPath = path.join(os.homedir(), '.config', 'notebook-lm-prototype', 'notebook-lm.db');
console.log('Inspecting database at:', dbPath);

try {
    const db = new Database(dbPath, { readonly: true });

    const notebooks = db.prepare('SELECT * FROM notebooks').all();
    console.log('\n--- NOTEBOOKS ---');
    console.table(notebooks);

    const sources = db.prepare('SELECT id, notebook_id, name, type FROM sources').all();
    console.log('\n--- SOURCES ---');
    console.table(sources);

    const messages = db.prepare('SELECT id, notebook_id, role, substr(content, 0, 50) as snippet FROM messages').all();
    console.log('\n--- MESSAGES ---');
    console.table(messages);

    db.close();
} catch (error) {
    console.error('Error inspecting database:', error.message);
}
