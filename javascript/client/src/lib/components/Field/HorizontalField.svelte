<script lang="ts">
	import Label from './Label.svelte';

	const INPUT_CLASSES = 'block w-full shadow-sm sm:text-sm border-gray-300 rounded-md flex-1';

	let className = '';
	let htmlFor: string | undefined = undefined;
	export { className as class, htmlFor as for };
	export let label: string;
</script>

<div class="flex flex-col sm:flex-row sm:items-center text-black {className}">
	<Label class="mb-4 sm:mb-0 sm:mr-4 flex-initial w-36" for={htmlFor}>{label}</Label>
	<slot inputClassName={INPUT_CLASSES}>
		<input type="text" id={htmlFor} class={INPUT_CLASSES} />
	</slot>
</div>
