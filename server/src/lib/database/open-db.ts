import { open, IMigrate, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import { cellTable } from './cell-dao';
import { tokenTable } from './token-dao';

function tableName(createTable: string) {
	const firstSpace = createTable.indexOf(' ');
	return createTable.slice(0, firstSpace);
}

const migrations: IMigrate.MigrationData[] = [
	{
		id: 1,
		name: 'initial',
		up: `
    CREATE TABLE IF NOT EXISTS ${tokenTable};
    CREATE TABLE IF NOT EXISTS ${cellTable};`,
		down: `
    DROP TABLE ${tableName(cellTable)};
    DROP TABLE ${tableName(tokenTable)};`
	}
];

export async function openDb(filename: string): Promise<Database> {
	const db = await open({
		filename,
		driver: sqlite3.cached.Database
	});

	await db.migrate({ migrations });

	return db;
}
