<script lang="ts">
	import type { LayoutData } from './$types';

	import '$lib/styles/prism-tommorow-night.css';
	import '$lib/styles/app.scss';
	import { fade } from 'svelte/transition';

	export let data: LayoutData;
</script>

{#key data.currentRoute}
	<div in:fade={{ duration: 150, delay: 150 }} out:fade={{ duration: 150 }}>
		<slot />
	</div>
{/key}

<style>
	div {
		height: 100%;
	}
</style>
