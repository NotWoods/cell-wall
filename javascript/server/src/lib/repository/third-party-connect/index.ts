import type { Database } from '../database';
import { GithubClient } from './github';
import { GoogleClient } from './google';

export function thirdPartyConnectRepository(dbPromise: Promise<Database> | Database) {
	let github: GithubClient | undefined;
	let google: Promise<GoogleClient> | undefined;

	return {
		get github() {
			if (!github) {
				github = new GithubClient();
			}
			return github;
		},
		get google() {
			if (!google) {
				google = GoogleClient.create(dbPromise);
			}
			return google;
		}
	};
}

export type ThirdPartyConnect = ReturnType<typeof thirdPartyConnectRepository>;
