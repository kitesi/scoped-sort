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

<div class="flex flex-col h-full bg-[#0e0f11] text-white">
	<Header />
	<main class="h-full flex" class:has-nav-shown={$isSidebarOpen}>
		<form bind:this={form} on:submit|preventDefault={handleSubmit} class="p-6 md:flex md:flex-row md:h-auto w-full max-w-7xl my-auto mx-auto">
			<div class="md:w-1/2 md:pr-8 lg:pr-12">
				<div class="mb-8">
					<h2 class="text-xl font-semibold mb-4 text-slate-200">Universal Modifiers</h2>
					<div class="grid grid-cols-3 gap-3 max-w-md">
						{#each universalModifiers as modifier (modifier.name)}
							{@const id = 'modifiers-' + modifier.name}
							<div class="relative">
								<input type="checkbox" name={modifier.name} {id} class="absolute appearance-none peer" />
								<label for={id} class="block py-3 px-3 sm:px-4 border border-[#2e333b] rounded-lg w-full text-center cursor-pointer transition-all duration-200 select-none peer-checked:bg-[#2e333b] peer-checked:border-[#2e333b] peer-checked:text-white peer-hover:not(:checked):bg-[#131417] peer-hover:checked:bg-[#2e333b] text-sm sm:text-base whitespace-nowrap overflow-hidden font-medium">
                                    {modifier.label}
                                </label>
							</div>
						{/each}
					</div>
				</div>

				<div class="mb-8">
					<h2 class="text-xl font-semibold mb-4 text-slate-200">Unique</h2>
					<div class="grid grid-cols-3 gap-3 max-w-md">
						{#each uniqueOptions as option (option.name)}
							{@const id = 'unique-' + option.name}
							<div class="relative">
								<input type="radio" name="unique" value={option.value ?? option.name} {id} class="absolute appearance-none peer" />
								<label for={id} class="block py-3 px-3 sm:px-4 border border-[#2e333b] rounded-lg w-full text-center cursor-pointer transition-all duration-200 select-none peer-checked:bg-[#2e333b] peer-checked:border-[#2e333b] peer-checked:text-white peer-hover:not(:checked):bg-[#131417] peer-hover:checked:bg-[#2e333b] text-sm sm:text-base whitespace-nowrap overflow-hidden font-medium">
                                    {option.label}
                                </label>
							</div>
						{/each}
					</div>
				</div>

				<div class="flex items-center mb-8">
					<label for="recursive" class="text-xl font-semibold w-32 text-slate-200">Recursive:</label>
					<input
						type="text"
						name="recursive"
						id="recursive"
						placeholder="4"
						inputmode="numeric"
						pattern="\d*"
						class="w-20 bg-[#131417] text-white border border-[#2e333b] py-2 px-3 rounded-lg focus:border-[#2e333b] focus:ring-2 focus:ring-[#2e333b]/20 transition-all duration-200"
					/>
				</div>

				<div class="flex items-center mb-8">
					<label for="sorter" class="text-xl font-semibold w-32 text-slate-200">Sorter:</label>
					<Select options={sorters} id="sorter" name="sorter" />
				</div>

				<div class="mb-8">
					<h2 class="text-xl font-semibold mb-4 text-slate-200">Item Search Modifiers</h2>
					<div class="grid grid-cols-2 gap-3 max-w-md mb-6">
						<div class="relative">
							<input type="checkbox" name="use-matched-regex" id="use-matched-regex" class="absolute appearance-none peer" />
							<label for="use-matched-regex" class="block py-3 px-3 sm:px-4 border border-[#2e333b] rounded-lg w-full text-center cursor-pointer transition-all duration-200 select-none peer-checked:bg-[#2e333b] peer-checked:border-[#2e333b] peer-checked:text-white peer-hover:not(:checked):bg-[#131417] peer-hover:checked:bg-[#2e333b] text-sm sm:text-base whitespace-nowrap overflow-hidden font-medium">
                                Use Matched
                            </label>
						</div>
						<div class="relative">
							<input type="checkbox" name="attach-nmtb" id="attach-nmtb" class="absolute appearance-none peer" />
							<label for="attach-nmtb" class="block py-3 px-3 sm:px-4 border border-[#2e333b] rounded-lg w-full text-center cursor-pointer transition-all duration-200 select-none peer-checked:bg-[#2e333b] peer-checked:border-[#2e333b] peer-checked:text-white peer-hover:not(:checked):bg-[#131417] peer-hover:checked:bg-[#2e333b] text-sm sm:text-base whitespace-nowrap overflow-hidden font-medium">
                                Attach NMTB
                            </label>
						</div>
					</div>

					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<label for="regex" class="block text-lg font-semibold mb-3 text-slate-200">Regex Filter:</label>
							<input
								type="text"
								name="regex"
								id="regex"
								placeholder="/\d+ /i"
								pattern="^\/.+\/\w*$"
								class="w-full bg-[#131417] text-white border border-[#2e333b] py-3 px-4 rounded-lg hover:border-[#2e333b] focus:border-[#2e333b] focus:ring-2 focus:ring-[#2e333b]/20 transition-all duration-200"
							/>
						</div>
						<div>
							<label for="section-starter" class="block text-lg font-semibold mb-3 text-slate-200">Section Starter:</label>
							<input
								type="text"
								name="section-starter"
								id="section-starter"
								pattern="^\/.+\/\w*$"
								placeholder="/<div /"
								class="w-full bg-[#131417] text-white border border-[#2e333b] py-3 px-4 rounded-lg hover:border-[#2e333b] focus:border-[#2e333b] focus:ring-2 focus:ring-[#2e333b]/20 transition-all duration-200"
							/>
						</div>
						<div>
							<label for="section-separator" class="block text-lg font-semibold mb-3 text-slate-200">Section Separator:</label>
							<input
								type="text"
								name="section-separator"
								id="section-separator"
								placeholder="\n\n"
								class="w-full bg-[#131417] text-white border border-[#2e333b] py-3 px-4 rounded-lg hover:border-[#2e333b] focus:border-[#2e333b] focus:ring-2 focus:ring-[#2e333b]/20 transition-all duration-200"
							/>
						</div>
						<div>
							<label for="section-rejoiner" class="block text-lg font-semibold mb-3 text-slate-200">Section Rejoiner:</label>
							<input 
                                type="text" 
                                name="section-rejoiner" 
                                id="section-rejoiner" 
                                placeholder="\n\n" 
                                class="w-full bg-[#131417] text-white border border-[#2e333b] py-3 px-4 rounded-lg hover:border-[#2e333b] focus:border-[#2e333b] focus:ring-2 focus:ring-[#2e333b]/20 transition-all duration-200"
                            />
						</div>
						<div class="md:col-span-2">
							<label for="other-args" class="block text-lg font-semibold mb-3 text-slate-200">Other Args:</label>
							<input
								type="text"
								name="other-args"
								id="other-args"
								placeholder="-c --sort-order a;z;b"
								class="w-full bg-[#131417] text-white border border-[#2e333b] py-3 px-4 rounded-lg hover:border-[#2e333b] focus:border-[#2e333b] focus:ring-2 focus:ring-[#2e333b]/20 transition-all duration-200"
							/>
						</div>
					</div>
				</div>
			</div>

			<div class="md:w-1/2 md:pl-8 lg:pl-12 flex flex-col">
				<label for="content" class="text-xl font-semibold mb-3 text-slate-200">Content:</label>
				<textarea 
                    spellcheck="false" 
                    id="content" 
                    name="content" 
                    bind:value={content} 
                    class="resize-y h-[300px] md:h-[450px] mb-6 border border-[#2e333b] rounded-lg bg-[#131417] text-white p-4 text-base hover:border-[#2e333b] focus:border-[#2e333b] focus:ring-2 focus:ring-[#2e333b]/20 transition-all duration-200"
                ></textarea>
				<button 
                    type="submit" 
                    class="self-start bg-[#2e333b] hover:bg-[#2e333b]/80 text-white font-semibold py-3 px-8 rounded-lg uppercase tracking-wide transform transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
                >
                    Modify
                </button>
			</div>
		</form>
	</main>
</div>

<ErrorPallete />

<style>
    /* Keep minimal custom styling for focus states and invalid inputs */
    input[type='text']:invalid {
        outline: 0.2em solid #f87171;
        outline-offset: -0.2em;
    }

    .peer:focus-visible + label,
    input[type='text']:focus-visible,
    textarea:focus-visible {
        outline: 0.2em solid #5c9aed;
        outline-offset: -0.2em;
    }

    @keyframes button-pop {
        0% {transform: scale(0.95);}
        40% {transform: scale(1.02);}
        to {transform: scale(1);}
    }


	.has-nav-shown {
		overflow-y: hidden;
		display: none;
	}


	@media screen and (min-width: 768px) {
		main,
		.has-nav-shown {
			display: flex;
		}
	}
</style>
