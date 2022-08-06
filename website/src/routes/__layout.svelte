<script context="module" lang="ts">
	export const load = ({ url }: { url: URL }) => {
		const currentRoute = url.pathname;

		return {
			props: {
				currentRoute
			}
		};
	};
</script>

<script lang="ts">
	import '../prism-tommorow-night.css';
	import '../app.scss';
	import { fade, fly } from 'svelte/transition';
	export let currentRoute: string;
</script>

{#key currentRoute}
	<!-- <main in:fade={{ duration: 150, delay: 150 }} out:fade={{ duration: 150 }}> -->
	<main in:fly={{ duration: 150, delay: 150, x: 100 }} out:fade={{ duration: 150 }}>
		<slot />
	</main>
{/key}

<style>
	main {
		height: 100%;
	}
</style>
