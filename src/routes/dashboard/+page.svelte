<script lang="ts">
	import DataTable from './data-table.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { columns } from './columns';
	import { debounce } from '$lib/debounce.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let { data } = $props();
	let search = $state(page.url.searchParams.get('search') ?? '');

	const updateSearch = debounce((value: string) => {
		const term = value.trim();
		const params = new URLSearchParams(page.url.searchParams);
		params.delete('page');

		if (term.length > 2) {
			params.set('search', term);
		} else {
			params.delete('search');
		}

		const nextQuery = params.toString();
		const currQuery = page.url.searchParams.toString();
		if (nextQuery === currQuery) {
			return;
		}

		goto(nextQuery.length > 0 ? `${page.url.pathname}?${nextQuery}` : page.url.pathname, {
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
