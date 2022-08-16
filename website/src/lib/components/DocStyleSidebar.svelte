<script lang="ts">
	import Sidebar from './Sidebar.svelte';
	import { transformToId } from '../../transform-to-id';
	import type { Heading } from '../../routes/Heading';
	export let headings: Heading[];
</script>

<Sidebar attach={true}>
	<div>
		<ul class="first-level">
			<li>
				<a href="/">Home</a>
			</li>
			<li>
				<a href="/docs">Documentation</a>
			</li>
			<li>
				<a href="/examples">Examples</a>
			</li>
			<hr />
			{#each headings as heading (heading.name)}
				<li class="first-level">
					<a href={'#' + transformToId(heading.name)}>{heading.name}</a>
					{#if heading.children}
						<ul class="second-lebel">
							{#each heading.children as subheading}
								<li class="second-level">
									<a href={'#' + transformToId(subheading.name)}>{subheading.name}</a>
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</Sidebar>

<style lang="scss">
	@use '../styles/colors.scss' as *;
	@use '../styles/numerical.scss' as *;

	div {
		padding: 15px;
		background-color: darken($c-black-2, 5%);
		height: 100%;
		width: 300px;
	}

	hr {
		border-color: white;
		margin: 20px 0;
		width: 50%;
	}

	ul {
		margin-left: 10px;
	}

	li.first-level {
		font-weight: 700;
	}

	li.second-level {
		font-weight: 100;
	}

	li {
		list-style: none;
		padding: 5px;
		max-width: 90%;
	}

	li.first-level a {
		font-weight: 700;
	}

	li.second-level a {
		font-weight: 400;
	}

	a {
		color: white;
	}
</style>
