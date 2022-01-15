<script lang="ts">
	let className = '';
	export { className as class };
</script>

<article class="bg-slate-800 p-4 border rounded border-slate-700 {className}">
	<slot />
</article>
