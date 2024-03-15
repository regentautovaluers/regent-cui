// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	css: ["~/assets/css/main.css"],
	ssr: false,
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
				{
					rel: "stylesheet",
					href: "./node_modules/apexcharts/dist/apexcharts.css",
					tagPosition: "head",
				},
			],
			title: "Regent Auto Valuers",
			script: [
				{
					src: "./node_modules/lodash/lodash.min.js",
				},
				{
					src: "./node_modules/apexcharts/dist/apexcharts.min.js",
					tagPosition: "bodyClose",
				},
				{
					src: "https://preline.co/assets/js/hs-apexcharts-helpers.js",
				},
			],
		},
	},
	pinia: {
		autoImports: ["defineStore", "storeToRefs"],
	},
	plugins: ["~/plugins/preline.client.ts"],
	routeRules: {
		"/api/**": {
			proxy: {
				to: "https://mobi.regentautovaluers.co.ke/ava/api/**",
			},
		},
	},
	runtimeConfig: {
		public: {
			DEV_TIME_HOST: process.env.DEV_TIME_HOST,
		},
	},
});
