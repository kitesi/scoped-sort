<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import {
		type Options,
		sort,
		parseArgsIntoOptions,
		tokenizeArgString,
		sortComments
	} from 'string-content-sort';

	import { isSidebarOpen, errors as errorsStore } from '$lib/js/stores';

	import Select from '$lib/components/Select.svelte';
	import ErrorPallete from '$lib/components/ErrorPallete.svelte';

	import type { InputGroup } from './inputs.js';

	let form: HTMLFormElement;
	let content = '';

	function getCheckboxValue(val: any) {
		return val === 'on';
	}

	function handleSubmit() {
		if (!form) {
			return;
		}

		const formData = new FormData(form);
		const recursive = formData.get('recursive');
		const regex = formData.get('regex');
		const sectionStarter = formData.get('section-starter');
		const sectionSeparator = formData.get('section-separator');
		let sectionRejoiner = formData.get('section-rejoiner');

		let useSortComments = false;

		const args: string[] = [];
		const argString = formData.get('other-args');

		// FormDataEntry can be file, don't have any file inputs though
		if (typeof recursive === 'string' && recursive) {
			args.push('--recursive', recursive);
		}

		if (typeof regex === 'string' && regex) {
			args.push('--regex', regex);
		}

		if (typeof sectionSeparator === 'string' && sectionSeparator) {
			args.push('--section-separator', sectionSeparator);
		}

		if (typeof sectionStarter === 'string' && sectionStarter) {
			args.push('--section-starter', sectionStarter);
		}

		if (typeof argString === 'string' && argString) {
			args.push(...tokenizeArgString(argString));
		}

		if (typeof sectionRejoiner === 'string') {
			sectionRejoiner = sectionRejoiner.replaceAll('\\n', '\n');
		}

		const {
			errors: parsingErrors,
			positionals,
			options: additionalOptions
		} = parseArgsIntoOptions(args, (arg) => {
			if (arg === '--use-sort-comments' || arg === '-c') {
				useSortComments = true;
				return 0;
			}

			return 1;
		});

		if (parsingErrors.length > 0) {
			console.error('Recieved error(s): \n' + parsingErrors.join('\n'));
			errorsStore.set(parsingErrors);
			return;
		}

		if (positionals.length > 0) {
			console.error('Recieved positional(s): ' + positionals.join(', '));
			errorsStore.set(['Recieved positional(s): ' + positionals.map((p) => `"${p}"`).join(', ')]);
			return;
		}

		const options: Options = {
			markdown: getCheckboxValue(formData.get('markdown')),
			reverse: getCheckboxValue(formData.get('reverse')),
			// @ts-ignore
			unique: formData.get('unique') || undefined,
			// @ts-ignore
			sorter: formData.get('sorter') || undefined,
			useMatchedRegex: getCheckboxValue(formData.get('use-matched-regex')),
			attachNonMatchingToBottom: getCheckboxValue(formData.get('attach-nmtb')),
			// @ts-ignore
			sectionRejoiner,
			...additionalOptions
		};

		try {
			if (useSortComments) {
				const attemptAtSortComments = sortComments(content);

				if (attemptAtSortComments.errors.length > 0) {
					console.error('Recieved error(s): \n' + attemptAtSortComments.errors.join('\n'));
					errorsStore.set(attemptAtSortComments.errors);
					return;
				}

				content = attemptAtSortComments.result;
			} else {
				content = sort(content, options);
			}
		} catch (sortErrors: any) {
			console.error('Recieved error(s): \n' + sortErrors.message);
			errorsStore.set([sortErrors.message]);
		}
	}

	const universalModifiers: InputGroup = [
		{
			name: 'markdown',
			label: 'Markdown'
		},
		{
			name: 'reverse',
			label: 'Reverse'
		}
	];

	const sorters: InputGroup = [
		{
			name: 'normal',
			label: 'Normal',
			value: ''
		},
		{
			name: 'case-insensitive',
			label: 'Case Insensitive'
		},
		{
			name: 'natural',
			label: 'Natural'
		},
		{
			name: 'numerical',
			label: 'Numerical'
		},
		{
			name: 'random',
			label: 'Random'
		},
		{
			name: 'float',
			label: 'Float'
		},
		{
			name: 'length',
			label: 'Length'
		},
		{
			name: 'month',
			label: 'Month'
		},
		{
			name: 'day',
			label: 'Day'
		},
		{
			name: 'none',
			label: 'None'
		}
	];

	const uniqueOptions: InputGroup = [
		{
			name: 'none',
			label: 'None',
			value: ''
		},
		{
			name: 'exact',
			label: 'Exact'
		},
		{
			name: 'case-insensitive',
			label: 'Case Ins'
		}
	];
</script>

<svelte:head>
	<meta property="og:site_name" content="Scoped Sort" />
</svelte:head>

<div class="main-container">
	<Header />
	<main class:has-nav-shown={$isSidebarOpen}>
		<form bind:this={form} on:submit|preventDefault={handleSubmit}>
			<div>
				<div>
					<h2>Universal Modifiers</h2>
					<div class="modifiers options-group">
						{#each universalModifiers as modifier (modifier.name)}
							{@const id = 'modifiers-' + modifier.name}
							<div>
								<input type="checkbox" name={modifier.name} {id} />
								<label for={id}>{modifier.label}</label>
							</div>
						{/each}
					</div>
				</div>

				<div>
					<h2>Unique</h2>

					<div class="unique-options options-group">
						{#each uniqueOptions as option (option.name)}
							{@const id = 'unique-' + option.name}
							<div>
								<input type="radio" name="unique" value={option.value ?? option.name} {id} />
								<label for={id}>{option.label}</label>
							</div>
						{/each}
					</div>
				</div>

				<div class="recursive-container">
					<label for="recursive">Recursive</label>
					<input
						type="text"
						name="recursive"
						id="recursive"
						placeholder="4"
						inputmode="numeric"
						pattern="\d*"
					/>
				</div>

				<div class="sorter-container">
					<label for="sorter">Sorter: </label>
					<Select options={sorters} id="sorter" name="sorter" />
				</div>

				<div class="item-search options-group">
					<h2>Item Search Modifiers</h2>
					<div class="checkboxes">
						<div>
							<input type="checkbox" name="use-matched-regex" id="use-matched-regex" />
							<label for="use-matched-regex">Use Matched</label>
						</div>
						<div>
							<input type="checkbox" name="attach-nmtb" id="attach-nmtb" />
							<label for="attach-nmtb">Attach NMTB</label>
						</div>
					</div>

					<div class="text-inputs">
						<div>
							<label for="regex">Regex Filter:</label>
							<input
								type="text"
								name="regex"
								id="regex"
								placeholder="/\d+ /i"
								pattern="^\/.+\/\w*$"
							/>
						</div>
						<div>
							<label for="section-starter">Section Starter: </label>
							<input
								type="text"
								name="section-starter"
								id="section-starter"
								pattern="^\/.+\/\w*$"
								placeholder="/<div /"
							/>
						</div>
						<div>
							<label for="section-separator">Section Separator: </label>
							<input
								type="text"
								name="section-separator"
								id="section-separator"
								placeholder="\n\n"
							/>
						</div>
						<div>
							<label for="section-rejoiner">Section Rejoiner: </label>
							<input type="text" name="section-rejoiner" id="section-rejoiner" placeholder="\n\n" />
						</div>
						<div>
							<label for="other-args">Other Args: </label>
							<input
								type="text"
								name="other-args"
								id="other-args"
								placeholder="-c --sort-order a;z;b"
							/>
						</div>
					</div>
				</div>
			</div>

			<div class="textarea-container">
				<label for="content">Content:</label>
				<textarea spellcheck="false" id="content" name="content" bind:value={content} />
				<button type="submit">Modify</button>
			</div>
		</form>
	</main>
</div>

<ErrorPallete />

<style lang="scss">
	@use '../lib/styles/sizes.scss' as *;

	:root {
		--clr-bg-hamburger-menu: white;
	}

	main,
	.main-container {
		height: 100%;
	}

	.main-container {
		display: flex;
		flex-direction: column;
	}

	.has-nav-shown {
		overflow-y: hidden;
		display: none;
	}

	h2,
	label {
		font-size: 1.1rem;
		font-weight: 400;
	}

	h2,
	.text-inputs > div {
		margin-bottom: 0.5em;
	}

	.textarea-container {
		display: flex;
		flex-direction: column;
	}

	textarea {
		margin-block: 1em 1em;
	}

	form {
		padding: 18px;
	}

	form > div > div {
		max-width: 100%;
		margin-bottom: 1.2em;
	}

	form > div > div > div {
		position: relative;
		margin-bottom: 1.2em;
	}

	input[type='text']:invalid {
		outline: 0.2em solid var(--clr-bg-error);
		outline-offset: -0.2em;
	}

	.options-group input:focus-visible + label,
	input[type='text']:focus-visible,
	textarea:focus-visible {
		outline: 0.2em solid var(--clr-accent-content);
		outline-offset: -0.2em;
	}

	input[type='checkbox']:focus,
	input[type='radio']:focus {
		outline: none;
	}

	input[type='checkbox'],
	input[type='radio'] {
		position: absolute;
		appearance: none;
	}

	.options-group:not(.item-search) {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.6em;
		max-width: 24.8rem;
	}

	.options-group input + label {
		display: block;
		padding-block: 0.5em;
		border: 0.1em solid var(--clr-bg-secondary);
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

	.unique-options input + label {
		border-radius: 9999px;
	}

	.checkboxes {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px;
		max-width: 24.8rem;
	}

	.item-search label {
		display: block;
	}

	.text-inputs label {
		margin-bottom: 0.5em;
	}

	.item-search .text-inputs {
		display: flex;
		flex-wrap: wrap;
		max-width: 35rem;
		column-gap: 20px;
	}

	.sorter-container {
		display: flex;
		gap: 1rem;
	}

	.recursive-container {
		display: flex;
		gap: 1rem;
		max-width: 24.8rem;

		input {
			width: 4rem;
		}
	}

	input[type='text'] {
		font-family: monospace;
		background-color: var(--clr-bg-tertiary);
		color: var(--clr-bg-tertiary-content);
		border: 2px solid var(--clr-bg-tertiary);
		border-radius: 0.2em;
		// padding: 0.4em 0.5em;
		// padding-left: 1me;
		padding: 0.8em;
		font-size: 1rem;
		max-width: 100%;
	}

	input:checked + label {
		background-color: var(--clr-bg-tertiary);
		color: var(--clr-bg-tertiary-content);
	}

	textarea {
		resize: vertical;
		width: 100%;
		height: 400px;
		// border: 2px solid var(--clr-bg-secondary);
		border: none;
		border-radius: 3px;
		background-color: var(--clr-bg-tertiary);
		color: var(--clr-bg-tertiary-content);
		padding: 1em;
		font-size: 1rem;
	}

	button {
		display: block;
		background-color: var(--clr-bg-secondary);
		max-width: 10em;
		color: var(--clr-bg-secondary-content);
		border: none;
		padding: 0.8em 2em;
		font-weight: 800;
		font-size: 1rem;
		border-radius: 3px;
		text-transform: uppercase;
		// credit to daisyui for animation
		transition: 200ms transform cubic-bezier(0.4, 0, 0.2, 1);
		animation: button-pop var(--animation-btn, 0.25s) ease-out;

		&:focus-visible {
			outline: 0.1em solid var(--clr-bg-secondary);
			outline-offset: 0.15em;
		}

		&:active:hover,
		&:active:focus {
			animation: none;
			transform: scale(0.95);
		}
	}

	:root {
		// might cause bugs in future
		font-size: clamp(16px, 2vw, 22px);
	}

	@media screen and (min-width: $medium-screen) {
		main,
		.has-nav-shown {
			display: grid;
			align-items: center;
		}

		form > div:first-child {
			margin-inline: 5%;
		}

		form > div {
			flex: 1;
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
	}

	@keyframes button-pop {
		0% {
			transform: scale(var(--btn-focus-scale, 0.95));
		}
		40% {
			transform: scale(1.02);
		}
		to {
			transform: scale(1);
		}
	}
</style>
