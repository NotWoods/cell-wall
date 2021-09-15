import type { Auth } from 'googleapis';
import { openDb } from './open-db.js';
import { tokenDao } from './token-dao.js';

export interface Repository {
	getTokens(): Promise<Auth.Credentials | undefined>;
	insertTokens(token: Auth.Credentials): Promise<void>;
}

export async function repository(filename: string): Promise<Repository> {
	const db = await openDb(filename);
	const token = tokenDao(db);

	return {
		async getTokens() {
			const allString = await token.getToken('all_tokens');
			return allString ? JSON.parse(allString) : undefined;
		},
		async insertTokens(json) {
			return token.insertToken('all_tokens', JSON.stringify(json));
		}
	};
}
