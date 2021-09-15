import SQL from 'sql-template-strings';
import { Database } from 'sqlite';

export interface Token {
	name: string;
	value: string;
}

export interface TokenDao {
	getToken(name: string): Promise<string | undefined>;
	insertToken(name: string, value: string): Promise<void>;
}

export const tokenTable = `Token (
  name  TEXT PRIMARY KEY,
  value TEXT NOT NULL
)`;

export function tokenDao(db: Database): TokenDao {
	return {
		async getToken(name) {
			const token = await db.get<Token>(SQL`SELECT value FROM Token WHERE name = ${name}`);
			return token?.value;
		},
		async insertToken(name, value) {
			await db.run(SQL`REPLACE INTO Token(name, value) VALUES (${name}, ${value})`);
		}
	};
}
