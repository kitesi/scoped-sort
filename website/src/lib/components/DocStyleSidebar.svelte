<script lang="ts">
	import HamburgerMenu from '$lib/components/HamburgerMenu.svelte';
	import SidebarOutlineItem from '$lib/components/SidebarOutlineItem.svelte';

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

<div>
	<HamburgerMenu />
</div>

<nav class:show={$isSidebarOpen}>
	<ul>
		<li>
			<a on:click={closeSidebar} href="/" class="text-foreground hover:text-link">Home</a>
		</li>
		<li>
			<a on:click={closeSidebar} href="/playground" class="text-foreground hover:text-link"
				>Playground</a
			>
		</li>
		<li>
			<a on:click={closeSidebar} href="/docs" class="text-foreground hover:text-link"
				>Documentation</a
			>
		</li>
		<li>
			<a on:click={closeSidebar} href="/examples" class="text-foreground hover:text-link"
				>Examples</a
			>
		</li>
		<hr aria-hidden="true" />
		{#if headings}
			{#each transformOutlineHeadings(headings).children as heading}
				<SidebarOutlineItem item={heading} />
			{/each}
		{/if}
	</ul>
</nav>

<style>
	div {
		position: fixed;
		top: 1em;
		right: 1em;
		z-index: 2;
	}

	nav {
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		max-width: 100%;
		width: var(--sidebar-width, unset);
		background-color: var(--color-sidebar);
		color: var(--color-sidebar-foreground);
		border-right: 0.1em solid var(--color-sidebar-border);
		transform: translateX(-100%);
		transition: transform 100ms ease-in;
		z-index: 1;
		padding: 1em;
		font-size: min(1rem, 20px);
		overflow-y: auto;
		overflow-x: hidden;
	}

	nav.show {
		transform: translateX(0);
		box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.77);
		-webkit-box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.77);
		-moz-box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.77);
	}

	hr {
		border-color: var(--color-sidebar-border);
		margin: 10px 0;
		box-sizing: content-box;
		overflow: hidden;
		transform: scale(1.15);
	}

	ul:not(:first-child) {
		margin-left: 16px;
	}

	li {
		list-style: none;
		padding: 5px;
		padding-left: 15px;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	@media screen and (min-width: 768px) {
		div :global(button) {
			display: none;
		}

		nav {
			position: static;
			transform: translateX(0);
			overflow-y: auto;
			overflow-x: hidden;
		}

		nav.show {
			box-shadow: none;
			-webkit-box-shadow: none;
			-moz-box-shadow: none;
		}
	}
</style>
