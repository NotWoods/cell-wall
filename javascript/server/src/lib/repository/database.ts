import type { CellInfo } from '@cell-wall/shared';
import type { Adapter } from 'lowdb';
import { JSONFile, Low, Memory } from 'lowdb';
import type { Credentials } from './third-party-connect/google';

interface LowData {
	googleCredentials?: Credentials | undefined;
	cells: Record<string, CellInfo>;
}

export interface Database {
	getGoogleCredentials(): Promise<Credentials | undefined>;
	setGoogleCredentials(credentials: Credentials): Promise<void>;
	getCell(serial: string): Promise<CellInfo | undefined>;
	getCells(): Promise<CellInfo[]>;
	insertCell(cell: CellInfo): Promise<void>;
	insertCells(cell: readonly CellInfo[]): Promise<void>;
}

export async function database(filename?: string | undefined): Promise<Database> {
	const adapter: Adapter<LowData> = filename ? new JSONFile(filename) : new Memory();
	const db = new Low(adapter);
	await db.read();

	function initData(): LowData {
		return (db.data ||= { cells: {} });
	}

	return {
		async getGoogleCredentials() {
			return db.data?.googleCredentials;
		},
		async setGoogleCredentials(credentials) {
			initData().googleCredentials = credentials;
			await db.write();
		},
		async getCell(name) {
			return db.data?.cells?.[name];
		},
		async getCells() {
			return Object.values(initData().cells);
		},
		async insertCell(cell) {
			initData().cells[cell.serial] = cell;
			await db.write();
		},
		async insertCells(cells) {
			const data = initData();
			for (const cell of cells) {
				data.cells[cell.serial] = cell;
			}
			await db.write();
		}
	};
}
