<script lang="ts">
	import { format, isSameMonth, isThisMonth, subMonths } from 'date-fns';

	type Props = {
		lastPayment: Date | null;
	};

	let { lastPayment }: Props = $props();

	const color = $derived.by(() => {
		if (!lastPayment) {
			return 'bg-red-500/70';
		}

		if (isThisMonth(lastPayment)) {
			return 'bg-green-500/70';
		}

		if (isSameMonth(lastPayment, subMonths(new Date(), 1))) {
			return 'bg-yellow-500/70';
		}

		return 'bg-red-500/70';
	});
</script>

<div class="flex items-center justify-center">
	<div class={`rounded-sm w-full ${color} p-1 flex items-center justify-center font-semibold`}>
		{#if lastPayment}
			{format(lastPayment, 'dd MMM yyyy')}
		{:else}
			Nil
		{/if}
	</div>
</div>
