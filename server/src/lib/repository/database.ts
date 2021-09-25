import type { Auth } from 'googleapis';
import type { Adapter } from 'lowdb';
import { JSONFile, Memory, Low } from 'lowdb';

interface LowData {
	googleCredentials?: Auth.Credentials | undefined;
	cells: Record<string, Cell>;
}

/**
 * Cell info includes the user-friendly name of a device,
 * the width and height of the display in density independent pixels,
 * and the x/y location relative to other phones.
 */
export interface Cell {
	serial: string;
	deviceName?: string;
	width?: number;
	height?: number;
	x?: number;
	y?: number;
	server?: string;
}

export interface Database {
	getGoogleCredentials(): Promise<Auth.Credentials | undefined>;
	setGoogleCredentials(credentials: Auth.Credentials): Promise<void>;
	getCell(serial: string): Promise<Cell | undefined>;
	getCells(): Promise<Cell[]>;
	insertCell(cell: Cell): Promise<void>;
	insertCells(cell: readonly Cell[]): Promise<void>;
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
