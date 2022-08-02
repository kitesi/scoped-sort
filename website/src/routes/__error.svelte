<script context="module" lang="ts">
	export function load({ error, status }: { error: any; status: number }) {
		return {
			props: {
				status,
				errorMessage: error?.message
			}
		};
	}
</script>

<script lang="ts">
	export let status: number;
	export let errorMessage: string;
</script>

<div>
	<h1>{status}</h1>
	<h2>
		{#if status === 404}
			This page does not exist.
		{:else}
			{errorMessage}
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
