import { ofetch } from 'ofetch';
import { generateApiKey, generateApiKeySingle } from '~/shared/security-functions';

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

			if (baseURL == config.public.IPRS_BASE_URL) {
				headers['X-API-Key'] = 'iprs_1dd577aded3f1dacf70fd8e9799df4299fd71bf9401e409d';
			}

			if (baseURL == config.public.FRAUD_DETECTION_BASE_URL) {
				const { getPrincipal } = useAuth();
				headers['X-API-Key'] = generateApiKey(
					getPrincipal()?.corpOrganization.corpId!,
					'k8#F$j2!L9@qW7%zX5^pR3&vN6*',
				);
				headers['x-client-id'] = generateApiKeySingle(
					getPrincipal()?.corpOrganization.corpId,
				);
			}

			options.headers = { ...options.headers, ...headers };
		},
	});
});
