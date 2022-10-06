<script lang="ts">
	import { page } from '$app/stores';
</script>

<section>
	<div>
		<h1>{$page.status}</h1>
		<h2>
			{#if $page.status === 404}
				This page does not exist.
			{:else}
				{$page.error?.message || 'Unspecified error'}
			{/if}
		</h2>
	</div>
</section>

<style>
	h1 {
		font-size: 5rem;
	}

	h2 {
		max-width: 60ch;
	}

	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100%;
	}

	div {
		margin-left: 10%;
	}
</style>
