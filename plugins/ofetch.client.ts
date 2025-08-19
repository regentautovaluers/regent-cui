import { ofetch } from 'ofetch';
import SecurityUtil from '~/utils/security-util';

interface Headers {
	[key: string]: string;
}

export default defineNuxtPlugin(() => {
	const { public: runtimeConfig } = useRuntimeConfig();
	const route = useRoute();
	const { getAuthToken, encryptCorporateClientId, getPrincipal } = useAuth();

	globalThis.$fetch = ofetch.create({
		async onRequest({ options }) {
			let headers: Headers = {};

			// if the request is going to AVA
			if (options.baseURL == runtimeConfig.AVA_BASE_URL) {
				headers['Ava-Basic-Auth'] = SecurityUtil.generateBase64Token(
					'MOBIVALUER',
					'LiV1tKgaqEtwPn7',
				);
				headers['Ava-Api-Key'] = 'fe08ab023b8f4d44a8612a64f4f642c9bcb34850';
			}

			// if the request us going to Fraud Detection
			if (options.baseURL == runtimeConfig.FRAUD_DETECTION_BASE_URL) {
				headers['X-Client-Id'] = encryptCorporateClientId(getPrincipal.value.corpId);

				// if we are paying up for tokens -> not via invoice
				if (route.name == 'collateral-verification-home') {
					headers['Entity-Token'] = encryptCorporateClientId(getPrincipal.value.corpId);
				}
			}

			// if the request is going to valuation
			if (options.baseURL == runtimeConfig.VALUATION_BASE_URL) {
				headers['Authorization'] = `Bearer ${getAuthToken.value}`;
			}

			options.headers = { ...options.headers, ...headers };
		},
	});
});
