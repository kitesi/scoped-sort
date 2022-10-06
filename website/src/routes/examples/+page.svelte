<script lang="ts">
	import DocStyleSidebar from '$lib/components/DocStyleSidebar.svelte';
	import PrismJS from 'prismjs';
	import { onMount } from 'svelte';

	import { transformToId } from '../../transform-to-id';
	import { previews } from '../../previews.js';
	import 'prismjs/plugins/line-highlight/prism-line-highlight.js';

	import type { PreviewTest } from '../../previews.js';
	import type { Heading } from '../Heading';

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
				"This is an example of how this program's indentation awareness works. You might see that certain lines are highlighted, those lines are the actual lines that are being sorted. It will not work if you sort the whole text. (line highlights not currently working)",
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
			description:
				"This in example which show's the possibilities of section-seperator. Note this has a selection in the content which excludes the first and last line (working on styling line highlights).",
			preview: previews.sectionSeperatorHtml
		}
	];

	onMount(() => {
		setTimeout(() => PrismJS.highlightAll(), 200);
	});
</script>

<main>
	<DocStyleSidebar headings={examples} />
	<section>
		<div>
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
				<div class="pre-container">
					<pre data-line={preview.display?.highlightRange} spellcheck="false"><code
							class={'language-' + (preview.language || '')}>{input}</code
						></pre>
					<pre spellcheck="false"><code class={'language-' + (preview.language || '')}
							>{output}</code
						></pre>
				</div>
			{/each}
		</div>
	</section>
</main>

<style lang="scss">
	@use '../../lib/styles/doc-style-page.scss';
	@use '../../lib/styles/sizes.scss' as *;

	main {
		--sidebar-width: 400px;
	}

	.pre-container {
		display: flex;
		flex-wrap: wrap;
		gap: 1em;
		margin-top: 1em;
	}

	pre {
		flex: 1;
		min-width: 20em;
		margin: 0 !important;
	}

	section > div {
		--max-width: 80rem;
	}
</style>
