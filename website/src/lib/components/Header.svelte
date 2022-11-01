<script>
	import GithubIcon from './icons/GithubIcon.svelte';
	import NpmIcon from './icons/NPMIcon.svelte';
	import TerminalIcon from './icons/TerminalIcon.svelte';
	import VscodeIcon from './icons/VscodeIcon.svelte';
	import HamburgerMenu from './HamburgerMenu.svelte';
	import { isSidebarOpen } from '$lib/js/stores';

	const routes = {
		github: 'https://github.com/sixskys/scoped-sort',
		npm: 'https://www.npmjs.com/package/string-content-sort',
		cli: 'https://www.npmjs.com/package/string-content-sort-cli',
		vscode: 'https://marketplace.visualstudio.com/items?itemName=karizma.scoped-sort'
	};

	function closeSidebar() {
		isSidebarOpen.set(false);
	}
</script>

<!-- 
	have to use reload because when navigating to /docs /examples and coming
back to /, :global() and :root styles from /docs or /examples remain 
-->

<header data-sveltekit-reload>
	<h1>ScopedSort</h1>

	<div class="links">
		<div class="same-website-pages">
			<nav>
				<ul>
					<li><a on:click={closeSidebar} href="/docs">Docs</a></li>
					<li><a on:click={closeSidebar} href="/examples">Examples</a></li>
				</ul>
			</nav>
		</div>

		<div class="other-websites">
			<nav>
				<ul>
					<li><a on:click={closeSidebar} href={routes.github}>Github</a></li>
					<li><a on:click={closeSidebar} href={routes.vscode}>Vscode</a></li>
					<li><a on:click={closeSidebar} href={routes.npm}>NPM</a></li>
					<li><a on:click={closeSidebar} href={routes.cli}>CLI</a></li>
				</ul>
			</nav>
		</div>

		<HamburgerMenu />
	</div>

	<nav class:show={$isSidebarOpen}>
		<ul>
			<li><a on:click={closeSidebar} href="/docs">Docs</a></li>
			<li><a on:click={closeSidebar} href="/examples">Examples</a></li>
			<li class="has-icon">
				<a on:click={closeSidebar} href={routes.vscode} title="vscode package">
					<VscodeIcon size="1.4rem" />
					<span>Vscode</span>
				</a>
			</li>
			<li>
				<a on:click={closeSidebar} href={routes.github} title="github repo">
					<GithubIcon size="1.4rem" />
					<span>Github</span>
				</a>
			</li>
			<li>
				<a on:click={closeSidebar} href={routes.npm} title="npm package">
					<NpmIcon size="1.4rem" />
					<span>NPM</span>
				</a>
			</li>
			<li>
				<a on:click={closeSidebar} href={routes.cli} title="cli on npm">
					<TerminalIcon size="1.4rem" />
					<span>CLI</span></a
				>
			</li>
		</ul>
	</nav>
</header>

<style lang="scss">
	@use '../styles/sizes.scss' as *;

	.links {
		display: grid;
		align-items: center;
		grid-auto-flow: column;
		gap: 20px;
	}

	ul {
		display: flex;
		gap: 13px;
	}

	header > nav {
		display: flex;
		background-color: black;
		position: absolute;
		inset: 0;
		align-content: center;
		justify-content: center;
		transform: translateX(-100%);
		transition: transform 100ms ease-in;
		visibility: hidden;
	}

	header > nav.show {
		transform: translateX(0);
		visibility: visible;
	}

	header > nav ul {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		gap: 20px;
	}

	li {
		list-style-type: none;
		font-weight: 500;
	}

	.same-website-pages li {
		text-transform: none;
	}

	a[title] {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0.8em 1em;
		background-color: black;
		border-bottom: 2px solid black;
		color: white;
	}

	h1 {
		text-transform: uppercase;
		font-weight: 800;
	}

	h1,
	li {
		font-size: 1rem;
	}

	.same-website-pages,
	.other-websites {
		display: none;
	}

	@media screen and (min-width: $small-screen) {
		.same-website-pages {
			display: block;
			justify-self: flex-end;
		}
	}

	@media screen and (min-width: $medium-screen) {
		.other-websites {
			display: block;
		}

		header :global(button) {
			display: none;
		}

		header > nav.show {
			transform: translateX(-100%);
			visibility: hidden;
		}
	}

	@media (prefers-color-scheme: dark) {
		header {
			background-color: var(--clr-bg-primary);
			border-bottom-color: var(--clr-bg-secondary);
			color: var(--clr-bg-tertiary-content);
		}
	}
</style>
