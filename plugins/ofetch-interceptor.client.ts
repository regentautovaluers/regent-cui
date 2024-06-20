import { ofetch } from "ofetch";

export default defineNuxtPlugin((_nuxtApp) => {
	const runtimeConfig = useRuntimeConfig();

	globalThis.$fetch = ofetch.create({
		async onRequest({ request, options }) {
			
		},
	});
});
