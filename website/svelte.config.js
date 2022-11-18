// @ts-check
import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { mdsvex, escapeSvelte } from 'mdsvex';
import { createShikiHighlighter, renderCodeToHTML } from 'shiki-twoslash';

const highlighter = await createShikiHighlighter({
	theme: 'github-dark'
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess(),
		mdsvex({
			extensions: ['.md'],
			// @ts-ignore
			rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
			smartypants: { quotes: false },
			highlight: {
				highlighter(code, lang, meta) {
					const lineHighlightsMatch = meta?.match(/{.+}/);
					/** @type {{[k:string]: true}} */
					const lineHighlights = {};

					if (lineHighlightsMatch && lineHighlightsMatch[0]) {
						for (const innerMatch of lineHighlightsMatch[0].match(/(\d+-?\d*)/g) || []) {
							lineHighlights[innerMatch] = true;
						}
					}

					// trim end to remove \n at the end that's usually there, might cause some errors
					if (code[code.length - 1] === '\n') {
						code = code.substring(0, code.length - 1);
					}

					const html = renderCodeToHTML(
						code,
						lang || '',
						{ highlight: lineHighlights },
						// @ts-ignore
						{},
						highlighter
					);

					return escapeSvelte(html);
				}
			}
		})
	],
	extensions: ['.svelte', '.md'],
	kit: {
		adapter: adapter()
	}
};

export default config;
