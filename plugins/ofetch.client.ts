import { ofetch } from 'ofetch';

export default defineNuxtPlugin(() => {
	const {
		AVA_BASE_URL,
		LEGACY_VALUATION_BASE_URL,
		VALUATION_BASE_URL,
		LEGACY_VALUATION_API_KEY,
	} = useRuntimeConfig();

	globalThis.$fetch = ofetch.create({
		async onRequest({ options }) {
			const baseURL = options.baseURL;

			if (baseURL == VALUATION_BASE_URL) {
				const valuationAuthToken = useCookie('valuation_auth_token');
				options.headers.set('Authorization', `Bearer ${valuationAuthToken.value}`);
			}

			if (baseURL == AVA_BASE_URL) {
				const avaBasicAuthToken = useCookie('ava_basic_auth_token');
				const avaApiKey = useCookie('ava_basic_auth_token');

				options.headers.set('Ava-Basic-Auth', avaBasicAuthToken.value as string);
				options.headers.set('Ava-Api-Key', avaApiKey.value as string);
			}

			if (baseURL == LEGACY_VALUATION_BASE_URL) {
				options.headers.set('X-API-Key', LEGACY_VALUATION_API_KEY);
			}

			/*
			let headers: Headers = {};

			// if the request is going to AVA
			if (options.baseURL == runtimeConfig.AVA_BASE_URL) {
				headers['Ava-Basic-Auth'] = getAvaBasicAuthToken.value!;
				headers['Ava-Api-Key'] = getAvaApiKey.value!;
			}

			// if the request us going to Fraud Detection
			if (options.baseURL == runtimeConfig.FRAUD_DETECTION_BASE_URL) {
				headers['X-Client-Id'] = encryptCorporateClientId(
					getPrincipal()?.corpOrganization.corpId!,
				);

				// API-key
				const USERNAME = getPrincipal()?.corpOrganization.corpId!;
				const PASSWORD = 'k8#F$j2!L9@qW7%zX5^pR3&vN6*';
				headers['X-Api-Key'] = SecurityUtil.generateApiKey(USERNAME, PASSWORD);

				// if we are paying up for tokens -> not via invoice
				if (route.name == 'collateral-verification-home') {
					headers['Entity-Token'] = encryptCorporateClientId(
						getPrincipal()?.corpOrganization.corpId!,
					);
				}
			}

			// if the request is going to valuation
			if (options.baseURL == runtimeConfig.VALUATION_BASE_URL) {
				headers['Authorization'] = `Bearer ${getValuationAuthToken.value}`;
			}

			options.headers = { ...options.headers, ...headers };
			*/
		},
	});
});
