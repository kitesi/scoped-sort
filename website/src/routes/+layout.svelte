<script lang="ts">
	import type { LayoutData } from './$types';

	import '$lib/styles/prism-tommorow-night.css';
	import '$lib/styles/app.scss';
	import { fade } from 'svelte/transition';

	export let data: LayoutData;
</script>

{#key data.currentRoute}
	<main in:fade={{ duration: 150, delay: 150 }} out:fade={{ duration: 150 }}>
		<slot />
	</main>
{/key}

<style>
	main {
		height: 100%;
	}
</style>
