<script lang="ts">
	import { isSidebarOpen } from '$lib/js/stores';
</script>

<button
	on:click={() => isSidebarOpen.set(!$isSidebarOpen)}
	aria-pressed={$isSidebarOpen ? 'true' : 'false'}
	aria-label="toggle sidebar"
	class="bg-transparent border-0 py-3 px-0 z-20 relative"
>
	<span></span>
</button>

<style>
	span {
		display: block;
		position: relative;
	}

	span,
	span::before,
	span::after {
		width: 25px;
		height: 1px;
		background-color: var(--color-foreground);
		transition:
			transform 350ms ease-in-out,
			opacity 200ms linear;
	}

	span::before,
	span::after {
		content: '';
		position: absolute;
		left: 0;
	}

	span::before {
		top: 7px;
	}

	span::after {
		bottom: 7px;
	}

	button[aria-pressed='true'] > span {
		transform: rotate(45deg);
	}

	button[aria-pressed='true'] > span::before {
		opacity: 0;
	}

	button[aria-pressed='true'] > span::after {
		transform: rotate(90deg) translateX(7px);
	}
</style>
