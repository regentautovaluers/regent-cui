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
	modules: ["nuxt-icons", "nuxt-icon", "nuxt-icon"],
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
			],
			title: "Regent Auto Valuers",
		},
	},
	plugins: ["~/plugins/preline.client.ts"],
});
