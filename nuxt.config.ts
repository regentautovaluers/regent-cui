// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: { enabled: true },
	ssr: true,
	build: {
		transpile: ['mosha-vue-toastify', '@googlemaps/js-api-loader'],
	},
	devServer: {
		port: 8000,
	},
	components: [
		{
			path: '~/components',
			pathPrefix: false,
		},
	],
	css: ['~/assets/css/main.css'],
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	app: {
		head: {
			title: 'Regent Valuers',
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
	runtimeConfig: {
		public: {
			VALUATION_BASE_URL: process.env.VALUATION_BASE_URL,
			AVA_BASE_URL: process.env.AVA_BASE_URL,
			APP_VERSION: process.env.APP_VERSION,
			COPYRIGHT_YEAR: process.env.COPYRIGHT_YEAR,
			GOOGLE_MAPS_GEOFENCING_COUNTRY: process.env.GOOGLE_MAPS_GEOFENCING_COUNTRY,
		},
		app: {
			GOOGLE_MAPS_APIKEY: process.env.GOOGLE_MAPS_APIKEY,
		},
	},
	modules: ['@nuxtjs/i18n', '@nuxtjs/harlem'],
	i18n: {
		vueI18n: './i18n.config.ts', // if you are using custom path, default
	},
});
