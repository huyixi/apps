const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts,md,svx}', './static/**/*.{html,md,json}'],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1.5rem',
				xl: '2rem'
			},
			screens: {
				'2xl': '1360px'
			}
		},
		extend: {
			colors: {
				surface: {
					DEFAULT: '#f7f7f7',
					foreground: '#111111',
					muted: '#525252',
					dark: '#121212',
					'dark-foreground': '#f5f5f5'
				},
				accent: {
					DEFAULT: '#2563eb',
					subtle: '#eff6ff',
					dark: '#1d4ed8'
				},
				border: {
					DEFAULT: '#e4e4e7',
					dark: '#2d2d30'
				},
				neutral: colors.neutral,
				stone: colors.stone,
				sky: colors.sky,
				amber: colors.amber
			},
			fontFamily: {
				sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
				mono: ['"JetBrains Mono"', 'Menlo', 'monospace']
			}
		},
		borderRadius: {
			none: '0px',
			xs: '1px',
			sm: '2px',
			DEFAULT: '4px',
			md: '6px',
			lg: '8px',
			full: '9999px'
		}
	},
	plugins: [require('@tailwindcss/typography')]
};
