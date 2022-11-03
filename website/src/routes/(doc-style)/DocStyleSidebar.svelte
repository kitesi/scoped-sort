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

<div>
	<HamburgerMenu />
</div>

<nav class:show={$isSidebarOpen}>
	<ul data-sveltekit-reload>
		<li>
			<a on:click={closeSidebar} href="/">Home</a>
		</li>
		<li>
			<a on:click={closeSidebar} href="/docs">Documentation</a>
		</li>
		<li>
			<a on:click={closeSidebar} href="/examples">Examples</a>
		</li>
		<hr />
		{#if headings}
			{#each transformOutlineHeadings(headings).children as heading}
				<SidebarOutlineItem item={heading} />
			{/each}
		{/if}
	</ul>
</nav>

<style lang="scss">
	@use '../../lib/styles/sizes.scss' as *;

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
		background-color: var(--clr-bg-primary);
		color: var(--clr-bg-primary-content);
		border-right: 0.1em solid var(--clr-bg-code-block);
		transform: translateX(-100%);
		transition: transform 100ms ease-in;
		z-index: 1;
		padding: 1em;
		font-size: min(1.25rem, 20px);
		overflow-y: auto;
	}

	nav.show {
		transform: translateX(0);
		box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.77);
		-webkit-box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.77);
		-moz-box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.77);
	}

	hr {
		border-color: white;
		margin: 10px 0;
		box-sizing: content-box;
		overflow: hidden;
		background: transparent;
		background-color: #30363d;
		border: 0;
	}

	ul:not(:first-child) {
		margin-left: 16px;
	}

	li {
		list-style: none;
		padding: 5px;
		padding-left: 15px;
		max-width: 90%;
	}

	@media screen and (min-width: $medium-screen) {
		div :global(button) {
			display: none;
		}

		nav {
			position: static;
			transform: translateX(0);
			overflow-y: auto;
		}

		nav.show {
			box-shadow: none;
			-webkit-box-shadow: none;
			-moz-box-shadow: none;
		}
	}
</style>
