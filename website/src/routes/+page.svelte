<!-- Hero Section -->
<section class="relative py-20 min-h-screen flex items-center overflow-hidden bg-bg-primary">
	<div
		class="absolute w-[500px] h-[500px] top-[-250px] left-[-250px] rounded-full"
		style="background: radial-gradient(circle, rgba(58,134,255,0.15) 0%, rgba(58,134,255,0) 70%);"
	></div>
	<div class="container mx-auto px-6 max-w-7xl w-full">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
			<div class="relative z-10">
				<h1
					class="text-5xl md:text-6xl xl:text-7xl font-bold mb-6 leading-tight tracking-tighter gradient-text"
				>
					ScopedSort
				</h1>
				<h2
					class="text-xl md:text-2xl font-normal text-text-secondary mb-8 tracking-tight max-w-[550px]"
				>
					A powerful sorting tool for everyone
				</h2>
				<p class="text-lg text-text-tertiary mb-12 max-w-[500px] leading-relaxed">
					Sort content within scopes and sections of your text with precision and flexibility.
					Perfect for organizing imports, lists, and structured data.
				</p>
				<div class="flex flex-wrap gap-6">
					<a
						href="/playground"
						class="inline-block px-8 py-3 text-base bg-accent text-white rounded-lg shadow-lg hover:bg-[#619bff] hover:-translate-y-0.5 transition-all duration-300 hover:shadow-[0_6px_25px_rgba(58,134,255,0.4)] font-medium"
						>Try Online</a
					>
					<a
						href="/docs"
						class="inline-block px-8 py-3 text-base font-medium bg-transparent border border-border-color text-text-primary rounded-lg hover:bg-white/5 hover:-translate-y-0.5 transition-all duration-300"
						>Documentation</a
					>
				</div>
			</div>

			<div class="relative z-10">
				<div class="grid grid-cols-1 gap-6">
					<!-- Before sorting block -->
					<div
						class="bg-bg-code rounded-xl overflow-hidden shadow-custom border border-border-color"
					>
						<div class="flex items-center p-4 bg-white bg-opacity-5 border-b border-border-color">
							<div class="flex gap-2 mr-4">
								<span class="w-3 h-3 rounded-full bg-[#FF5F56]"></span>
								<span class="w-3 h-3 rounded-full bg-[#FFBD2E]"></span>
								<span class="w-3 h-3 rounded-full bg-[#27C93F]"></span>
							</div>
							<div class="text-sm text-text-tertiary font-mono">Before sorting</div>
						</div>
						<div class="p-6 font-mono text-sm leading-relaxed code-content">
							<div>
								Sam&nbsp;&nbsp;&nbsp;&nbsp;18&nbsp;&nbsp;Male&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;140
							</div>
							<div>Jack&nbsp;&nbsp;&nbsp;23&nbsp;&nbsp;Non-Binary&nbsp;120</div>
							<div>Niel&nbsp;&nbsp;&nbsp;16&nbsp;&nbsp;Female&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;135</div>
							<div>
								Max&nbsp;&nbsp;&nbsp;&nbsp;17&nbsp;&nbsp;Male&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;135
							</div>
							<div>Jane&nbsp;&nbsp;&nbsp;22&nbsp;&nbsp;Female&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100</div>
							<div>
								max&nbsp;&nbsp;&nbsp;&nbsp;17&nbsp;&nbsp;male&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;135
							</div>
							<div>
								Jones&nbsp;&nbsp;17&nbsp;&nbsp;male&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;135
							</div>
							<div>
								Lydia&nbsp;&nbsp;N/A&nbsp;N/A&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;120
							</div>
							<div>
								Mike&nbsp;&nbsp;&nbsp;N/A&nbsp;male&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;N/A
							</div>
						</div>
					</div>

					<!-- After sorting block -->
					<div
						class="bg-bg-code rounded-xl overflow-hidden shadow-custom border border-border-color"
					>
						<div class="flex items-center p-4 bg-white bg-opacity-5 border-b border-border-color">
							<div class="flex gap-2 mr-4">
								<span class="w-3 h-3 rounded-full bg-[#FF5F56]"></span>
								<span class="w-3 h-3 rounded-full bg-[#FFBD2E]"></span>
								<span class="w-3 h-3 rounded-full bg-[#27C93F]"></span>
							</div>
							<div class="text-sm text-text-tertiary font-mono">After sorting (by gender)</div>
						</div>
						<div class="p-6 font-mono text-sm leading-relaxed code-content">
							<div>Niel&nbsp;&nbsp;&nbsp;16&nbsp;&nbsp;Female&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;135</div>
							<div>Jane&nbsp;&nbsp;&nbsp;22&nbsp;&nbsp;Female&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100</div>
							<div>Jack&nbsp;&nbsp;&nbsp;23&nbsp;&nbsp;Non-Binary&nbsp;120</div>
							<div>
								Sam&nbsp;&nbsp;&nbsp;&nbsp;18&nbsp;&nbsp;Male&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;140
							</div>
							<div>
								Max&nbsp;&nbsp;&nbsp;&nbsp;17&nbsp;&nbsp;Male&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;135
							</div>
							<div>
								max&nbsp;&nbsp;&nbsp;&nbsp;17&nbsp;&nbsp;male&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;135
							</div>
							<div>
								Jones&nbsp;&nbsp;17&nbsp;&nbsp;male&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;135
							</div>
							<div>
								Mike&nbsp;&nbsp;&nbsp;N/A&nbsp;male&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;N/A
							</div>
							<div>
								Lydia&nbsp;&nbsp;N/A&nbsp;N/A&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;120
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Features Section -->
<section class="py-24 bg-bg-primary">
	<div class="container mx-auto px-6 max-w-7xl">
		<h2 class="text-4xl font-bold mb-3 text-center gradient-text">Key Features</h2>
		<p class="text-xl text-text-secondary mb-16 text-center max-w-3xl mx-auto">
			A powerful solution for organizing and sorting your code with precision
		</p>

		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
			<div
				class="bg-bg-card rounded-xl p-8 border border-border-color transition-all duration-300 hover:-translate-y-[5px] hover:border-[rgba(58,134,255,0.3)] relative overflow-hidden group"
			>
				<div
					class="absolute inset-x-0 top-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
					style="background: linear-gradient(to right, #3A86FF, transparent);"
				></div>
				<div
					class="w-14 h-14 flex items-center justify-center text-3xl rounded-xl mb-6"
					style="background-color: rgba(58, 134, 255, 0.1);"
				>
					🔍
				</div>
				<h3 class="text-2xl font-semibold mb-4 tracking-tight">Scoped Sorting</h3>
				<p class="text-text-secondary leading-relaxed">
					Sort content only within specific scopes or sections of your text, maintaining the
					structure of your code.
				</p>
			</div>

			<div
				class="bg-bg-card rounded-xl p-8 border border-border-color transition-all duration-300 hover:-translate-y-[5px] hover:border-[rgba(58,134,255,0.3)] relative overflow-hidden group"
			>
				<div
					class="absolute inset-x-0 top-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
					style="background: linear-gradient(to right, #3A86FF, transparent);"
				></div>
				<div
					class="w-14 h-14 flex items-center justify-center text-3xl rounded-xl mb-6"
					style="background-color: rgba(58, 134, 255, 0.1);"
				>
					🔄
				</div>
				<h3 class="text-2xl font-semibold mb-4 tracking-tight">Multiple Algorithms</h3>
				<p class="text-text-secondary leading-relaxed">
					Choose from various sorting algorithms: natural, case-insensitive, numerical, and more to
					meet your specific needs.
				</p>
			</div>

			<div
				class="bg-bg-card rounded-xl p-8 border border-border-color transition-all duration-300 hover:-translate-y-[5px] hover:border-[rgba(58,134,255,0.3)] relative overflow-hidden group"
			>
				<div
					class="absolute inset-x-0 top-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
					style="background: linear-gradient(to right, #3A86FF, transparent);"
				></div>
				<div
					class="w-14 h-14 flex items-center justify-center text-3xl rounded-xl mb-6"
					style="background-color: rgba(58, 134, 255, 0.1);"
				>
					⚙️
				</div>
				<h3 class="text-2xl font-semibold mb-4 tracking-tight">Regex Support</h3>
				<p class="text-text-secondary leading-relaxed">
					Use regular expressions to define sections and control what gets sorted with powerful
					pattern matching.
				</p>
			</div>

			<div
				class="bg-bg-card rounded-xl p-8 border border-border-color transition-all duration-300 hover:-translate-y-[5px] hover:border-[rgba(58,134,255,0.3)] relative overflow-hidden group"
			>
				<div
					class="absolute inset-x-0 top-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
					style="background: linear-gradient(to right, #3A86FF, transparent);"
				></div>
				<div
					class="w-14 h-14 flex items-center justify-center text-3xl rounded-xl mb-6"
					style="background-color: rgba(58, 134, 255, 0.1);"
				>
					🌐
				</div>
				<h3 class="text-2xl font-semibold mb-4 tracking-tight">Cross-Platform</h3>
				<p class="text-text-secondary leading-relaxed">
					Available as a library, CLI tool, and VS Code extension to fit seamlessly into your
					workflow.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Integrations Section -->
<section class="py-24 bg-bg-secondary">
	<div class="container mx-auto px-6 max-w-7xl">
		<h2 class="text-4xl font-bold mb-3 text-center gradient-text">Available Integrations</h2>
		<p class="text-xl text-text-secondary mb-16 text-center max-w-3xl mx-auto">
			Use ScopedSort however you want, wherever you need it
		</p>

		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
			<a
				href="https://www.npmjs.com/package/string-content-sort"
				class="bg-bg-card rounded-xl p-8 border border-border-color flex flex-col items-start text-text-primary no-underline transition-all duration-300 hover:-translate-y-[5px] hover:border-[rgba(58,134,255,0.3)]"
			>
				<div class="text-4xl mb-6">📦</div>
				<h3 class="text-2xl font-semibold mb-4 tracking-tight">NPM Package</h3>
				<p class="text-text-secondary">Use directly in your JavaScript projects</p>
			</a>

			<a
				href="https://www.npmjs.com/package/string-content-sort-cli"
				class="bg-bg-card rounded-xl p-8 border border-border-color flex flex-col items-start text-text-primary no-underline transition-all duration-300 hover:-translate-y-[5px] hover:border-[rgba(58,134,255,0.3)]"
			>
				<div class="text-4xl mb-6">⌨️</div>
				<h3 class="text-2xl font-semibold mb-4 tracking-tight">CLI Tool</h3>
				<p class="text-text-secondary">Perfect for scripts and command line usage</p>
			</a>

			<a
				href="https://marketplace.visualstudio.com/items?itemName=karizma.scoped-sort"
				class="bg-bg-card rounded-xl p-8 border border-border-color flex flex-col items-start text-text-primary no-underline transition-all duration-300 hover:-translate-y-[5px] hover:border-[rgba(58,134,255,0.3)]"
			>
				<div class="text-4xl mb-6">💻</div>
				<h3 class="text-2xl font-semibold mb-4 tracking-tight">VS Code Extension</h3>
				<p class="text-text-secondary">Sort directly in your editor</p>
			</a>

			<a
				href="https://github.com/kitesi/scopedsort"
				target="_blank"
				rel="noopener noreferrer"
				class="bg-bg-card rounded-xl p-8 border border-border-color flex flex-col items-start text-text-primary no-underline transition-all duration-300 hover:-translate-y-[5px] hover:border-[rgba(58,134,255,0.3)]"
			>
				<div class="text-4xl mb-6">
					<svg
						role="img"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						class="size-12"
						fill="currentColor"
					>
						<path
							d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
						/>
					</svg>
				</div>
				<h3 class="text-2xl font-semibold mb-4 tracking-tight">GitHub Repository</h3>
				<p class="text-text-secondary">Browse the source code, report issues, and contribute</p>
			</a>
		</div>
	</div>
</section>

<!-- Get Started Section -->
<section class="py-24 bg-bg-primary text-center relative">
	<div class="container mx-auto px-6 max-w-7xl">
		<div
			class="bg-bg-card rounded-2xl p-8 md:p-16 border border-border-color max-w-5xl mx-auto relative overflow-hidden"
		>
			<div
				class="absolute w-[500px] h-[500px] top-[-250px] right-[-250px] rounded-full"
				style="background: radial-gradient(circle, rgba(58,134,255,0.1) 0%, rgba(58,134,255,0) 70%);"
			></div>

			<div class="relative z-10">
				<h2 class="text-4xl font-bold mb-6 gradient-text">Get Started in Seconds</h2>
				<p class="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
					Install ScopedSort to start organizing your code more efficiently
				</p>

				<div
					class="bg-bg-code rounded-xl p-6 my-8 max-w-2xl mx-auto text-left font-mono text-sm leading-relaxed border border-border-color code-content"
				>
					<div><span class="comment"># Install via npm</span></div>
					<div>npm install string-content-sort</div>
					<div class="my-2"></div>
					<div><span class="comment"># Or use the CLI</span></div>
					<div>npm install -g string-content-sort-cli</div>
				</div>

				<p class="text-xl text-text-secondary mb-8">Ready to try it out online?</p>

				<div class="flex justify-center">
					<a
						href="/playground"
						class="inline-block px-8 py-3 text-base font-medium bg-accent text-white rounded-lg shadow-lg hover:bg-[#619bff] hover:-translate-y-0.5 transition-all duration-300 hover:shadow-[0_6px_25px_rgba(58,134,255,0.4)]"
						>Try the Playground</a
					>
				</div>
			</div>
		</div>
	</div>
</section>
