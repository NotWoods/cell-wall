<script lang="ts">
	import Label from './Label.svelte';

	const INPUT_CLASSES = 'block w-full shadow-sm sm:text-sm border-gray-300 rounded-md';

	let className = '';
	let htmlFor: string | undefined = undefined;
	export { className as class, htmlFor as for };
	export let label: string;
</script>

<div class="text-black {className}">
	<Label class="mb-1" for={htmlFor}>{label}</Label>
	<slot inputClassName={INPUT_CLASSES}>
		<input type="text" id={htmlFor} class={INPUT_CLASSES} />
	</slot>
</div>
