<script lang="ts">
	import type { LayoutData } from './$types';

	import '$lib/styles/app.scss';
	import '$lib/styles/colors.css';

	import { fade } from 'svelte/transition';

	export let data: LayoutData;
</script>

{#key data.currentRoute}
	<div in:fade={{ duration: 250, delay: 0 }} out:fade={{ duration: 250 }}>
		<slot />
	</div>
{/key}

<style>
	div {
		height: 100%;
	}
</style>
