<script lang="ts">
	import HamburgerMenu from '$lib/components/HamburgerMenu.svelte';
	import SidebarOutlineItem from './SidebarOutlineItem.svelte';

	import { isSidebarOpen } from '$lib/js/stores';

	import type { OutlineItem } from './outline-item';

	function getItemFromHeading(heading: Element): OutlineItem {
		return {
			level: Number.parseInt(heading.tagName[1]),
			name: heading.textContent || '',
			id: heading.id,
			children: []
		};
	}

	function searchParent(lookThrough: OutlineItem, lookFor: OutlineItem): OutlineItem | undefined {
		if (lookThrough === lookFor) return;

		for (const heading of lookThrough.children) {
			if (heading === lookFor) {
				return lookThrough;
			}

			const cache = searchParent(heading, lookFor);
			if (cache) return cache;
		}
	}

	export function transformOutlineHeadings(headings: NodeListOf<Element>) {
		const outerMostOutlineItem = {
			id: headings[0].id,
			name: headings[0].textContent || '',
			level: -1,
			children: [] as OutlineItem[]
		};

		let history: OutlineItem[] = [outerMostOutlineItem];

		for (const heading of headings) {
			const item = getItemFromHeading(heading);

			if (outerMostOutlineItem.children.length === 0) {
				outerMostOutlineItem.children.push(item);
				history.push(item);
				continue;
			}

			for (let i = history.length - 1; i >= 0; i--) {
				if (item.level > history[i].level) {
					history[i].children.push(item);
					history.push(item);
					break;
				} else if (item.level === history[i].level || i === 1) {
					searchParent(outerMostOutlineItem, history[i])?.children.push(item);
					history.push(item);
					break;
				}
			}
		}

		return outerMostOutlineItem;
	}

	export let headings: NodeListOf<Element> | null;

	function closeSidebar() {
		isSidebarOpen.set(false);
	}
</script>

<div class="fixed top-4 right-4 z-10">
	<HamburgerMenu />
</div>

<nav class={`fixed w-80 md:static top-0 left-0 h-full bg-bg-primary text-text-primary border-r border-border-color transform transition-transform duration-100 ease-in z-10 p-4 text-xl md:text-lg overflow-y-auto ${$isSidebarOpen ? 'translate-x-0 shadow-[0_0_0_100vmax_rgba(0,0,0,0.77)] md:shadow-none' : '-translate-x-full md:translate-x-0'}`}>
	<ul>
		<li class="list-none p-1 pl-4 max-w-[90%]">
			<a on:click={closeSidebar} href="/" class="text-text-primary hover:text-accent">Home</a>
		</li>
		<li class="list-none p-1 pl-4 max-w-[90%]">
			<a on:click={closeSidebar} href="/docs" class="text-text-primary hover:text-accent">Documentation</a>
		</li>
		<li class="list-none p-1 pl-4 max-w-[90%]">
			<a on:click={closeSidebar} href="/examples" class="text-text-primary hover:text-accent">Examples</a>
		</li>
		<hr aria-hidden="true" class="border-border-color my-2.5 scale-115 box-content overflow-hidden" />
		{#if headings}
			{#each transformOutlineHeadings(headings).children as heading}
				<SidebarOutlineItem item={heading} />
			{/each}
		{/if}
	</ul>
</nav>

<style>
	@media screen and (min-width: 768px) {
		div :global(button) {
			display: none;
		}
	}
	
	.scale-115 {
		transform: scale(1.15);
	}
	
	:global(ul:not(:first-child)) {
		margin-left: 16px;
	}
</style>
