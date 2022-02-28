<script lang="ts">
	import TopBarItem from './TopBarItem.svelte';
</script>

<nav class="bg-green-800">
	<div
		class="top-bar flex flex-wrap gap-2 items-center max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2"
	>
		<!-- Logo -->
		<a class="flex items-center" href="/remote/">
			<img class="block mr-2" src="/logo.png" alt="" width="28" height="28" />
			<h1 class="sr-only md:not-sr-only text-xl">CellWall Remote</h1>
		</a>

		<TopBarItem href="/remote/">Presets</TopBarItem>
		<TopBarItem href="/remote/text">Text</TopBarItem>
		<TopBarItem href="/remote/image">Image</TopBarItem>
		<TopBarItem href="/remote/custom">Custom</TopBarItem>
		<TopBarItem href="/cell" class="ml-auto">Cell</TopBarItem>
		<TopBarItem href="/remote/edit">Edit</TopBarItem>
		<TopBarItem href="https://github.com/NotWoods/cell-wall">
			<svg
				class=""
				xmlns="http://www.w3.org/2000/svg"
				aria-label="GitHub"
				role="img"
				width="24"
				height="24"
				viewBox="0 0 512 512"
			>
				<path
					fill="currentColor"
					d="M165 512H77c-43 0-77-34-77-77V77C0 34 34 0 77 0h358c43 0 77 34 77 77v358c0 43-34 77-77 77h-88c0-5-2-13-12-13-13 0-16-6-16-12l1-70c0-24-8-40-18-48 57-6 117-28 117-126 0-28-10-51-26-69 3-6 11-32-3-67 0 0-21-7-70 26-42-12-86-12-128 0-49-33-70-26-70-26-14 35-6 61-3 67-16 18-26 41-26 69 0 98 59 120 116 126-7 7-14 18-16 35-15 6-52 17-74-22 0 0-14-24-40-26 0 0-25 0-1 16 0 0 16 7 28 37 0 0 15 50 86 34l1 44c0 6-3 12-16 12-10 0-12 8-12 13Z"
				/>
			</svg>
		</TopBarItem>
	</div>
</nav>
