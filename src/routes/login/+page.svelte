<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<main class="flex h-dvh w-dvw items-center justify-center p-2">
	<Card.Root class="w-full max-w-xl text-center md:w-2/5">
		<Card.Header>
			<Card.Title class="text-xl">Login to continue</Card.Title>
		</Card.Header>
		<Card.Content>
			<form method="post" action="?/signInEmail" use:enhance class="space-y-3 text-left">
				<div class="space-y-1.5">
					<label for="email" class="text-sm font-medium">Email</label>
					<Input id="email" name="email" type="email" required autocomplete="email" />
				</div>
				<div class="space-y-1.5">
					<label for="password" class="text-sm font-medium">Password</label>
					<Input
						id="password"
						name="password"
						type="password"
						required
						autocomplete="current-password"
					/>
				</div>
				{#if form?.message}
					<p class="text-destructive text-sm">{form.message}</p>
				{/if}
				<Button type="submit" class="w-full">Login</Button>
			</form>
		</Card.Content>
		<Card.Footer>
			<p class="w-full text-center">
				Don't have an account?, <a href="/signup" class="text-blue-600 underline">Signup here</a>.
			</p>
		</Card.Footer>
	</Card.Root>
</main>
