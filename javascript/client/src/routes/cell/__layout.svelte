<script lang="ts">
	import { page } from '$app/stores';
	import PageTransition from './_PageTransition.svelte';
</script>

<svelte:head>
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="apple-mobile-web-app-title" content="CellWall" />
	<link rel="apple-touch-icon" sizes="274x274" href="/maskable_icon.png" />
</svelte:head>

<PageTransition key={$page.url.pathname}>
	<slot />
</PageTransition>
