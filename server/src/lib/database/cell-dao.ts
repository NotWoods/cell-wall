import SQL from 'sql-template-strings';
import { Database } from 'sqlite';

export interface Cell {
	serial: string;
	deviceName: string;
	width?: number;
	height?: number;
	x?: number;
	y?: number;
	server?: string;
}

export interface CellDao {
	getCell(serial: string): Promise<Cell | undefined>;
	insertCell(cell: Cell): Promise<void>;
}

export const cellTable = `Cell (
  serial     TEXT PRIMARY KEY,
  deviceName TEXT NOT NULL,
  width      INTEGER,
  height     INTEGER,
  x          INTEGER,
  y          INTEGER,
  server     TEXT
)`;

export function cellDao(db: Database): CellDao {
	return {
		async getCell(name) {
			const cell = await db.get<Cell>(SQL`SELECT value FROM Cell WHERE serial = ${name}`);
			return cell;
		},
		async insertCell(cell) {
			const { serial, deviceName, width, height, x, y, server } = cell;
			await db.run(
				SQL`REPLACE INTO Cell(serial, deviceName, width, height, x, y, server) VALUES (${serial}, ${deviceName}, ${width}, ${height}. ${x}, ${y}, ${server})`
			);
		}
	};
}
