<!-- credit to: https://www.youtube.com/watch?v=b3OKONiAA80&t=211s -->
<script lang="ts">
	import { isSidebarOpen } from '../../stores';
	export let maxWidth: boolean;
</script>

<button
	on:click={() => isSidebarOpen.set(!$isSidebarOpen)}
	aria-pressed={$isSidebarOpen ? 'true' : 'false'}
	aria-label="toggle sidebar"><span /></button
>

<div class:max-width={maxWidth}><slot /></div>

<style lang="scss">
	@use '../styles/colors.scss' as *;
	@use '../styles/numerical.scss' as *;

	div {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		transform: translateX(-100%);
		visibility: hidden;
		transition: 100ms ease-in;
		z-index: 2;
		border-right: 1px solid $c-black-2;
	}

	.max-width {
		width: 100%;
	}

	$hamburger-gap: 7px;
	button {
		position: absolute;
		background-color: transparent;
		inset: $hamburger-gap 0 auto auto;
		border: none;
		padding: 15px;
		z-index: 3;
	}

	span {
		display: block;
		position: relative;
	}

	span,
	span::before,
	span::after {
		width: 2em;
		height: 3px;
		background-color: white;
		transition: transform 350ms ease-in-out, opacity 200ms linear;
	}

	span::before,
	span::after {
		content: '';
		position: absolute;
		left: 0;
	}

	span::before {
		top: $hamburger-gap;
	}

	span::after {
		bottom: $hamburger-gap;
	}
	button[aria-pressed='true'] ~ div {
		transform: translateX(0);
		visibility: visible;
		box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.77);
		-webkit-box-shadow: 27px 0px 43px -3px 100vmax rgba(0, 0, 0, 0.77);
		-moz-box-shadow: 27px 0px 43px -3px 100vmax rgba(0, 0, 0, 0.77);
	}

	button[aria-pressed='true'] > span {
		transform: rotate(45deg);
	}

	button[aria-pressed='true'] > span::before {
		opacity: 0;
	}

	button[aria-pressed='true'] > span::after {
		transform: rotate(90deg) translateX($hamburger-gap);
	}

	@media screen and (min-width: $size-1) {
		div {
			position: static;
			transform: translateX(0);
			visibility: visible;
		}

		button[aria-pressed='true'] ~ div {
			box-shadow: none;
			-webkit-box-shadow: none;
			-moz-box-shadow: none;
		}

		button {
			opacity: 0;
			pointer-events: none;
		}

		.max-width {
			width: auto;
		}
	}
</style>
