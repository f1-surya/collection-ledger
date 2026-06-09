<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.ico';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /> <title>Collection Ledger</title></svelte:head>
<ModeWatcher />
{@render children()}
