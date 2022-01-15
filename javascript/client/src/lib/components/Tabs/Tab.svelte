<script lang="ts">
	export let selected = false;
	export let controls: string;
</script>

<li class="inline-block">
	<button
		type="button"
		class="border-b-2 -mb-[2px] px-4 py-2 transition-colors"
		class:text-green-400={selected}
		class:border-current={selected}
		class:border-transparent={!selected}
		class:hover:border-white={!selected}
		role="tab"
		aria-selected={selected}
		aria-controls={controls}
		on:click
	>
		<slot />
	</button>
</li>
