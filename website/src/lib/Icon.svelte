<!-- https://github.com/the-pudding/svelte-starter/blob/svelte/src/components/helpers/Icon.svelte -->
<script lang="ts">
	// @ts-ignore
	import feather from 'feather-icons';
	export const directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];

	export let name: string;
	export let direction = 'n';
	export let strokeWidth = '2';
	export let stroke = 'currentColor';
	export let width = '1em';
	export let height = '1em';

	$: icon = feather.icons[name];
	$: rotation = directions.indexOf(direction) * 45;
	$: if (icon) {
		if (stroke) icon.attrs['stroke'] = stroke;
		if (strokeWidth) icon.attrs['stroke-width'] = strokeWidth;
	}
</script>

{#if icon}
	<svg {...icon.attrs} style="width: {width}; height: {height}; transform: rotate({rotation}deg);">
		<g>
			{@html icon.contents}
		</g>
	</svg>
{/if}

<style>
	svg {
		overflow: visible;
	}
</style>
