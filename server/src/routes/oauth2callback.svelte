<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { authenticateGoogle } from '$lib/google';
	import { repo } from '$lib/repository';
	import type { Context } from './__layout.svelte';

	export const load: Load<{ context: Context }> = async ({ page, context }) => {
		if (!context.googleAuth) {
			return {
				status: 503,
				error: `Google Auth not set up`
			};
		}

		const code = page.query.get('code');
		if (!code) {
			return {
				status: 400,
				error: new Error('Missing code')
			};
		}

		await authenticateGoogle(context.googleAuth, repo, code);

		return {
			status: 200
		};
	};
</script>

Authentication successful! Please return to the console.
