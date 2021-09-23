import { JSONFile, Memory, Low, Adapter } from 'lowdb';

interface LowData {
	token?: string | undefined;
	cells: Record<string, Cell>;
}

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
	getToken(): Promise<string | undefined>;
	insertToken(value: string): Promise<void>;
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
		async getToken() {
			return db.data?.token;
		},
		async insertToken(value) {
			initData().token = value;
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
