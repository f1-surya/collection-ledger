<script lang="ts">
	import DataTable from './data-table.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { columns } from './columns';
	import { debounce } from '$lib/debounce.js';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let search = $state('');
	const updateSearch = debounce((value: string) => {
		goto(value.length > 0 ? `/dashboard?search=${encodeURIComponent(value)}` : '/dashboard', {
			replaceState: true,
			keepFocus: true,
			noScroll: true
		});
	}, 300);

	$effect(() => {
		updateSearch(search);
	});
</script>

<main>
	<Input
		class="max-w-sm m-4"
		type="search"
		placeholder="Enter Name or Smartcard"
		bind:value={search}
	/>
	<DataTable data={data.conns} {columns} />
</main>
