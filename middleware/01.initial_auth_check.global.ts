import type { ValuationPrinicpal } from '~/types/app-security/app-principal-types';
import type { StandardSuccessResponse } from '~/types/proxy-types';

export default defineNuxtRouteMiddleware(async (to) => {
	const nuxtApp = useNuxtApp();
	const authToken = useCookie('valuation_auth_token');
	const isAuthenticated = !!authToken.value;
	const unauthPages = ['exterior-home'];
	const { get } = useStandardizedApi();
	const vpStore = useValuationPrincipalStore();

	if (unauthPages.includes(to.name as string)) {
		return;
	}

	// Only run auth logic on client during initial hydration or navigation
	if (import.meta.server) {
		return;
	}

	// Case 1: No token, trying to access protected route → redirect to login
	if (!isAuthenticated && !unauthPages.includes(to.name as string)) {
		// Use replace to avoid adding history entry for unauthorized access
		return navigateTo({ name: 'exterior-home' }, { replace: true });
	}

	// Case 3: Has token, needs user data validation/loading
	if (
		isAuthenticated &&
		(to.name == 'password-setup' || !unauthPages.includes(to.name as string))
	) {
		// If we already have principal data in store, skip fetch
		if (vpStore.principal != null) {
			return;
		}

		// Block navigation until we verify/fetch user data
		// Use Nuxt's payload to avoid refetching on hydration
		try {
			vpStore.loadPrincipalLoading = true;
			// Check if we have pending promise from server payload or create new fetch
			const principalData: ValuationPrinicpal | null | undefined =
				await nuxtApp.runWithContext(async () => {
					// Try to use cached data from payload first (SSR→CSR handoff)
					if (nuxtApp.payload.data?.valuationPrincipal) {
						return nuxtApp.payload.data.valuationPrincipal as ValuationPrinicpal;
					}

					// Fetch fresh data
					const endpoint = '/api/app-security/load-valuation-principal';

					const response = await get<ValuationPrinicpal>(endpoint);

					if (response.success) {
						const data = (response as StandardSuccessResponse<ValuationPrinicpal>).data;
						return data;
					}
				});

			if (!principalData?.userId) {
				throw new Error('Invalid principal details!');
			}

			vpStore.setPrincipal(principalData);
			// Also cache in payload for potential reuse
			if (nuxtApp.isHydrating) {
				nuxtApp.payload.data = nuxtApp.payload.data || {};
				nuxtApp.payload.data.valuationPrincipal = principalData;
			}
		} catch (ex) {
			console.error('Auth verification failed:', ex);
			// Clear invalid token
			authToken.value = null;
			vpStore.cleanPrincipal();

			// Force navigation to login, but use external navigation if hydration is problematic
			if (to.name !== 'exterior-home') {
				// Use window.location for hard redirect during hydration issues
				if (nuxtApp.isHydrating) {
					window.location.href = '/';
					return new Promise(() => {}); // Prevent further execution
				}

				return navigateTo({ name: 'exterior-home' }, { replace: true });
			}
		} finally {
			vpStore.loadPrincipalLoading = false;
		}
	}
});
