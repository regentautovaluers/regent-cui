export default defineNuxtConfig({
	build: {
		transpile: ["mosha-vue-toastify", "@googlemaps/js-api-loader"],
	},
	ssr: true,
	routeRules: {
		"/ava/api/**": {
			proxy: {
				to: "https://mobi.regentautovaluers.co.ke/ava/api/**",
			},
		},
	},
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
	plugins: ["~/plugins/preline.client.ts", "~/plugins/chart.ts"],
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
