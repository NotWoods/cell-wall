import type { ThirdPartySocketState } from '@cell-wall/shared';
import { derived } from 'svelte/store';
import type { Repository } from '../repository';
import { resolvedPromiseStore } from './promise';

/**
 * Returns state to be used for the third party interface socket.
 */
export function thirdPartySocketStore(repo: Repository) {
	const googleAuthUrl = derived(
		resolvedPromiseStore(repo.thirdParty.google),
		(client, set) => {
			if (client) {
				client.authorizeUrl.subscribe((authorizeUrl) => set({ loading: false, authorizeUrl }));
			} else {
				set({ loading: true });
			}
		},
		{ loading: true } as { loading: boolean; authorizeUrl?: string }
	);

	return derived(googleAuthUrl, (googleState) => {
		const socketState: ThirdPartySocketState = {
			google_loading: googleState.loading,
			google_authorize_url: googleState.authorizeUrl
		};
		return socketState;
	});
}
