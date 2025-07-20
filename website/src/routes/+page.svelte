<script>
	import { Search, RefreshCw, Settings, Globe } from 'lucide-svelte';
	import { Package, Terminal, Code, Github } from 'lucide-svelte';
</script>

<!-- Hero Section -->
<section class="relative py-20 min-h-screen flex items-center overflow-hidden bg-background">
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
					class="text-xl md:text-2xl font-normal text-muted-foreground mb-8 tracking-tight max-w-[550px]"
				>
					A powerful sorting tool for everyone
				</h2>
				<p class="text-lg text-muted-foreground mb-12 max-w-[500px] leading-relaxed">
					Sort content within scopes and sections of your text with precision and flexibility.
					Perfect for organizing imports, lists, and structured data.
				</p>
				<div class="flex flex-wrap gap-6">
					<a
						href="/playground"
						class="inline-block px-8 py-3 text-base bg-primary text-primary-foreground rounded-lg shadow-lg hover:bg-accent-hover hover:-translate-y-0.5 transition-all duration-300 hover:shadow-[0_6px_25px_rgba(58,134,255,0.4)] font-medium"
						>Try Online</a
					>
					<a
						href="/docs"
						class="inline-block px-8 py-3 text-base font-medium bg-transparent border border-border text-foreground rounded-lg hover:bg-white/5 hover:-translate-y-0.5 transition-all duration-300"
						>Documentation</a
					>
				</div>
			</div>

			<div class="relative z-10">
				<div class="grid grid-cols-1 gap-6">
					<!-- Before sorting block -->
					<div class="bg-muted rounded-xl overflow-hidden shadow-custom border border-border">
						<div
							class="flex items-center p-4 bg-[color:var(--color-code-header-bg)] border-b border-border"
						>
							<div class="flex gap-2 mr-4">
								<span class="w-3 h-3 rounded-full bg-[#FF5F56]"></span>
								<span class="w-3 h-3 rounded-full bg-[#FFBD2E]"></span>
								<span class="w-3 h-3 rounded-full bg-[#27C93F]"></span>
							</div>
							<div class="text-sm text-muted-foreground font-mono">Before sorting</div>
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
					<div class="bg-muted rounded-xl overflow-hidden shadow-custom border border-border">
						<div
							class="flex items-center p-4 bg-[color:var(--color-code-header-bg)] border-b border-border"
						>
							<div class="flex gap-2 mr-4">
								<span class="w-3 h-3 rounded-full bg-[#FF5F56]"></span>
								<span class="w-3 h-3 rounded-full bg-[#FFBD2E]"></span>
								<span class="w-3 h-3 rounded-full bg-[#27C93F]"></span>
							</div>
							<div class="text-sm text-muted-foreground font-mono">After sorting (by gender)</div>
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
<section class="py-24 bg-secondary">
	<div class="mx-auto px-6 max-w-[90rem]">
		<h2 class="text-4xl font-bold mb-3 text-center gradient-text">Key Features</h2>
		<p class="text-xl text-muted-foreground mb-16 text-center max-w-3xl mx-auto">
			A powerful solution for organizing and sorting your code with precision
		</p>

		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
			<div
				class="bg-card rounded-xl p-8 border border-border transition-all duration-300 hover:-translate-y-[5px] hover:border-[rgba(58,134,255,0.3)] relative overflow-hidden group"
			>
				<div
					class="absolute inset-x-0 top-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
					style="background: linear-gradient(to right, #3A86FF, transparent);"
				></div>
				<div
					class="w-14 h-14 flex items-center justify-center rounded-xl mb-6 text-primary"
					style="background-color: rgba(58, 134, 255, 0.1);"
				>
					<Search size={28} />
				</div>
				<h3 class="text-2xl font-semibold mb-4 tracking-tight">Scoped Sorting</h3>
				<p class="text-muted-foreground leading-relaxed">
					Sort content only within specific scopes or sections of your text, maintaining the
					structure of your code. Perfect for organizing imports, lists, and structured data without
					affecting the rest of your content.
				</p>
			</div>

			<div
				class="bg-card rounded-xl p-8 border border-border transition-all duration-300 hover:-translate-y-[5px] hover:border-[rgba(58,134,255,0.3)] relative overflow-hidden group"
			>
				<div
					class="absolute inset-x-0 top-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
					style="background: linear-gradient(to right, #3A86FF, transparent);"
				></div>
				<div
					class="w-14 h-14 flex items-center justify-center rounded-xl mb-6 text-primary"
					style="background-color: rgba(58, 134, 255, 0.1);"
				>
					<RefreshCw size={28} />
				</div>
				<h3 class="text-2xl font-semibold mb-4 tracking-tight">Multiple Algorithms</h3>
				<p class="text-muted-foreground leading-relaxed">
					Choose from various sorting algorithms including natural, case-insensitive, numerical, and
					more. Each algorithm is optimized for specific use cases to deliver the best results for
					your data.
				</p>
			</div>

			<div
				class="bg-card rounded-xl p-8 border border-border transition-all duration-300 hover:-translate-y-[5px] hover:border-[rgba(58,134,255,0.3)] relative overflow-hidden group"
			>
				<div
					class="absolute inset-x-0 top-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
					style="background: linear-gradient(to right, #3A86FF, transparent);"
				></div>
				<div
					class="w-14 h-14 flex items-center justify-center rounded-xl mb-6 text-primary"
					style="background-color: rgba(58, 134, 255, 0.1);"
				>
					<Settings size={28} />
				</div>
				<h3 class="text-2xl font-semibold mb-4 tracking-tight">Regex Support</h3>
				<p class="text-muted-foreground leading-relaxed">
					Use regular expressions to define sections and control what gets sorted with powerful
					pattern matching. Create complex sorting rules that adapt to your specific formatting
					needs.
				</p>
			</div>

			<div
				class="bg-card rounded-xl p-8 border border-border transition-all duration-300 hover:-translate-y-[5px] hover:border-[rgba(58,134,255,0.3)] relative overflow-hidden group"
			>
				<div
					class="absolute inset-x-0 top-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
					style="background: linear-gradient(to right, #3A86FF, transparent);"
				></div>
				<div
					class="w-14 h-14 flex items-center justify-center rounded-xl mb-6 text-primary"
					style="background-color: rgba(58, 134, 255, 0.1);"
				>
					<Globe size={28} />
				</div>
				<h3 class="text-2xl font-semibold mb-4 tracking-tight">Cross-Platform</h3>
				<p class="text-muted-foreground leading-relaxed">
					Available as a library, CLI tool, and VS Code extension to fit seamlessly into your
					workflow. Use it anywhere you need to organize and sort your content efficiently.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Integrations Section -->
<section class="py-24 bg-secondary">
	<div class="container mx-auto px-6 max-w-7xl">
		<h2 class="text-4xl font-bold mb-3 text-center gradient-text">Available Integrations</h2>
		<p class="text-xl text-muted-foreground mb-16 text-center max-w-3xl mx-auto">
			Use ScopedSort however you want, wherever you need it
		</p>

		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
			<a
				href="https://www.npmjs.com/package/string-content-sort"
				class="bg-card rounded-xl p-8 border border-border flex flex-col items-start text-foreground no-underline transition-all duration-300 hover:-translate-y-[5px] hover:border-[rgba(58,134,255,0.3)]"
			>
				<div
					class="w-14 h-14 flex items-center justify-center rounded-xl mb-6 text-primary"
					style="background-color: rgba(58, 134, 255, 0.1);"
				>
					<Package size={28} />
				</div>
				<h3 class="text-2xl font-semibold mb-4 tracking-tight">NPM Package</h3>
				<p class="text-muted-foreground">
					Install and use directly in your JavaScript projects with a simple import statement.
					Perfect for Node.js applications and browser-based tools.
				</p>
			</a>

			<a
				href="https://www.npmjs.com/package/string-content-sort-cli"
				class="bg-card rounded-xl p-8 border border-border flex flex-col items-start text-foreground no-underline transition-all duration-300 hover:-translate-y-[5px] hover:border-[rgba(58,134,255,0.3)]"
			>
				<div
					class="w-14 h-14 flex items-center justify-center rounded-xl mb-6 text-primary"
					style="background-color: rgba(58, 134, 255, 0.1);"
				>
					<Terminal size={28} />
				</div>
				<h3 class="text-2xl font-semibold mb-4 tracking-tight">CLI Tool</h3>
				<p class="text-muted-foreground">
					Command-line interface for quick sorting tasks. Ideal for automation scripts, CI/CD
					pipelines, and batch processing of files.
				</p>
			</a>

			<a
				href="https://marketplace.visualstudio.com/items?itemName=karizma.scoped-sort"
				class="bg-card rounded-xl p-8 border border-border flex flex-col items-start text-foreground no-underline transition-all duration-300 hover:-translate-y-[5px] hover:border-[rgba(58,134,255,0.3)]"
			>
				<div
					class="w-14 h-14 flex items-center justify-center rounded-xl mb-6 text-primary"
					style="background-color: rgba(58, 134, 255, 0.1);"
				>
					<Code size={28} />
				</div>
				<h3 class="text-2xl font-semibold mb-4 tracking-tight">VS Code Extension</h3>
				<p class="text-muted-foreground">
					Sort directly in your editor with keyboard shortcuts and context menus. Seamlessly
					integrate sorting into your development workflow.
				</p>
			</a>

			<a
				href="https://github.com/kitesi/scopedsort"
				target="_blank"
				rel="noopener noreferrer"
				class="bg-card rounded-xl p-8 border border-border flex flex-col items-start text-foreground no-underline transition-all duration-300 hover:-translate-y-[5px] hover:border-[rgba(58,134,255,0.3)]"
			>
				<div
					class="w-14 h-14 flex items-center justify-center rounded-xl mb-6 text-primary"
					style="background-color: rgba(58, 134, 255, 0.1);"
				>
					<Github size={28} />
				</div>
				<h3 class="text-2xl font-semibold mb-4 tracking-tight">GitHub Repository</h3>
				<p class="text-muted-foreground">
					Browse the source code, report issues, and contribute to the project. Open source and
					community-driven development.
				</p>
			</a>
		</div>
	</div>
</section>

<!-- Get Started Section -->
<section class="py-24 bg-background text-center relative">
	<div class="container mx-auto px-6 max-w-7xl">
		<div
			class="bg-card rounded-2xl p-8 md:p-16 border border-border max-w-5xl mx-auto relative overflow-hidden"
		>
			<div
				class="absolute w-[500px] h-[500px] top-[-250px] right-[-250px] rounded-full"
				style="background: radial-gradient(circle, rgba(58,134,255,0.1) 0%, rgba(58,134,255,0) 70%);"
			></div>

			<div class="relative z-10">
				<h2 class="text-4xl font-bold mb-6 gradient-text">Get Started in Seconds</h2>
				<p class="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
					Install ScopedSort to start organizing your code more efficiently
				</p>

				<div
					class="bg-muted rounded-xl p-6 my-8 max-w-2xl mx-auto text-left font-mono text-sm leading-relaxed border border-border code-content"
				>
					<div><span class="comment"># Install via npm</span></div>
					<div>npm install string-content-sort</div>
					<div class="my-2"></div>
					<div><span class="comment"># Or use the CLI</span></div>
					<div>npm install -g string-content-sort-cli</div>
				</div>

				<p class="text-xl text-muted-foreground mb-8">Ready to try it out online?</p>

				<div class="flex justify-center">
					<a
						href="/playground"
						class="inline-block px-8 py-3 text-base font-medium bg-primary text-primary-foreground rounded-lg shadow-lg hover:bg-accent-hover hover:-translate-y-0.5 transition-all duration-300 hover:shadow-[0_6px_25px_rgba(58,134,255,0.4)]"
						>Try the Playground</a
					>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.code-content {
		color: var(--color-code-foreground);
		background-color: var(--color-code-background);
	}

	.code-content .comment {
		color: var(--color-code-comment);
	}

	/* .code-content .keyword {
		color: var(--color-code-keyword);
	}

	.code-content .string {
		color: var(--color-code-string);
	}

	.code-content .variable {
		color: var(--color-code-variable);
	} */

	.gradient-text {
		background-image: linear-gradient(to right, #ffffff, #bbdefb);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
</style>
