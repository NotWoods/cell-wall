import { openDb } from './open-db.js';
import { tokenDao } from './token-dao.js';

export type Awaited<T> = T extends undefined
  ? T
  : T extends PromiseLike<infer U>
  ? U
  : T;

export type Repository = Awaited<ReturnType<typeof repository>>;

export async function repository(filename: string) {
  const db = await openDb(filename);
  const token = tokenDao(db);

  return {
    async getTokens() {
      const allString = await token.getToken('all_tokens');
      return allString ? JSON.parse(allString) : undefined;
    },
    async insertTokens(json: unknown) {
      return token.insertToken('all_tokens', JSON.stringify(json));
    },
  };
}
