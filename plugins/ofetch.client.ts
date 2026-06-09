import { ofetch } from 'ofetch';

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();

	globalThis.$fetch = ofetch.create({
		async onRequest({ options }) {
			const baseURL = options.baseURL;
			let headers: Record<string, string> = {};

			if (baseURL == config.public.VALUATION_BASE_URL) {
				const valuationAuthToken = useCookie('valuation_auth_token');
				headers['Authorization'] = `Bearer ${valuationAuthToken.value}`;
			}

			if (baseURL == config.public.AVA_BASE_URL) {
				const avaBasicAuthToken = useCookie('ava_basic_auth_token');
				const avaApiKey = useCookie('ava_api_key');

				headers['Ava-Basic-Auth'] = avaBasicAuthToken.value as string;
				headers['Ava-Api-Key'] = avaApiKey.value as string;
			}

			options.headers = { ...options.headers, ...headers };
		},
	});
});
