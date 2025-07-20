<script lang="ts">
	import { errors } from '$lib/js/stores';
	import { onMount } from 'svelte';

	function removeErrors() {
		console.log('removeErrors');
		errors.set([]);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			removeErrors();
		}
	}

	// add event listener on keydown to body to remove errors
	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
	role="dialog"
	aria-label="Error messages"
	on:click|self={removeErrors}
	on:keydown={handleKeyDown}
	class={`fixed inset-0 ${$errors.length > 0 ? 'grid' : 'hidden'} place-items-center bg-black/20 z-50`}
>
	<div
		class="bg-background min-w-[80vw] p-4 border-2 border-destructive border-t-10 rounded-none shadow-[0_0_0_100vmax_rgba(0,0,0,0.77)]"
	>
		<h2 class="text-xl font-bold mb-2 text-white">Errors</h2>
		<div class="ml-8 mb-4">
			<ul class="list-disc text-white">
				{#each $errors as error}
					<li>{error}</li>
				{/each}
			</ul>
		</div>
		<button
			on:click={removeErrors}
			class="px-8 py-2 text-base font-extrabold uppercase rounded-sm bg-gray-800 text-white border-none mt-4"
		>
			Close
		</button>
	</div>
</div>
