export default defineNuxtConfig({
	build: {
		transpile: ['mosha-vue-toastify', '@googlemaps/js-api-loader'],
	},
	ssr: true,
	devtools: { enabled: true },
	css: ['~/assets/css/main.css'],
	devServer: {
		port: 8000,
	},
	components: [
		{
			path: '~/components',
			pathPrefix: false,
		},
	],
	modules: ['nuxt-icons', 'nuxt-icon'],
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	app: {
		head: {
			title: 'Regent Auto Valuers',
			meta: [
				{
					name: 'viewport',
					content: 'width=device-width, initial-scale=1',
				},
			],
			link: [
				{
					rel: 'apple-touch-icon',
					href: '/favicon/apple-touch-icon.png',
					sizes: '180x180',
					type: 'image/png',
				},
				{
					rel: 'icon',
					href: '/favicon/favicon-32x32.png',
					type: 'image/png',
				},
			],
			script: [],
		},
	},
	plugins: ['~/plugins/preline.client.ts', '~/plugins/chart.client.ts'],
	runtimeConfig: {
		public: {
			VALUATION_BASE_URL: process.env.VALUATION_BASE_URL,
			AVA_BASE_URL: process.env.AVA_BASE_URL,
		},
		app: {
			GOOGLE_MAPS_APIKEY: process.env.GOOGLE_MAPS_APIKEY,
		},
	},
});
