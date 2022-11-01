<script lang="ts">
	import DocStyleSidebar from './DocStyleSidebar.svelte';

	import { fade } from 'svelte/transition';
	import { afterUpdate } from 'svelte';

	import '$lib/styles/shiki.css';
	import '$lib/styles/app.scss';
	import '$lib/styles/colors.css';
	import '$lib/styles/doc-style-page.scss';
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
	<div class="layout" in:fade={{ duration: 150, delay: 150 }} out:fade={{ duration: 150 }}>
		<main>
			<DocStyleSidebar headings={outlineHeadings} />
			<section>
				<div>
					<slot />
				</div>
			</section>
		</main>
	</div>
{/key}

<style>
	.layout {
		height: 100%;
	}

	.layout :global(.pre-container) {
		display: flex;
		flex-wrap: wrap;
		gap: 1em;
		margin-block: 1em;
	}

	.layout :global(pre) {
		flex: 1;
		min-width: 20em;
		margin: 0 !important;
	}
</style>
