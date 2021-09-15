import type { CellManager } from '$lib/cells/manager';
import type { Repository } from '$lib/repository/repository';
import type { Auth } from 'googleapis';

export interface Context {
	googleAuth: Auth.OAuth2Client;
	repo: Repository;
	cells: CellManager;
}
