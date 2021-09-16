import { cellDao, CellDao } from './cell-dao';
import { openDb } from './open-db';
import { TokenDao, tokenDao } from './token-dao';

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
