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
			A feature rich text sorter based on the unix sort, avaliable through vscode, npm and cli. You
			can use this on regular lists or markdown lists. It operates in a different way than most as
			it takes scope/indentation into account. This project was not made for programming related
			things like objects, imports or html, but in certain instances it can still sort them.
			<br /><br />There are many options, such as:
		</p>

		<ul class="options">
			<li>Case insensitive sort</li>
			<li class="web-special">Removing duplicates</li>
			<li>Reverse sort</li>
			<li class="both-special">Recursive sort</li>
			<li>Markdown list sort</li>
			<hr />
			<li>Natural sort</li>
			<li>Numerical sort</li>
			<li>Float sort</li>
			<li>Line length sort</li>
			<li>Random sort</li>
			<li>Sorting by regex</li>
		</ul>

		<p>
			The first section consists of universal modifiers and the second consists of actual sorters.
			Many sites and applications already have most of these, so why use this? The main reasons
			would be because this service provides more options, and an interface in which they can all be
			used together. Read the <a class="docs" href="/docs">documentation</a> for more.
			<br /> <br />
			If there's any issues, suggestions or questions, you can create a github issue or email me at sixskys@proton.me
		</p>
	</div>

	<IconBar />
</header>

<style lang="scss">
	@use '../colors.scss' as *;
	@use '../numerical.scss' as *;

	.options {
		margin-left: 30px;
		margin-top: 10px;
	}

	.options li {
		list-style: outside;
	}

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
		overflow: scroll;
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

	@media screen and (min-width: $size-2) {
		header {
			width: min-content;
			min-width: 400px;
		}

		:root {
			font-size: 17px;
		}
	}

	@media screen and (min-width: $size-2) and (min-height: 1220px) {
		nav ul {
			display: block;
		}
	}
</style>
