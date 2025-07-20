<script lang="ts">
	import GithubIcon from './icons/GithubIcon.svelte';
	import NpmIcon from './icons/NPMIcon.svelte';
	import TerminalIcon from './icons/TerminalIcon.svelte';
	import VscodeIcon from './icons/VscodeIcon.svelte';
	import HamburgerMenu from './HamburgerMenu.svelte';
	import { isSidebarOpen } from '$lib/js/stores';
	import { onMount } from 'svelte';
	import { urls } from '$lib/js/urls';

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

			if (
				resourcesDropdown &&
				resourcesButton &&
				!resourcesDropdown.contains(event.target as Node) &&
				!resourcesButton.contains(event.target as Node)
			) {
				closeDropdown();
			}
		};

		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<header class="w-full bg-[#0e0f11] border-b border-[#2e333b] text-white shadow-lg">
	<div class="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
		<!-- Logo/Brand -->
		<a
			href="/"
			class="group flex items-center space-x-3 hover:opacity-90 transition-all duration-300"
		>
			<div
				class="w-10 h-10 bg-[#2e333b] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300"
			>
				<span class="text-white font-bold text-lg">S</span>
			</div>
			<div class="flex flex-col">
				<h1 class="font-bold text-xl text-white">SCOPEDSORT</h1>
				<p class="text-xs text-slate-400 font-medium tracking-wide">Text Manipulation Tool</p>
			</div>
		</a>

		<div class="flex items-center space-x-1">
			<!-- Desktop Navigation -->
			<nav class="hidden sm:flex items-center space-x-1">
				<a
					on:click={closeSidebar}
					href="/docs"
					class="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#2e333b] transition-all duration-200 font-medium"
				>
					Docs
				</a>
				<a
					on:click={closeSidebar}
					href="/examples"
					class="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#2e333b] transition-all duration-200 font-medium"
				>
					Examples
				</a>

				<!-- Resources Dropdown -->
				<div class="relative hidden md:block">
					<button
						id="resources-button"
						class="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#2e333b] transition-all duration-200 font-medium"
						on:click|stopPropagation={toggleDropdown}
					>
						Resources
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 transition-transform duration-300 {dropdownOpen ? 'rotate-180' : ''}"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>

					{#if dropdownOpen}
						<div
							id="resources-dropdown"
							class="absolute top-full mt-2 right-0 bg-[#131417] border border-[#2e333b] rounded-xl shadow-2xl py-3 px-2 z-20 w-64"
						>
							<ul class="flex flex-col gap-1">
								<li>
									<a
										href={urls.github}
										class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#2e333b] transition-all duration-200 w-full text-sm"
										on:click={closeDropdown}
									>
										<div class="w-5 h-5 flex items-center justify-center text-slate-300">
											<GithubIcon size="24" />
										</div>
										<span class="text-slate-300">GitHub</span>
									</a>
								</li>
								<li>
									<a
										href={urls.vscode}
										class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#2e333b] transition-all duration-200 w-full text-sm"
										on:click={closeDropdown}
									>
										<div class="w-5 h-5 flex items-center justify-center text-[#007ACC]">
											<VscodeIcon size="24" />
										</div>
										<span class="text-slate-300">VS Code Extension</span>
									</a>
								</li>
								<li>
									<a
										href={urls.npm}
										class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#2e333b] transition-all duration-200 w-full text-sm"
										on:click={closeDropdown}
									>
										<div class="w-5 h-5 flex items-center justify-center text-[#CB3837]">
											<NpmIcon size="24" />
										</div>
										<span class="text-slate-300">NPM Package</span>
									</a>
								</li>
								<li>
									<a
										href={urls.cli}
										class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#2e333b] transition-all duration-200 w-full text-sm"
										on:click={closeDropdown}
									>
										<div class="w-5 h-5 flex items-center justify-center text-slate-300">
											<TerminalIcon size="24" />
										</div>
										<span class="text-slate-300">CLI Tool</span>
									</a>
								</li>
							</ul>
						</div>
					{/if}
				</div>
			</nav>

			<!-- Mobile Menu Button -->
			<div class="md:hidden ml-2">
				<HamburgerMenu />
			</div>
		</div>
	</div>

	<!-- Mobile sidebar navigation -->
	<nav
		class="{$isSidebarOpen
			? 'translate-x-0'
			: '-translate-x-full'} sm:hidden flex bg-[#0e0f11] fixed inset-0 items-center justify-center transition-transform duration-300 ease-out z-10 overflow-auto"
	>
		<ul class="flex flex-col items-start justify-center gap-2 p-6 w-full max-w-sm">
			<li class="w-full">
				<a
					on:click={closeSidebar}
					href="/docs"
					class="block w-full px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-[#2e333b] transition-all duration-200 font-medium"
				>
					Docs
				</a>
			</li>
			<li class="w-full">
				<a
					on:click={closeSidebar}
					href="/examples"
					class="block w-full px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-[#2e333b] transition-all duration-200 font-medium"
				>
					Examples
				</a>
			</li>
			<li class="w-full">
				<a
					on:click={closeSidebar}
					href={urls.vscode}
					title="vscode package"
					class="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-[#2e333b] transition-all duration-200 font-medium"
				>
					<div class="w-5 h-5 flex items-center justify-center text-[#007ACC]">
						<VscodeIcon size="24" />
					</div>
					<span>VS Code Extension</span>
				</a>
			</li>
			<li class="w-full">
				<a
					on:click={closeSidebar}
					href={urls.github}
					title="github repo"
					class="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-[#2e333b] transition-all duration-200 font-medium"
				>
					<div class="w-5 h-5 flex items-center justify-center text-slate-300">
						<GithubIcon size="24" />
					</div>
					<span>GitHub Repository</span>
				</a>
			</li>
			<li class="w-full">
				<a
					on:click={closeSidebar}
					href={urls.npm}
					title="npm package"
					class="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-[#2e333b] transition-all duration-200 font-medium"
				>
					<div class="w-5 h-5 flex items-center justify-center text-[#CB3837]">
						<NpmIcon size="24" />
					</div>
					<span>NPM Package</span>
				</a>
			</li>
			<li class="w-full">
				<a
					on:click={closeSidebar}
					href={urls.cli}
					title="cli on npm"
					class="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-[#2e333b] transition-all duration-200 font-medium"
				>
					<div class="w-5 h-5 flex items-center justify-center text-slate-300">
						<TerminalIcon size="24" />
					</div>
					<span>CLI Tool</span>
				</a>
			</li>
		</ul>
	</nav>
</header>
