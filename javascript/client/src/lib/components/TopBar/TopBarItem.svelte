<script lang="ts">
	export let href: string;
	export let active = false;

	let className = '';
	export { className as class };
</script>

<a
	class="text-gray-300 hover:bg-green-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium {className}"
	class:bg-green-700={active}
	class:text-white={active}
	{href}><slot /></a
>
