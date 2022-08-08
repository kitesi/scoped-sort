<script>
	import IconBar from './IconBar.svelte';
</script>

<header>
	<h1>
		<div>
			<span>Scoped</span>
			<span class="secondary-text"
				>Sort
				<!-- <Icon name="hexagon" width="40px" height="40px" direction="se" /> -->
				<!-- <img src="/hexagon.png" alt="" /> -->
			</span>
		</div>
		<!-- <img src="/favicon.png" alt="icon" /> -->
	</h1>

	<nav>
		<ul>
			<li><a href="/docs">Documentation</a></li>
			<li><a href="/examples">Examples</a></li>
		</ul>
	</nav>

	<div class="centent">
		<p>
			A feature rich text sorter based on the unix sort. Avaliable on vscode, npm, cli, and a
			website. You can use this on regular lists or markdown lists. It operates in a different way
			than most as it takes scope/indentation into account. This project was not made for
			programming related things like objects, imports or html, but in certain instances it can
			still sort them.
		</p>

		<p>
			There are many sites and applications already have most of these, so why use this? 1. this
			service provides more options, and 2. it provides an interface in which they can all be used
			together. Read the <a class="docs" href="/docs">documentation</a> for more.
			<br /> <br />
			If there's any issues, suggestions or questions, you can create a github issue or email me at sixskys@proton.me
		</p>
	</div>

	<IconBar />
</header>

<style lang="scss">
	@use '../colors.scss' as *;
	@use '../numerical.scss' as *;
	.secondary-text {
		color: $primary-accent;
	}

	// :global(.secondary-text svg) {
	// 	transform: translate(-9px, 0px) rotate(134deg) !important;
	// }

	nav ul {
		display: flex;
		flex-direction: row;
		gap: 10px;
		margin-top: 20px;
	}

	nav li {
		list-style-type: none;
	}

	header {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 20px;
		background-color: darken($c-black-1, 3%);
		color: white;
	}

	h1 {
		// display: flex;
		font-family: Ordinary, Roboto, Arial;
		font-size: 4rem;
		// align-items: center;
		// justify-content: space-between;
		line-height: 3.2rem;
		font-weight: 200;
	}

	hr {
		margin: 10px 0;
		border-color: white;
		transform: translateX(-30px);
		max-width: 80%;
	}

	h1 div {
		text-transform: uppercase;
	}

	h1 span {
		display: block;
	}

	p {
		font-size: 1.2rem;
		margin-top: 20px;
	}

	@media screen and (min-width: $size-1) and (min-height: 1220px) {
		nav ul {
			display: block;
		}
	}

	@media screen and (min-width: $size-2) and (max-height: 1480px) {
		nav ul {
			display: flex;
		}
	}

	@media screen and (min-width: $size-2) {
		header {
			width: min-content;
			min-width: 400px;
			height: 100%;
			overflow: auto;
		}

		:root {
			font-size: 17px;
		}
	}
	@media screen and (min-width: $size-3) {
		header {
			min-width: 450px;
		}
	}
</style>
