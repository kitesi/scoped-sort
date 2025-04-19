<script lang="ts">
	import DocStyleSidebar from './DocStyleSidebar.svelte';

	import { fade } from 'svelte/transition';
	import { afterUpdate } from 'svelte';

	import '$lib/styles/shiki.css';
	import '$lib/styles/global.css';
	import '../../app.css';
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
	<div class="h-full overflow-y-auto" in:fade={{ duration: 150, delay: 150 }} out:fade={{ duration: 150 }}>
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
	.layout :global(.pre-container) {
		@apply flex flex-wrap gap-4 my-4;
	}

	.layout :global(pre) {
		@apply flex-1 min-w-[20em] m-0;
	}
</style>
