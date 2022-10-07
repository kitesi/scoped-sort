<script lang="ts">
	import { isSidebarOpen } from '$lib/js/stores';
</script>

<button
	on:click={() => isSidebarOpen.set(!$isSidebarOpen)}
	aria-pressed={$isSidebarOpen ? 'true' : 'false'}
	aria-label="toggle sidebar"><span /></button
>

<style lang="scss">
	@use '../styles/sizes.scss' as *;

	$hamburger-gap: 7px;

	button {
		background-color: transparent;
		border: none;
		padding: 15px 0;
		z-index: 3;
	}

	span {
		display: block;
		position: relative;
	}

	span,
	span::before,
	span::after {
		width: 32px;
		height: 3px;
		background-color: var(--clr-bg-primary-content);
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

	button[aria-pressed='true'] > span {
		transform: rotate(45deg);
	}

	button[aria-pressed='true'] > span::before {
		opacity: 0;
	}

	button[aria-pressed='true'] > span::after {
		transform: rotate(90deg) translateX($hamburger-gap);
	}
</style>
