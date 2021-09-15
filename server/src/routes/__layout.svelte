<script lang="ts" context="module">
	import { repository } from '$lib/database';
	import { initializeGoogle } from '$lib/google';

	import type { Load } from '@sveltejs/kit';
	import type { Context } from './_kit';

	export const load: Load<{}, { context: Context }> = async () => {
		const repo = await repository('.database.db');
		const { googleAuth } = await initializeGoogle(repo);

		return {
			context: { repo, googleAuth }
		};
	};
</script>

<slot />
