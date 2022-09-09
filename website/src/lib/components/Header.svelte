<script>
	import Icon from './Icon.svelte';
	import Sidebar from './Sidebar.svelte';

	const routes = {
		github: 'https://github.com/sixskys/scoped-sort',
		npm: 'https://www.npmjs.com/package/string-content-sort',
		cli: 'https://www.npmjs.com/package/string-content-sort-cli',
		vscode: 'https://marketplace.visualstudio.com/items?itemName=karizma.scoped-sort'
	};
</script>

<header>
	<h1>
		<span>Scoped</span><span class="secondary-text">Sort</span>
	</h1>

	<Sidebar>
		<div>
			<nav>
				<ul>
					<li><a href="/docs">Docs</a></li>
					<li><a href="/examples">Examples</a></li>
					<li>
						<a href={routes.github} title="github repo"
							><Icon width="1.4rem" height="1.4rem" stroke="white" name="github" /> Github</a
						>
					</li>
					<li>
						<a href={routes.vscode} title="vscode package"
							><Icon width="1.4rem" height="1.4rem" stroke="white" name="edit" /> VScode</a
						>
					</li>
					<li>
						<a href={routes.npm} title="npm package"
							><Icon width="1.4rem" height="1.4rem" stroke="white" name="package" /> NPM</a
						>
					</li>
					<li>
						<a href={routes.cli} title="cli on npm"
							><Icon width="1.4rem" height="1.4rem" stroke="white" name="terminal" /> CLI</a
						>
					</li>
				</ul>
			</nav>
		</div>
	</Sidebar>
</header>

<style lang="scss">
	@use '../styles/colors.scss' as *;
	@use '../styles/numerical.scss' as *;
	.secondary-text {
		color: $primary-accent;
	}

	div {
		display: grid;
		grid-template-rows: 1fr auto;
		justify-content: center;
		align-items: center;
		background-color: ($c-black-1);
		width: 100%;
		height: 100%;
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: 40px;
		align-content: center;
		justify-content: space-around;
		text-align: start;
	}

	li {
		list-style-type: none;
		font-weight: 800;
		text-transform: uppercase;
		font-size: 1.2rem;
	}

	a[title] {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	header {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 10px;
		background-color: lighten($c-black-1, 4%);
		border-bottom: 2px solid $c-black-2;
		color: white;
	}

	h1 {
		font-family: Ordinary, Roboto, Arial;
		font-size: 2rem;
		font-weight: 200;
	}

	h1 span {
		margin-right: 2px;
	}
</style>
