<script>
	import { errors } from '$lib/js/stores';

	function removeErrors() {
		errors.set([]);
	}
</script>

<section on:click|self={removeErrors} class:show={$errors.length > 0}>
	<div>
		<h2>Errors</h2>
		<nav>
			<ul>
				{#each $errors as error}
					<li>{error}</li>
				{/each}
			</ul>
		</nav>
		<button on:click={removeErrors}>close</button>
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
