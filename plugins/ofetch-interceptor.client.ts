import { ofetch } from "ofetch";

export default defineNuxtPlugin((_nuxtApp) => {
	const runtimeConfig = useRuntimeConfig();

	globalThis.$fetch = ofetch.create({
		async onRequest({ request, options }) {
			const requestUrl: string = request.toString();
			const runtimeEnvironment = runtimeConfig.public.NODE_ENV;

			/**
			 * This interceptor modifies the baseURL of all requests going to valuation (ITM)
			 * to use the full URL instead of the proxy since the proxy never compiled into production
			 */
			if (
				runtimeEnvironment === "production" &&
				requestUrl.includes("/ava/api/")
			) {
				options.baseURL = runtimeConfig.public.VALUATION_BASE_URL;
			}
		},
	});
});
