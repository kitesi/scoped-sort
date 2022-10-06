<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { sort } from 'string-content-sort';

	import { isSidebarOpen } from '../stores';

	import type { Options } from 'string-content-sort';

	function handleSubmit(ev: SubmitEvent) {
		const options: Options = {
			...universalModifiersBindings,
			useMatchedRegex
		};

		if (sorterBinding) {
			// @ts-ignore
			options[sorterBinding] = true;
		}

		if (regex) {
			const attempt = parseStringAsRegex(regex);

			if (attempt) {
				options.regexFilter = attempt;
			}
		}

		if (sectionSeperator) {
			const attempt = parseStringAsRegex(sectionSeperator);

			if (attempt) {
				options.sectionSeperator = attempt;
			}
		}

		sortingText = sort(sortingText, options);
	}

	function parseStringAsRegex(arg: string) {
		let regexContent = arg;

		if (arg.startsWith('/') && arg.endsWith('/')) {
			regexContent = arg.slice(1, arg.length - 1);
		}

		try {
			return new RegExp(regexContent);
		} catch (e) {
			//todo
			return;
		}
	}

	const universalModifiers = [
		{
			name: 'markdown',
			label: 'Markdown'
		},
		{
			name: 'unique',
			label: 'Unique'
		},
		{
			name: 'recursive',
			label: 'Recursive'
		},
		{
			name: 'reverse',
			label: 'Reverse'
		},
		{
			name: 'caseInsensitive',
			label: 'Case Insensitive'
		}
	];

	const sorters = [
		{
			name: 'normal',
			label: 'Normal'
		},
		{
			name: 'sortNaturally',
			label: 'Natural'
		},
		{
			name: 'sortNumerically',
			label: 'Numerical'
		},
		{
			name: 'sortRandomly',
			label: 'Random'
		},
		{
			name: 'sortByFloat',
			label: 'Float'
		},
		{
			name: 'sortByLength',
			label: 'Length'
		}
	];

	const universalModifiersBindings: { [k: string]: boolean } = {
		markdown: false,
		unique: false,
		recursive: false,
		reverse: false,
		caseInsensitive: false
	};

	let sortingText = '';
	let sorterBinding = '';
	let regex = '';
	let sectionSeperator = '';
	let useMatchedRegex = false;
</script>

<div class="main-container">
	<Header />
	<!-- temporary solution for disabling tabing on form elements since modal covers everything -->
	<main style="display: {$isSidebarOpen ? 'none' : 'grid'};">
		<form on:submit|preventDefault={handleSubmit}>
			<div>
				<h2>About</h2>
				<p>
					Scoped Sort is a tool to help sort text. It differs from other text sorters by seperating
					items with respect to indentation. It has many options and is implemented on npm, the
					command line, vscode and here.
				</p>

				<h2>Universal Modifiers</h2>
				<h3>Don't understand this? Read the <a href="/docs#universal-modifiers">docs.</a></h3>

				<div class="modifiers">
					{#each universalModifiers as modifier (modifier.name)}
						<div>
							<input
								bind:checked={universalModifiersBindings[modifier.name]}
								type="checkbox"
								id={modifier.name}
							/>
							<label for={modifier.name}>{modifier.label}</label>
						</div>
					{/each}
				</div>

				<h2>Sorters</h2>
				<h3>Don't understand this? Read the <a href="/docs#sorters">docs.</a></h3>

				<div class="sorters">
					{#each sorters as sorter}
						<div>
							<input
								type="radio"
								name="sorter"
								id={sorter.name}
								value={sorter.name}
								bind:group={sorterBinding}
							/>
							<label for={sorter.name}>{sorter.label}</label>
						</div>
					{/each}
				</div>

				<h2>Other Settings</h2>
				<h3>Don't understand this? Read the <a href="/docs#other">docs.</a></h3>

				<div class="other">
					<div>
						<label for="regex">Regex Filter:</label>
						<div class="use-matched-regex-container">
							<label for="use-matched-regex">Use Matched: </label>
							<input
								type="checkbox"
								bind:checked={useMatchedRegex}
								name="use-matched-regex"
								id="use-matched-regex"
							/>
						</div>
						<input type="text" bind:value={regex} name="regex" id="regex" />
					</div>
					<div class="section-seperator-container">
						<label for="section-seperator">Section Seperator: </label>
						<input
							type="text"
							bind:value={sectionSeperator}
							name="section-seperator"
							id="section-seperator"
						/>
					</div>
				</div>
			</div>

			<div>
				<textarea spellcheck="false" bind:value={sortingText} class="input" />
				<button type="submit">Modify</button>
				<div class="error">
					<p
						class:show={regex &&
							(sorterBinding === 'sortNaturally' || sorterBinding === 'sortRandomly')}
					>
						Can't use regex with sort-naturally or sort-randomly
					</p>
					<p
						class:show={universalModifiersBindings.caseInsensitive &&
							sorterBinding !== 'normal' &&
							sorterBinding !== '' &&
							!universalModifiersBindings.unique}
					>
						Can't use case-insensitive when sorter is not the default sorter and does not use the
						unique modifier
					</p>
				</div>
			</div>
		</form>
	</main>
</div>

<style lang="scss">
	@use '../lib/styles/sizes.scss' as *;

	main,
	.main-container {
		height: 100%;
	}

	.main-container {
		display: flex;
		flex-direction: column;
		overflow: auto;
	}

	a {
		color: var(--clr-link);
	}

	a:hover {
		text-decoration: underline;
	}

	h2 {
		font-weight: 800;
		font-size: 2rem;
	}

	h2:not(:first-child) {
		margin-top: 1rem;
	}

	h3 {
		font-weight: 500;
		font-size: 0.95rem;
		margin-bottom: 1rem;
	}

	form {
		padding: 18px;
	}

	form > div > p {
		margin-block: 1em;
		max-width: 60ch;
	}

	form > div > div {
		width: 100%;
	}

	form > div > div > div {
		position: relative;
	}

	.modifiers :focus-within label,
	.sorters :focus-within label,
	.modifiers label:active,
	.sorters label:active,
	input[type='text']:focus,
	textarea:focus,
	button[type='submit']:focus {
		outline: 0.2em solid var(--clr-accent-content);
	}

	input[type='checkbox']:not(#use-matched-regex):focus,
	input[type='radio']:focus {
		outline: none;
	}

	input[type='checkbox']:not(#use-matched-regex),
	input[type='radio'] {
		position: absolute;
		appearance: none;
	}

	.modifiers,
	.sorters {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.6em;
		max-width: 24.8rem;
	}

	.modifiers div:last-child {
		grid-column: 2/4;
	}

	.modifiers label,
	.sorters label {
		display: block;
		padding-block: 0.5em;
		border: 0.1em solid var(--clr-bg-secondary);
		font-weight: 600;
		font-size: 1.1rem;
		border-radius: 3px;
		width: 100%;
		max-width: 12.5rem;
		text-align: center;
		cursor: pointer;
		transition: background-color 200ms ease-in;
		-webkit-user-select: none; /* Safari */
		-moz-user-select: none; /* Firefox */
		-ms-user-select: none; /* IE10+/Edge */
		user-select: none; /* Standard */
	}

	.other label {
		display: block;
		font-weight: 800;
	}

	.section-seperator-container {
		margin-top: 10px;
	}

	.section-seperator-container label {
		margin-bottom: 5px;
	}

	.other label[for='use-matched-regex'] {
		font-weight: unset;
	}

	.error {
		color: var(--clr-bg-error-content);
		margin: 20px 0;
	}

	.error p {
		background-color: var(--clr-bg-error);
		padding: 0.8em;
		text-align: center;
		font-weight: 800;
		border-radius: 0.2em;
		display: none;
		max-width: 60ch;
	}

	.error p.show {
		display: inline-block;
	}

	.error p.show + p:nth-child(2) {
		margin-top: 10px;
	}

	.use-matched-regex-container {
		display: flex;
		gap: 10px;
		margin-bottom: 9px;
	}

	input[type='text'] {
		background-color: var(--clr-bg-tertiary);
		color: var(--clr-bg-tertiary-content);
		border: 2px solid var(--clr-bg-secondary);
		padding: 0.2em 0.5em;
		font-size: 1rem;
		max-width: 100%;
	}

	input:checked + label {
		background-color: var(--clr-bg-secondary);
		color: var(--clr-bg-secondary-content);
	}

	textarea {
		resize: none;
		width: 100%;
		max-width: 600px;
		height: 400px;
		border: 2px solid var(--clr-bg-secondary);
		border-radius: 3px;
		background-color: var(--clr-bg-tertiary);
		color: var(--clr-bg-tertiary-content);
		padding: 1em;
		font-size: 1rem;
		margin-top: 1rem;
	}

	button {
		display: block;
		background-color: var(--clr-bg-secondary);
		color: var(--clr-bg-secondary-content);
		border: none;
		padding: 0.8em 2em;
		font-weight: 800;
		font-size: 1rem;
		margin-top: 20px;
		border-radius: 3px;
		text-transform: uppercase;
	}

	:root {
		// might cause bugs in future, but I've +/- font size still works
		font-size: clamp(16px, 2vw, 22px);
	}

	@media screen and (min-width: $small-screen) {
		// :root {
		// font-size: 20px;
		// }

		.other {
			display: flex;
			align-items: flex-end;
			gap: 10px;
		}
	}

	@media screen and (min-width: $medium-screen) {
		// :root {
		// font-size: 22px;
		// }

		main {
			display: grid;
			align-items: center;
		}

		form > div:first-child {
			margin-inline: 5%;
		}

		form > div {
			flex: 1;
		}

		.other {
			display: block;
		}

		form {
			display: flex;
			flex-direction: row;
		}

		textarea {
			width: 90%;
			max-width: unset;
			height: 80%;
		}

		.section-seperator-container {
			margin-top: 20px;
		}
	}
</style>
