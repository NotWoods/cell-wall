<script lang="ts">
	export let href: string;
	let className = 'bg-slate-700 hover:bg-slate-800 disabled:bg-slate-600 disabled:opacity-50';
	export { className as class };
</script>

<a
	{...$$restProps}
	{href}
	class="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white transition-colors {className}"
>
	<slot />
</a>
