<script lang="ts">
	import GithubIcon from './icons/GithubIcon.svelte';
	import NpmIcon from './icons/NPMIcon.svelte';
	import TerminalIcon from './icons/TerminalIcon.svelte';
	import VscodeIcon from './icons/VscodeIcon.svelte';
	import HamburgerMenu from './HamburgerMenu.svelte';
	import { isSidebarOpen } from '$lib/js/stores';
	import { onMount } from 'svelte';

	const routes = {
		github: 'https://github.com/kitesi/scoped-sort',
		npm: 'https://www.npmjs.com/package/string-content-sort',
		cli: 'https://www.npmjs.com/package/string-content-sort-cli',
		vscode: 'https://marketplace.visualstudio.com/items?itemName=karizma.scoped-sort'
	};

	function closeSidebar() {
		isSidebarOpen.set(false);
	}

	// Resources dropdown functionality
	let dropdownOpen = false;
	
	function toggleDropdown() {
		dropdownOpen = !dropdownOpen;
	}
	
	function closeDropdown() {
		dropdownOpen = false;
	}

	// Close dropdown when clicking outside
	onMount(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const resourcesDropdown = document.getElementById('resources-dropdown');
			const resourcesButton = document.getElementById('resources-button');
			
			if (resourcesDropdown && resourcesButton && 
				!resourcesDropdown.contains(event.target as Node) && 
				!resourcesButton.contains(event.target as Node)) {
				closeDropdown();
			}
		};

		document.addEventListener('click', handleClickOutside);
		
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<header class="w-full bg-black border-b-2 border-black text-white dark:bg-[var(--clr-bg-primary)] dark:border-[var(--clr-bg-secondary)] dark:text-[var(--clr-bg-tertiary-content)]">
	<div class="max-w-7xl mx-auto flex justify-between items-center p-3 lg:p-4">
		<a href="/" class="hover:opacity-80 transition-opacity">
			<h1 class="uppercase font-extrabold text-base">ScopedSort</h1>
		</a>

		<div class="flex items-center">
			<nav class="hidden sm:block">
				<ul class="flex items-center gap-2">
					<li class="list-none font-medium text-base">
						<a on:click={closeSidebar} href="/docs" class="inline-block px-3 py-2 rounded-md hover:bg-white/10 transition-colors duration-200">Docs</a>
					</li>
					<li class="list-none font-medium text-base">
						<a on:click={closeSidebar} href="/examples" class="inline-block px-3 py-2 rounded-md hover:bg-white/10 transition-colors duration-200">Examples</a>
					</li>
					
					<!-- Resources Dropdown - Visible on md screens and up -->
					<li class="list-none font-medium text-base hidden md:block relative">
						<button 
							id="resources-button"
							class="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-white/10 transition-colors duration-200" 
							on:click|stopPropagation={toggleDropdown}
						>
							Resources
							<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-300 {dropdownOpen ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</button>
						
						{#if dropdownOpen}
							<!-- Dropdown Menu -->
							<div 
								id="resources-dropdown"
								class="absolute top-full mt-1 right-0 bg-black dark:bg-[var(--clr-bg-primary)] border border-gray-700 rounded shadow-lg py-3 px-4 z-20 w-64"
							>
								<ul class="flex flex-col gap-3">
									<li>
										<a 
											href={routes.github} 
											class="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10 transition-colors w-full"
											on:click={closeDropdown}
										>
											<div class="w-6 h-6 flex items-center justify-center"><GithubIcon size="24" /></div>
											<span>Github</span>
										</a>
									</li>
									<li>
										<a 
											href={routes.vscode} 
											class="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10 transition-colors w-full"
											on:click={closeDropdown}
										>
											<div class="w-6 h-6 flex items-center justify-center text-[#007ACC]"><VscodeIcon size="24" /></div>
											<span>VS Code Extension</span>
										</a>
									</li>
									<li>
										<a 
											href={routes.npm} 
											class="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10 transition-colors w-full"
											on:click={closeDropdown}
										>
											<div class="w-6 h-6 flex items-center justify-center text-[#CB3837]"><NpmIcon size="24" /></div>
											<span>NPM Package</span>
										</a>
									</li>
									<li>
										<a 
											href={routes.cli} 
											class="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10 transition-colors w-full"
											on:click={closeDropdown}
										>
											<div class="w-6 h-6 flex items-center justify-center"><TerminalIcon size="24" /></div>
											<span>CLI Tool</span>
										</a>
									</li>
								</ul>
							</div>
						{/if}
					</li>
				</ul>
			</nav>

			<!-- Hidden on medium screens and up since we're using the Resources dropdown -->
			<div class="md:hidden ml-2">
				<HamburgerMenu />
			</div>
		</div>
	</div>

	<!-- Mobile sidebar navigation -->
	<nav class="{$isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:hidden flex bg-black fixed inset-0 items-center justify-center transition-transform duration-100 ease-in z-10 overflow-auto">
		<ul class="flex flex-col items-start justify-center gap-5">
			<li class="list-none font-medium text-base">
				<a on:click={closeSidebar} href="/docs" class="px-3 py-2 rounded hover:bg-white/10 transition-colors">Docs</a>
			</li>
			<li class="list-none font-medium text-base">
				<a on:click={closeSidebar} href="/examples" class="px-3 py-2 rounded hover:bg-white/10 transition-colors">Examples</a>
			</li>
			<li class="list-none font-medium text-base">
				<a on:click={closeSidebar} href={routes.vscode} title="vscode package" class="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10 transition-colors">
					<div class="w-6 h-6 flex items-center justify-center text-[#007ACC]"><VscodeIcon size="24" /></div>
					<span>VS Code Extension</span>
				</a>
			</li>
			<li class="list-none font-medium text-base">
				<a on:click={closeSidebar} href={routes.github} title="github repo" class="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10 transition-colors">
					<div class="w-6 h-6 flex items-center justify-center"><GithubIcon size="24" /></div>
					<span>GitHub Repository</span>
				</a>
			</li>
			<li class="list-none font-medium text-base">
				<a on:click={closeSidebar} href={routes.npm} title="npm package" class="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10 transition-colors">
					<div class="w-6 h-6 flex items-center justify-center text-[#CB3837]"><NpmIcon size="24" /></div>
					<span>NPM Package</span>
				</a>
			</li>
			<li class="list-none font-medium text-base">
				<a on:click={closeSidebar} href={routes.cli} title="cli on npm" class="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10 transition-colors">
					<div class="w-6 h-6 flex items-center justify-center"><TerminalIcon size="24" /></div>
					<span>CLI Tool</span>
				</a>
			</li>
		</ul>
	</nav>
</header>