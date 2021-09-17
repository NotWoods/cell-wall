<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import type { Auth } from 'googleapis';
	import { initializeGoogle } from '$lib/google';
	import { repo } from '$lib/repository';
	import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$lib/env';

	export interface Context {
		googleAuth?: Auth.OAuth2Client;
	}

	const authReady = initializeGoogle(repo, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

	export const load: Load<{}, { context: Context }> = async () => {
		const { googleAuth } = await authReady;
		return {
			context: { googleAuth }
		};
	};
</script>

<slot />
