import { open, IMigrate } from 'sqlite';
import * as sqlite3 from 'sqlite3';

const migrations: IMigrate.MigrationData[] = [
  {
    id: 1,
    name: 'initial',
    up: `
    CREATE TABLE IF NOT EXISTS Token (
      name  TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Cell (
      serial       TEXT PRIMARY KEY,
      deviceName   TEXT NOT NULL,
      widthPixels  INTEGER,
      heightPixels INTEGER,
      server       TEXT,
      state        TEXT
    );`,
    down: `
    DROP TABLE Cell;
    DROP TABLE Token;`,
  },
];

export async function openDb(filename: string) {
  const db = await open({
    filename,
    driver: sqlite3.cached.Database,
  });

  await db.migrate({ migrations });

  return db;
}
