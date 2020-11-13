import { Database, open } from 'sqlite';
import * as sqlite3 from 'sqlite3';

export async function openDb(filename: string) {
  const db = await open({
    filename,
    driver: sqlite3.cached.Database,
  });

  if (true) {
    await initializeDatabase(db);
  }

  return db;
}

export async function initializeDatabase(db: Database) {
  await db.run(`CREATE TABLE IF NOT EXISTS Token (
    name  TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )`);

  await db.run(`CREATE TABLE IF NOT EXISTS Cell (
    serial       TEXT PRIMARY KEY,
    deviceName   TEXT NOT NULL,
    widthPixels  INTEGER,
    heightPixels INTEGER,
    server       TEXT,
    state        TEXT
  )`);
}
