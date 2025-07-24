import { type LoggedInPrincipal } from '~/types';
import { setAuthenticatedPrincipal } from '~/stores/authenticated-principal';

export default defineNuxtRouteMiddleware((to) => {
	const nuxtApp = useNuxtApp();
	const runtimeConfig = useRuntimeConfig();

	// will run only on initial client load
	if (import.meta.client && nuxtApp.isHydrating) {
		const currentPageRoute = useCookie('current-page-route'); // to take user to last page they were in before they closed the app
		const authToken = useCookie('auth-token');
		const refreshToken = useCookie('refresh-token');

		// attempting to access console without existing credentials
		if ((!authToken.value || !refreshToken.value) && to.name != 'exterior-home') {
			return navigateTo({ name: 'exterior-home' });
		}

		// attempting to access login page without existing credentials
		if ((!authToken.value || !refreshToken.value) && to.name == 'exterior-home') {
			return;
		}

		// attempting to access console with existing credentials
		if (authToken.value && refreshToken.value && to.path.includes('console')) {
			//we try to get user details to set in store
			let principalDetails: LoggedInPrincipal | null = null;
			try {
				$fetch('/api/v1/auth/corporate-account/get-principal-credentials', {
					baseURL: runtimeConfig.public.VALUATION_BASE_URL,
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					onResponse({ response }) {
						if (response.ok) {
							const data = response._data.data;
							principalDetails = {
								userId: data.userId,
								username: data.username,
								email: data.email,
								phonenumber: data.phoneNumber,
								roles: data.userRoles,
								corpId: data.corpOrganization.corpId,
								branchId: data.branchId,
								branchName: '',
								corpName: data.corpOrganization.corpName,
								roleInOrganization: data.roleInOrganization,
								isBroker: data.corpOrganization.broker,
							};

							setAuthenticatedPrincipal(
								principalDetails as unknown as LoggedInPrincipal,
							);
						} else {
							throw new Error('Principal data retrieval failed. Try again!');
						}
					},
				});
			} catch (_) {
				// for any error clear storage and move user to login
				authToken.value = null;
				refreshToken.value = null;
				return navigateTo({ name: 'exterior-home' });
			}

			// we were able to get user credentials without an error

			// redirect to console home if previous route is unknown
			if (!currentPageRoute.value) {
				return navigateTo({ name: 'mobivaluer-home' });
			}

			// redirect to console home if previous route was /
			if (to.fullPath == '/' && currentPageRoute.value && currentPageRoute.value == '/') {
				return navigateTo({ name: 'mobivaluer-home' });
			}

			// redirect to current route if it was not /
			if (to.fullPath == '/' && currentPageRoute.value && currentPageRoute.value != '/') {
				return navigateTo(currentPageRoute.value);
			}

			return;
		}
	}
});
