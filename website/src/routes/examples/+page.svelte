<!-- 
    preview is the programmer version of the entry 
    example will be the user version which has the
    formal name and description
-->
<script lang="ts">
	import Sidebar from '$lib/components/DocStyleSidebar.svelte';
	import PrismJS from 'prismjs';
	import 'prismjs/plugins/line-highlight/prism-line-highlight.js';
	import { transformToId } from '../../transform-to-id';
	import { previews } from '../../previews.js';

	import type { PreviewTest } from '../../previews.js';
	import type { Heading } from '../Heading';
	import { onMount } from 'svelte';

	interface ExampleHeading extends Heading {
		preview: PreviewTest;
		description?: string;
	}

	// credit to https://stackoverflow.com/a/67243723/15021883
	const kebabize = (text: string) =>
		text.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());

	const examples: ExampleHeading[] = [
		{
			name: 'General Example',
			description: 'A general day to day nested markdown list.',
			preview: previews.generalExample
		},
		{
			name: 'Removing Duplicates + Reverse',
			preview: previews.uniqueReverse
		},
		{
			name: 'Numerical Sort',
			description: 'This sort will sort the lines based on the number in each line.',
			preview: previews.numberNormal
		},
		{
			name: 'Switch Inner Case Statements',
			description:
				"This is an example of how this program's indentation awareness works. You might see that certain lines are highlighted, those lines are the actual lines that are being sorted. It will not work if you sort the whole text.",
			preview: previews.switchCaseNormal
		},
		{
			name: 'Sorting Imports',
			description:
				'Here we can see how the regex option can help us sort using text that is not at the start of the line.',
			preview: previews.sortImportsNormal
		},
		{
			name: 'Section Seperator HTML',
			description: "This in example which show's the possibilities of section-seperator.",
			preview: previews.sectionSeperatorHtml
		}
	];

	onMount(() => {
		setTimeout(() => PrismJS.highlightAll(), 200);
	});
</script>

<main>
	<Sidebar headings={examples} />

	<section>
		{#each examples as example (example.name)}
			<h2 id={transformToId(example.name)}>{example.name}</h2>
			<p>{example.description || ''}</p>
			{@const preview = example.preview}
			{@const input = preview.display?.input || preview.input}
			{@const output = preview.display?.output || preview.output}
			{#if preview.options}
				<ul>
					{#each Object.entries(preview.options) as [key, value]}
						<li><code>{kebabize(key)}</code> = <code>{value}</code></li>
					{/each}
				</ul>
			{/if}
			<div>
				<pre data-line={preview.display?.highlightRange} spellcheck="false"><code
						class={'language-' + (preview.language || '')}>{input}</code
					></pre>
				<pre spellcheck="false"><code class={'language-' + (preview.language || '')}>{output}</code
					></pre>
			</div>
		{/each}
	</section>
</main>

<style lang="scss">
	@use '../../lib/styles/numerical.scss' as *;
	@use '../../lib/styles/doc-style-page.scss';

	@media screen and (min-width: $size-2) {
		section div {
			display: grid;
			grid-template-columns: 1fr 1fr;
			// align-items: flex-start;
			gap: 20px;
		}
	}
</style>
