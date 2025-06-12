import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFilePath = path.join(__dirname, '../database/database.db');
const schemaFilePath = path.join(__dirname, '../database/schema.sql');

// Ensure database directory exists
const dbDir = path.dirname(dbFilePath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    } else {
        console.log('Connected to the SQLite database.');
        initializeSchema();
    }
});

function initializeSchema() {
    fs.readFile(schemaFilePath, 'utf8', (err, sqlScript) => {
        if (err) {
            console.error('Error reading schema file:', err.message);
            return;
        }

        db.exec(sqlScript, (execErr) => {
            if (execErr) {
                // Check if error is because tables already exist (common and usually fine)
                if (execErr.message.includes('already exists')) {
                    console.log('Tables already exist or schema previously applied.');
                } else {
                    console.error('Error executing schema:', execErr.message);
                }
            } else {
                console.log('Database schema initialized successfully (or already up-to-date).');
            }
        });
    });
}

export default db;
