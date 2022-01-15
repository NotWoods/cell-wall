<script lang="ts">
	let className = '';
	let htmlFor: string | undefined = undefined;
	export { className as class, htmlFor as for };
</script>

<label {...$$restProps} for={htmlFor} class="block text-sm font-medium text-gray-100 {className}">
	<slot />
</label>
