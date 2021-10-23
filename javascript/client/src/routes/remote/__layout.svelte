<script lang="ts">
	let open = false;
</script>

<svelte:head>
	<title>CellWall Remote</title>
	<link rel="stylesheet" href="https://jenil.github.io/bulmaswatch/darkly/bulmaswatch.min.css" />
	<link rel="manifest" href="/manifest.webmanifest" />
</svelte:head>

<nav class="navbar">
	<div class="navbar-brand">
		<a class="navbar-item" href="https://github.com/NotWoods/cell-wall">
			<img src="/logo.png" alt="" width="28" height="28" />
			<span style="margin-left: 0.5rem">CellWall Remote</span>
		</a>

		<!-- svelte-ignore a11y-missing-attribute -->
		<a
			role="button"
			class="navbar-burger burger"
			class:is-active={open}
			aria-label="menu"
			aria-expanded={open}
			data-target="navMenu"
			on:click={() => {
				open = !open;
			}}
		>
			<span aria-hidden="true" />
			<span aria-hidden="true" />
			<span aria-hidden="true" />
		</a>
	</div>

	<div id="navMenu" class="navbar-menu" class:is-active={open}>
		<div class="navbar-start">
			<a class="navbar-item" href="/remote/"> Preset </a>
			<a class="navbar-item" href="/remote/image"> Image </a>
			<a class="navbar-item" href="/remote/custom"> Custom </a>
		</div>
		<div class="navbar-end">
			<a class="navbar-item" href="/remote/edit"> Edit </a>
		</div>
	</div>
</nav>

<main class="section">
	<div class="container">
		<slot />
	</div>
</main>
