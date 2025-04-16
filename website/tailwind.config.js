/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './src/**/*.svelte', './src/app.html'],
	safelist: [
		'gradient-text',
		'bg-accent',
		'bg-accent-hover',
		'hover:bg-accent-hover',
		'text-text-primary',
		'text-text-secondary',
		'text-text-tertiary',
		'bg-bg-primary',
		'bg-bg-secondary',
		'bg-bg-card',
		'bg-bg-code',
		'border-border-color',
		'text-white',
		'text-transparent',
		'bg-gradient-to-r',
		'bg-clip-text'
	],
	theme: {
		extend: {
			colors: {
				'bg-primary': '#0D0D0D',
				'bg-secondary': '#111111',
				'bg-card': '#171717',
				'bg-code': '#1E1E1E',
				'text-primary': '#FFFFFF',
				'text-secondary': 'rgba(255, 255, 255, 0.7)',
				'text-tertiary': 'rgba(255, 255, 255, 0.5)',
				accent: '#3A86FF',
				'accent-hover': '#619BFF',
				'border-color': 'rgba(255, 255, 255, 0.1)',
				'code-comment': '#6A737D'
			},
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
				mono: ['SF Mono', 'JetBrains Mono', 'monospace']
			},
			boxShadow: {
				custom: '0 4px 30px rgba(0, 0, 0, 0.3)'
			},
			gradientColorStops: {
				'white-blue': ['#FFFFFF', '#BBDEFB']
			}
		}
	},
	plugins: []
};
