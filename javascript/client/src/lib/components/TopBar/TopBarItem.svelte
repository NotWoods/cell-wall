<script lang="ts">
	import { page } from '$app/stores';

	export let href: string;
	$: active = $page.url.pathname === href;

	let className = '';
	export { className as class };
</script>

<a
	class="hover:bg-green-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium {className}"
	class:text-gray-300={!active}
	class:text-gray-100={active}
	class:bg-green-700={active}
	{href}><slot /></a
>
