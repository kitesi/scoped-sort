<script lang="ts">
	import { page } from '$app/stores';
</script>

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

<style>
	h1 {
		font-size: 5rem;
	}

	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-items: center;
		justify-content: center;
		height: 100%;
	}
</style>
