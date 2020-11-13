import SQL from 'sql-template-strings';
import { Database } from 'sqlite';

export interface Token {
  name: string;
  value: string;
}

export function tokenDao(db: Database) {
  return {
    async getToken(name: string): Promise<string | undefined> {
      const token = await db.get<Token>(
        SQL`SELECT value FROM Token WHERE name = ${name}`,
      );
      return token?.value;
    },
    async insertToken(name: string, value: string): Promise<void> {
      await db.run(
        SQL`REPLACE INTO Token(name, value) VALUES (${name}, ${value})`,
      );
    },
  };
}
