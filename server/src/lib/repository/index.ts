import { repository } from './repository';

export * from './interface';

export const repo = repository();

(globalThis as any)._repo = repo;
