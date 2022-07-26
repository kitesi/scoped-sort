<script lang="ts">
	import Icon from '$lib/Icon.svelte';
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

	<div class="content">
		<p>
			A feature rich text sorter based on the unix sort, avaliable through vscode, npm and cli. You
			can use this on regular lists or markdown lists. This project was not made for programming
			related things like objects, imports or html, but in certain instances it can still sort them.
			<br /><br />There are many options, such as:
		</p>

		<nav class="options">
			<ul>
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
		</nav>

		<p>
			The first section consists of universal modifiers and the second consists of actual sorters.
			Many sites and applications already have most of these, so why use this? The main reasons
			would be because this service provides more options, and an interface in which they can all be
			used together. Read the <a class="docs" href="/docs">documentation</a> for more.
			<br /> <br />
			If there's any issues or questions, you can create a github issue or email me at karizma7@protonmail.com
		</p>
	</div>
	<nav class="icons">
		<ul>
			<li><a href="/github"><Icon width="1.4rem" height="1.4rem" name="github" /></a></li>
			<li><a href="/vscode"><Icon width="1.4rem" height="1.4rem" name="edit" /></a></li>
			<li><a href="/npm"><Icon width="1.4rem" height="1.4rem" name="package" /></a></li>
			<li><a href="/cli"><Icon width="1.4rem" height="1.4rem" name="terminal" /></a></li>
		</ul>
	</nav>
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

	.icons ul {
		display: flex;
		justify-content: space-between;
		margin-top: 20px;
	}

	.icons li {
		text-decoration: none;
		list-style-type: none;
	}

	.secondary-text {
		color: $primary-accent;
	}

	// :global(.secondary-text svg) {
	// 	transform: translate(-9px, 0px) rotate(134deg) !important;
	// }

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
		display: flex;
		font-family: Ordinary, Roboto, Arial;
		font-size: 4rem;
		align-items: center;
		justify-content: space-between;
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

	li > a {
		color: $primary-accent;
	}

	p > a {
		color: $c-blue-1;
		text-decoration: none;
	}

	a:hover {
		color: $c-blue-1;
		text-decoration: underline;
		cursor: pointer;
	}

	@media screen and (min-width: $size-1) {
	}

	@media screen and (min-width: $size-2) {
		header {
			width: min-content;
			min-width: 400px;
		}
	}
</style>
