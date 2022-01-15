<script lang="ts">
	import TopBarItem from './TopBarItem.svelte';
</script>

<nav class="bg-green-900">
	<div
		class="top-bar flex flex-wrap gap-x-4 items-center max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2"
	>
		<!-- Logo -->
		<a class="flex items-center" href="https://github.com/NotWoods/cell-wall">
			<img class="block" src="/logo.png" alt="" width="28" height="28" />
			<h1 class="hidden lg:block ml-2 text-xl">CellWall Remote</h1>
		</a>

		<TopBarItem href="/remote/">Presets</TopBarItem>
		<TopBarItem href="/remote/image">Image</TopBarItem>
		<TopBarItem href="/remote/custom">Custom</TopBarItem>
		<TopBarItem href="/remote/edit" class="ml-auto">Edit</TopBarItem>
	</div>
</nav>
