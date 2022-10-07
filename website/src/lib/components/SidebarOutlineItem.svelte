<script lang="ts">
	import type { OutlineItem } from './outline-item.js';

	export let item: OutlineItem;
</script>

<li>
	<a href="#{item.id}">
		<!-- <Icon name="hash" /> -->
		<span>{item.name}</span>
	</a>

	{#if item.children}
		<ul>
			{#each item.children as child (child.name)}
				<svelte:self item={child} />
			{/each}
		</ul>
	{/if}
</li>

<style lang="scss">
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
