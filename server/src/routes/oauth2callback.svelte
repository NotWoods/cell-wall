<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { initializeGoogle, authenticateGoogle } from '$lib/google';
	import { repo } from '$lib/repository';

	const authReady = initializeGoogle(repo);

	export const load: Load = async ({ page }) => {
		const code = page.query.get('code');
		if (!code) {
			return {
				status: 400,
				error: new Error('Missing code')
			};
		}

		const { googleAuth } = await authReady;
		await authenticateGoogle(googleAuth, repo, code);

		return {
			status: 200
		};
	};
</script>

Authentication successful! Please return to the console.
