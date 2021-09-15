import type { CellManager } from '$lib/cells/manager';
import type { Repository } from '$lib/database/repository';
import type { Auth } from 'googleapis';

export interface Context {
	googleAuth: Auth.OAuth2Client;
	repo: Repository;
	cells: CellManager;
}
