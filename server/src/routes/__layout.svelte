<script lang="ts" context="module">
	import { initializeGoogle } from '$lib/google';
	import { repo } from '$lib/repository';

	import type { Load } from '@sveltejs/kit';
	import type { Context } from './_kit';

	export const load: Load<{}, { context: Context }> = async () => {
		const { googleAuth } = await initializeGoogle(repo);

		return {
			context: { repo, googleAuth }
		};
	};
</script>

<slot />
