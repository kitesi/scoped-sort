<script>
	import { errors } from '$lib/js/stores';

	function removeErrors() {
		errors.set([]);
	}

	function handleKeyDown(event) {
		if (event.key === 'Escape') {
			removeErrors();
		}
	}
</script>

<section 
	role="dialog" 
	aria-label="Error messages" 
	on:click|self={removeErrors} 
	on:keydown={handleKeyDown}
	class={`fixed inset-0 ${$errors.length > 0 ? 'grid' : 'hidden'} place-items-center bg-black/80 z-50`}
	tabindex="0"
>
	<div class="bg-black min-w-[80vw] p-4 border-2 border-red-500 border-t-[10px]">
		<h2 class="text-xl font-bold mb-2 text-white">Errors</h2>
		<nav class="ml-8 mb-4">
			<ul class="list-disc text-white">
				{#each $errors as error}
					<li>{error}</li>
				{/each}
			</ul>
		</nav>
		<button 
            on:click={removeErrors}
            class="px-8 py-2 text-base font-extrabold uppercase rounded bg-red-500 text-white border-none mt-4"
        >
            Close
        </button>
	</div>
</section>

<style>
	section {
		display: none;
		place-items: center;
		position: fixed;
		inset: 0;
	}

	.show {
		display: grid;
	}

	div {
		background-color: var(--clr-bg-primary);
		min-width: 80vw;
		padding: 1em;
		transform: translateX(0);
		box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.77);
		-webkit-box-shadow: 0 0 0 0 100vmax rgba(0, 0, 0, 0.77);
		-moz-box-shadow: 0 0 0 0 100vmax rgba(0, 0, 0, 0.77);
		border: 2px solid var(--clr-bg-error);
		border-top-width: 10px;
		border-radius: 0em;
	}

	nav {
		margin-left: 2em;
	}

	button {
		padding: 0.5em 2em;
		font-size: 1rem;
		font-weight: 800;
		text-transform: uppercase;
		border-radius: 0.1em;
		background-color: var(--clr-bg-error);
		color: var(--clr-bg-error-content);
		border: none;
		margin-top: 1em;
	}
</style>
