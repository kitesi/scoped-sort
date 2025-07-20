<script lang="ts">
	import { isSidebarOpen } from '$lib/js/stores.js';
	import type { OutlineItem } from './outline-item.js';

	export let item: OutlineItem;

	function closeSidebar() {
		isSidebarOpen.set(false);
	}
</script>

<li class="list-none py-1 px-1 pl-4">
	<a href="#{item.id}" on:click={closeSidebar} class="flex items-center gap-2 text-text-primary hover:text-accent">
		<!-- <Icon name="hash" /> -->
		<span>{item.name}</span>
	</a>

	{#if item.children}
		<ul class="ml-2.5 list-none">
			{#each item.children as child (child.name)}
				<svelte:self item={child} />
			{/each}
		</ul>
	{/if}
</li>

<style>
	ul {
		margin-left: 10px;
		list-style-type: none;
	}

	li {
		list-style-type: none;
		padding: 5px 5px 5px 15px;
	}

	a {
		color: inherit;
		display: flex;
		gap: 8px;
		align-items: center;
	}

	a:hover {
		color: var(--clr-link);
	}
</style>
