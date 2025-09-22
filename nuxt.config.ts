import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	// devServer: {
	// 	port: 8000,
	// },
	css: ['~/assets/css/main.css'],
	vite: {
		plugins: [tailwindcss()],
		base: '/',
	},
	build: {
		transpile: ['mosha-vue-toastify', '@googlemaps/js-api-loader'],
	},
	components: [
		{
			path: '~/components',
			pathPrefix: false,
		},
	],
	imports: {
		dirs: ['./utils/**', './composables/**'],
	},
	modules: ['@nuxtjs/harlem'],
	app: {
		// layoutTransition: { name: 'layout', mode: 'out-in' },
		// pageTransition: { name: 'page', mode: 'out-in' },
		head: {
			title: 'Regent Group',
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
				{
					rel: 'icon',
					href: '/favicon/favicon-16x16.png',
					type: 'image/png',
				},
				{
					rel: 'manifest',
					href: '/manifest.json',
					type: 'application/manifest+json',
				},
			],
			script: [],
		},
	},
	runtimeConfig: {
		// private properties
		GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
		BOTPRESS_CLIENT_ID: process.env.BOTPRESS_CLIENT_ID,

		// public properties
		public: {
			VALUATION_BASE_URL: '',
			AVA_BASE_URL: '',
			FRAUD_DETECTION_BASE_URL: '',
			REGENT_TRACK_BASE_URL: '',
			APP_VERSION: '',
			COPYRIGHT_YEAR: '',
			GOOGLE_MAPS_GEOFENCING_COUNTRY: '',
			REGENT_TRACK_CERTS_BASE_URL: '',
			REGENT_AUTOMATIONS_BASE_URL: '',
			REGENT_MEDIA_STORAGE_BASE_URL: '',

			// firebase config
			FIREBASE_API_KEY: '',
			FIREBASE_AUTH_DOMAIN: '',
			FIREBASE_DATABASE_URL: '',
			FIREBASE_PROJECT_ID: '',
			FIREBASE_STORAGE_BUCKET: '',
			FIREBASE_MESSAGING_SENDER_ID: '',
			FIREBASE_APP_ID: '',
			FIREBASE_EMAIL: '',
			FIREBASE_PASSWORD: '',
		},
		app: {},
	},
});
