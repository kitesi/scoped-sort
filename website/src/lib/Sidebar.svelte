<script lang="ts">
	import { transformToId } from '../transform-to-id';
	import type { Heading } from '../routes/Heading';
	export let headings: Heading[];

	let isChecked = false;

	function removeChecked(ev: Event) {
		isChecked = false;

		// const target = ev.target as HTMLAnchorElement;
		// const id = target.href.split('#')[1];
		// document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<input type="checkbox" id="menu-toggle" bind:checked={isChecked} />
<label for="menu-toggle">
	<span class="top" />
	<span class="middle" />
	<span class="bottom" />
</label>
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
				<a on:click={removeChecked} href={'#' + transformToId(heading.name)}>{heading.name}</a>
				{#if heading.children}
					<ul class="second-lebel">
						{#each heading.children as subheading}
							<li class="second-level">
								<a on:click={removeChecked} href={'#' + transformToId(subheading.name)}
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

<style lang="scss">
	@use '../colors.scss' as *;
	@use '../numerical.scss' as *;

	input {
		opacity: 0;
		position: absolute;
	}

	div {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		max-width: 10rem;
		min-width: 280px;
		height: 100%;
		background-color: darken($c-black-2, 5%);
		transform: translateX(-100%);
		transition: 100ms linear;
		padding: 15px;
		overflow: auto;
		z-index: 2;
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

	input:checked ~ div {
		transform: translateX(0);
		box-shadow: 27px 0px 43px -3px rgba(0, 0, 0, 0.27);
		-webkit-box-shadow: 27px 0px 43px -3px rgba(0, 0, 0, 0.27);
		-moz-box-shadow: 27px 0px 43px -3px rgba(0, 0, 0, 0.27);
	}

	span {
		display: block;
		top: 20px;
		right: 0px;
	}

	span {
		display: block;
		width: 1.8rem;
		height: 2px;
		background-color: white;
		transition-duration: 100ms;
	}

	label {
		display: flex;
		position: absolute;
		right: 20px;
		top: 20px;
		flex-direction: column;
		justify-content: space-between;
		height: 16px;
		z-index: 1;
		cursor: pointer;
		// padding: 20px;
	}

	input:checked ~ label .middle {
		opacity: 0;
	}

	input:checked ~ label .top {
		transform: rotate(45deg);
	}

	input:checked ~ label .bottom {
		transform: rotate(135deg) translate(-10px, 10px);
	}

	a {
		color: inherit;
	}

	@media screen and (min-width: $size-1) {
		div,
		input:checked ~ div {
			position: static;
			transform: translateX(0);
			box-shadow: none;
			-webkit-box-shadow: none;
			-moz-box-shadow: none;
		}

		label {
			opacity: 0;
		}
	}
</style>
