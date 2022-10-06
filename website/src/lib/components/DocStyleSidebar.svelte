<script lang="ts">
	import { transformToId } from '../../transform-to-id';
	import { isSidebarOpen } from '../../stores';

	import type { Heading } from '../../routes/Heading';
	import HamburgerMenu from './HamburgerMenu.svelte';

	export let headings: Heading[];

	function closeSidebar() {
		isSidebarOpen.set(false);
	}
</script>

<div>
	<HamburgerMenu />
</div>

<nav class:show={$isSidebarOpen}>
	<ul class="first-level">
		<li>
			<a href="/" data-sveltekit-reload>Home</a>
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
</nav>

<style lang="scss">
	@use '../styles/sizes.scss' as *;

	div {
		position: absolute;
		top: 1em;
		right: 1em;
		z-index: 2;
	}

	nav {
		position: absolute;
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
	}

	nav.show {
		transform: translateX(0);
		box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.77);
		-webkit-box-shadow: 27px 0px 43px -3px 100vmax rgba(0, 0, 0, 0.77);
		-moz-box-shadow: 27px 0px 43px -3px 100vmax rgba(0, 0, 0, 0.77);
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

	.first-level {
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
