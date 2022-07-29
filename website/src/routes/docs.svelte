<script lang="ts">
	import Sidebar from '$lib/Sidebar.svelte';
	import Prism from 'prismjs';
	import { transformToId } from '../transform-to-id';
	import { onMount } from 'svelte';

	import type { Heading } from './Heading';

	interface DocumentionHeading extends Heading {
		content?: string;
		children?: {
			name: string;
			content: string;
			type: string;
			objectPropertyName: string;
			cliPropertyName: string;
		}[];
	}

	const link = (href: string) => `<a href="#${href}">${href}</a>`;
	const bold = (text: string) => `<b>${text}</b>`;

	const codeBlock = (codeExample: CodeExample) =>
		`<pre spellcheck="false"><code class="language-${codeExample.language || 'no'}">${
			codeExample.content
		}</code></pre>`;
	const inlineCode = (text: string) => `<code>${text}</code>`;

	interface CodeExample {
		content: string;
		language?: string;
	}

	const codeExamples: CodeExample[] = [
		{
			content: `// { sort-start --regex /['"]/ }
import react from 'react';
import express from 'express';
import isIsOdd from 'is-is-odd';
// { sort-end }`,
			language: 'javascript'
		}
	];

	const headings: DocumentionHeading[] = [
		{
			name: 'Introduction',
			content: `This page will serve as a reference for the website, the npm package, the cli and vscode.
Since three of those are programming related, it will lean towards more programming type
of documentation, but it should still be easy to follow.`
		},
		{
			name: 'Universal Modifiers',
			content: 'These options work on everything.',
			children: [
				{
					name: 'Case Insensitive',
					content: 'Makes the sort case insensitively.',
					type: 'boolean',
					objectPropertyName: '.caseInsensitive',
					cliPropertyName: '--caseinsensitive | -i'
				},
				{
					name: 'Recursive',
					content: `This project takes scope/indentation into account. Most sorters just read line
by line, so when you have nested lists you end up with undesired sorts. <br/><br/>

This program by default keeps nested content in place and does not sort the inner items, but setting
this option to true will sort the inner items.`,
					type: 'boolean',
					objectPropertyName: '.recursive',
					cliPropertyName: '--recursive | -r'
				},
				{
					name: 'Reverse',
					content: 'Reverses the sort after completely finishing.',
					type: 'boolean',
					objectPropertyName: '.reverse',
					cliPropertyName: '--reverse | -s'
				},
				{
					name: 'Unique',
					content: 'Removes duplicate lines.',
					type: 'boolean',
					objectPropertyName: '.unique',
					cliPropertyName: '--unique | -u'
				}
			]
		},
		{
			name: 'Sorters',
			content: `You can only have one sorter. There is no such thing as a fallback sorting here, if two lines are
equal in their sort position, they won't use the second sorter if specified.
Example: you might expect ${link('length-sort')} and ${link(
				'numerical-sort'
			)} to work as in, sort by
length, and fallback to sort numerically if two lines have the same length; but
that will not work.`,
			children: [
				{
					name: 'Numerical Sort',
					content: `Sorts based on the number in each line. All the lines
which do not have a number will be left in place.`,
					type: 'boolean',
					objectPropertyName: '.sortNumerically',
					cliPropertyName: '--sort-numerically | -n'
				},
				{
					name: 'Natural Sort',
					content: 'Sorts based on natural sort.',
					type: 'boolean',
					objectPropertyName: '.sortNaturally',
					cliPropertyName: '--sort-naturally | -e'
				},
				{
					name: 'Float Sort',
					content: `Sorts based on the float in each line. All the lines
which do not have a float will be left in place.`,
					type: 'boolean',
					objectPropertyName: '.sortByFloat',
					cliPropertyName: '--sort-by-float | -f'
				},
				{
					name: 'Length Sort',
					content: 'Sorts based on the length of each line. Short to long.',
					type: 'boolean',
					objectPropertyName: '.sortByLength',
					cliPropertyName: '--sort-by-length | -l'
				},
				{
					name: 'Random Sort',
					content: 'Sorts randomly (psuedo).',
					type: 'boolean',
					objectPropertyName: '.sortRandomly',
					cliPropertyName: '--sort-randomly | -z'
				}
			]
		},
		{
			name: 'Other',
			children: [
				{
					name: 'Markdown',
					content: `Treats the text as a markdown list. You won't need this
option for most markdown lists but in certain instances
you will.`,
					type: 'boolean',
					objectPropertyName: '.markdown',
					cliPropertyName: '--markdown | -m'
				},
				{
					name: 'Regex',
					content: `a regex to match text in each item/line, the sorter will sort based on the text
${bold('after')} the match (unless ${link(
						'use-matched-regex'
					)} is checked). Text that do not match will
be left in place, and will be at the top. The regex language is javascript.`,
					type: 'RegExp',
					objectPropertyName: '.regex',
					cliPropertyName: '--regex'
				},
				{
					name: 'Use Matched Regex',
					content: `Combined with ${link(
						'regex'
					)}, this will instead sort using the matched text rather than the text after 
the matched text.`,
					type: 'boolean',
					objectPropertyName: '.useMatchedRegex',
					cliPropertyName: '--use-matched-regex'
				},
				{
					name: 'Section Seperator',
					content: `This is a way to tell the program when to start a new section as opposed to just
comparing indentations.`,
					type: 'RegExp',
					objectPropertyName: '.sectionSeperator',
					cliPropertyName: '--section-seperator'
				}
			]
		},
		{
			name: 'Combinations',
			content: `Since this program has a lot of arguments, you might need
			to know how they combine. As stated before, you can only have one
			sorter. There is no such thing as a fallback sorting here.`
		},
		{
			name: 'Sort Comments',
			content: `Sort comments are a way for this program to automatically recognize a section to sort and it's options. This can help if you have a list
			that is constantly being updated, and you don't want to have to keep manually sorting. In the vscode extension, it allows the user
			to turn on a feature called 'sort-on-save' which will like it states, sort the section on save. The cli application can also use this feature to sort sections
			by command. ${codeBlock(
				codeExamples[0]
			)} As you can see there are two lines to start and end it. The first line (sort-start) has
			 to have ${inlineCode(
					'{ sort-start }'
				)} some where in the line. Does not matter where, start, in between or end. Same for the second (sort-end) with ${inlineCode(
				'{ sort-end }'
			)}. Spacing and casing do matter. ${inlineCode('{sort-start}')} or ${inlineCode(
				'{ sort-START }'
			)} would not work. In the sort-start line you can also specify options after the text ${'sort-start'}. Just make sure you have a space after that text, and before the ${inlineCode(
				'}'
			)}. It uses the same syntax of the cli program, just make sure to have a space before. If you are sorting multiple files
			at once, and want to ignore a particular file, you can include a line with the text ${inlineCode(
				'{ sort-ignore-file }'
			)}. It follows the same rules of ${inlineCode('sort-start')} and ${inlineCode('sort-end')}.`
		}
	];

	onMount(() => {
		Prism.highlightAll();
	});
</script>

<main>
	<Sidebar {headings} />

	<section>
		{#each headings as heading (heading.name)}
			<h2 id={transformToId(heading.name)}>{heading.name}</h2>
			<p>{@html heading.content || ''}</p>
			{#if heading.children}
				{#each heading.children as subheading}
					<h3 id={transformToId(subheading.name)}>{subheading.name}</h3>
					<ul>
						<li>type: <code>{subheading.type}</code></li>
						<li>object property: <code>{subheading.objectPropertyName}</code></li>
						<li>cli parameter: <code>{subheading.cliPropertyName}</code></li>
					</ul>
					<p>{@html subheading.content}</p>
				{/each}
			{/if}
			{#if heading.name === 'Combinations'}
				<ul>
					<li>
						<code>markdown</code>, <code>unique</code>, <code>recursive</code>, <code>reverse</code>
						work on everything
					</li>
					<li>
						<code>case-insensitive</code> and <code>unique</code>: removes duplicates case
						insensitively
					</li>
					<li>
						<code>regex</code> and <code>case-insensitive</code>: doesn't make the regex case
						insensitive, only makes the sort insensitive
					</li>
					<li>
						<code>regex</code> and <code>sort-by-length</code>: sorts by the length of the text
						<b>after</b> the matched text insensitive
					</li>
					<li>
						<code>regex</code>, <code>sort-by-length</code> and <code>use-matched-regex</code>:
						sorts by the length of the text matched
					</li>
					<li>
						<code>regex</code> and <code>sort-numerically</code>: tries to parse the text
						<b>after</b>
						the matched text as a number
					</li>
					<li>
						<code>regex</code>, <code>sort-numerically</code> and <code>use-matched-regex</code>:
						tries to parse the matched text as a number
					</li>
					<li>
						<code>regex</code> and <code>sort-by-float</code>: tries to parse the text <b>after</b>
						the matched text as a float
					</li>
					<li>
						<code>regex</code>, <code>sort-by-float</code> and <code>use-matched-regex</code>: tries
						to parse the matched text as a float
					</li>
				</ul>
				<p>These do not compute and will throw an error:</p>
				<ul>
					<li>Using more than one sorter</li>
					<li><code>regex</code> and <code>sort-naturally</code></li>
					<li><code>regex</code> and <code>sort-randomly</code></li>
					<li>
						<code>case-insensitive</code> when options include one of:
						<code>sort-numerically</code>,
						<code>sort-naturally</code>,
						<code>sort-randomly</code>,
						<code>sort-by-float</code>,
						<code>sort-by-length</code> but does not include <code>unique</code>
					</li>
				</ul>
			{/if}
		{/each}
	</section>
</main>

<style lang="scss">
	@use '../colors.scss' as *;
	@use '../numerical.scss' as *;
	@use '../doc-style-page.scss';

	p {
		margin: 20px 0;
		line-height: 1.6rem;
	}
</style>
