/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./components/**/*.{js,vue,ts}',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./plugins/**/*.{js,ts}',
		'./app.vue',
		'./error.vue',
		'./node_modules/flowbite/**/*.{js,ts}',
	],
	theme: {
		extend: {
			scale: {
				'103': '1.03',
			}
		},
	},
	plugins: [
		require('flowbite/plugin')({
			charts: true,
		}),
	],
};
