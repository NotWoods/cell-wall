<script lang="ts">
	const INPUT_CLASSES = 'block w-full shadow-sm sm:text-sm border-gray-300 rounded-md';

	let className = '';
	let htmlFor: string | undefined = undefined;
	export { className as class, htmlFor as for };
	export let label: string;
</script>

<div class={className}>
	<label class="block text-sm font-medium text-gray-100 mb-1" for={htmlFor}>{label}</label>
	<slot inputClassName={INPUT_CLASSES}>
		<input type="text" id={htmlFor} class={INPUT_CLASSES} />
	</slot>
</div>
