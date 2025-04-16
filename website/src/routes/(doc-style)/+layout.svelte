<script lang="ts">
	import DocStyleSidebar from './DocStyleSidebar.svelte';

	import { fade } from 'svelte/transition';
	import { afterUpdate } from 'svelte';

	import '$lib/styles/shiki.css';
	import '$lib/styles/global.css';
	import { browser } from '$app/environment';

	import type { LayoutData } from './$types';

	export let data: LayoutData;

	let outlineHeadings: NodeListOf<Element> | null;

	afterUpdate(() => {
		if (browser) {
			setTimeout(() => (outlineHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')), 0);
		}
	});
</script>

{#key data.currentRoute}
	<div class="h-full bg-bg-primary" in:fade={{ duration: 150, delay: 150 }} out:fade={{ duration: 150 }}>
		<main class="flex min-h-screen overflow-auto">
			<DocStyleSidebar headings={outlineHeadings} />
			<section class="flex-1 px-4 md:px-8 lg:px-16 py-8 ">
				<div class="max-w-5xl mx-auto prose">
					<slot />
				</div>
			</section>
		</main>
	</div>
{/key}

<style>
	:global(.pre-container) {
		@apply flex flex-wrap gap-4 my-4;
	}

	:global(pre) {
		@apply flex-1 min-w-[20em] m-0;
	}
</style>
