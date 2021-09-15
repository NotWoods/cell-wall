import { cellDao, CellDao } from './cell-dao.js';
import { openDb } from './open-db.js';
import { TokenDao, tokenDao } from './token-dao.js';

export interface Database {
	tokenDao(): TokenDao;
	cellDao(): CellDao;
}

export async function database(filename: string): Promise<Database> {
	const db = await openDb(filename);
	return {
		tokenDao: () => tokenDao(db),
		cellDao: () => cellDao(db)
	};
}
