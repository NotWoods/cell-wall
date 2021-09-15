<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { authenticateGoogle } from '$lib/google';
	import type { Context } from './_kit';

	export const load: Load<{ context: Context }> = async ({ page, context }) => {
		const code = page.query.get('code');
		if (!code) {
			return {
				status: 400,
				error: new Error('Missing code')
			};
		}

		const { googleAuth, repo } = context;
		await authenticateGoogle(googleAuth, repo, code);

		return {
			status: 200
		};
	};
</script>

Authentication successful! Please return to the console.
