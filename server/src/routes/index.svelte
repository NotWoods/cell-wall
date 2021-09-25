<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async () => {
		return {
			status: 301,
			redirect: '/remote/'
		};
	};
</script>

Authentication successful! Please return to the console.
