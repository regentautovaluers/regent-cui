export default defineNuxtConfig({
	routeRules: {
		// turn of server side rendering for all roadside assistance routes due to Google Maps Rendering
		// "/dashboard/roadside-assistance/": {
		// 	ssr: false,
		// },

		// turn of SSR for the home route
		"/": {
			ssr: false,
		},

		// turn on SSR for the roadside members and e-members lists routes
		"/dashboard/memberships/roadside-members": {
			ssr: false,
		},

		"/dashboard/memberships/emergency-members": {
			ssr: false,
		},
		"/api/**": {
			proxy: {
				to: "https://mobi.regentautovaluers.co.ke/ava/api/**",
			},
		},
	},
	ssr: true,
	devtools: { enabled: true },
	css: ["~/assets/css/main.css"],
	devServer: {
		port: 8000,
	},
	components: [
		{
			path: "~/components",
			pathPrefix: false,
		},
	],
	modules: ["nuxt-icons", "nuxt-icon", "nuxt-icon", "@pinia/nuxt"],
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	app: {
		head: {
			title: "Regent Auto Valuers",
			meta: [
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1",
				},
			],
			link: [
				{
					rel: "apple-touch-icon",
					href: "/favicon/apple-touch-icon.png",
					sizes: "180x180",
					type: "image/png",
				},
				{
					rel: "icon",
					href: "/favicon/favicon-32x32.png",
					type: "image/png",
				},
				{
					rel: "manifest",
					href: "/manifest.json",
				},
			],
			script: [],
		},
	},
	pinia: {
		autoImports: ["defineStore", "storeToRefs"],
	},
	plugins: [
		"~/plugins/preline.client.ts",
		{ src: "~/plugins/apexcharts.client.ts", ssr: false },
	],
	runtimeConfig: {
		public: {
			DEV_TIME_HOST: process.env.DEV_TIME_HOST,
			VALUATION_BASE_URL: process.env.VALUATION_BASE_URL,
			AVA_BASE_URL: process.env.AVA_BASE_URL,
		},
		app: {
			GOOGLE_MAPS_APIKEY: process.env.GOOGLE_MAPS_APIKEY,
			VALUATION_BASE_UNAME: process.env.VALUATION_BASE_UNAME,
			VALUATION_BASE_PASS: process.env.VALUATION_BASE_PASS,
		},
	},
});
