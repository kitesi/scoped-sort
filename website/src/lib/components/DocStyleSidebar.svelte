<script lang="ts">
	import Sidebar from './Sidebar.svelte';
	import { transformToId } from '../../transform-to-id';
	import { isSidebarOpen } from '../../stores';

	import type { Heading } from '../../routes/Heading';

	export let headings: Heading[];

	function closeSidebar() {
		isSidebarOpen.set(false);
	}
</script>

<Sidebar maxWidth={false}>
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
					<a on:click={closeSidebar} href={'#' + transformToId(heading.name)}>{heading.name}</a>
					{#if heading.children}
						<ul class="second-lebel">
							{#each heading.children as subheading}
								<li class="second-level">
									<a on:click={closeSidebar} href={'#' + transformToId(subheading.name)}
										>{subheading.name}</a
									>
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
		height: 100%;
		width: 300px;
		overflow: auto;
		background-color: $c-black-1;
	}

	hr {
		border-color: white;
		margin: 10px 0;
		box-sizing: content-box;
		overflow: hidden;
		background: transparent;
		border-bottom: 1px solid #21262d;
		height: 0.1em;
		padding: 0;
		background-color: #30363d;
		border: 0;
	}

	ul:not(:first-child) {
		margin-left: 16px;
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
		padding-left: 15px;
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
