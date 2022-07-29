<script lang="ts">
	import Header from '$lib/Header.svelte';
	import Button from '$lib/Button.svelte';

	import { sort } from 'string-content-sort';
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
			label: 'Treat as markdown list'
		},
		{
			name: 'unique',
			label: 'Remove duplicates'
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
			name: '',
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

<main>
	<Header />

	<section>
		<form class="options" on:submit|preventDefault={handleSubmit}>
			<div>
				<h2>Universal Modifiers</h2>
				<div class="universal-modifiers">
					{#each universalModifiers as modifier (modifier.name)}
						<div>
							<label for={modifier.name}>{modifier.label}</label>
							<input
								bind:checked={universalModifiersBindings[modifier.name]}
								type="checkbox"
								id={modifier.name}
							/>
						</div>
					{/each}
				</div>
			</div>
			<div>
				<h2>Sorters</h2>
				<div class="sorters">
					{#each sorters as sorter}
						<div>
							<label for={sorter.name}>{sorter.label}</label>
							<input
								type="radio"
								name="sorter"
								id={sorter.name}
								value={sorter.name}
								bind:group={sorterBinding}
							/>
						</div>
					{/each}
				</div>
			</div>
			<div>
				<h2>Other</h2>
				<div class="other">
					<div>
						<label for="regex">Regex:</label>
						<input type="text" bind:value={regex} name="regex" id="regex" />
					</div>
					<div>
						<label for="section-seperator">Section seperator: </label>
						<input
							type="text"
							bind:value={sectionSeperator}
							name="section-seperator"
							id="section-seperator"
						/>
					</div>
					<div>
						<label for="use-matched-regex">Use matched regex</label>
						<input
							type="checkbox"
							bind:checked={useMatchedRegex}
							name="use-matched-regex"
							id="use-matched-regex"
						/>
					</div>
				</div>
			</div>
			<section>
				<textarea bind:value={sortingText} class="input" placeholder="Your text here" />
				<Button text="Modify" submit={true} />
			</section>
		</form>
	</section>
</main>

<style lang="scss">
	@use '../colors.scss' as *;
	@use '../numerical.scss' as *;

	main {
		height: 100%;
	}

	main > section {
		padding: 10px;
		width: 100%;
		overflow: auto;
	}

	form {
		display: grid;
		gap: 10px;
	}

	form > div > div {
		border: 2px solid $c-black-2;
		border-radius: 5px;
	}

	form > div > div > div {
		display: flex;
		justify-content: space-between;
		padding: 10px;
	}

	form > div > div > div:not(:last-child) {
		border-bottom: 2px solid $c-black-2;
	}

	input[type='text'] {
		width: 150px;
		padding-left: 5px;
	}

	h2 {
		width: max-content;
		padding: 5px;
		border-radius: 5px;
		margin-bottom: 2px;
	}

	textarea {
		display: block;
		background-color: transparent;
		color: white;
		resize: none;
		width: 100%;
		height: 400px;
		border: 2px solid $c-black-2;
		padding: 10px;
		font-size: 1rem;
		max-width: 1000px;
	}

	@media screen and (min-width: $size-1) {
		form {
			grid-template-columns: 1fr 1fr;
			gap: 10px;
		}
	}

	@media screen and (min-width: $size-2) {
		main {
			display: flex;
		}

		form > div > div {
			max-width: unset;
		}
	}

	@media screen and (min-width: $size-3) {
		form {
			grid-template-columns: 500px 600px;
			// grid-template-areas:
			// 	'modifiers text'
			// 	'sorters text'
			// 	'other text';
			grid-template-areas:
				'modifiers other'
				'sorters text';
			gap: 10px;
		}

		form > section {
			grid-template-rows: 1/2;
			grid-area: text;
		}

		main > section {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
	}
</style>
