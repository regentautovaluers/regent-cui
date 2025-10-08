import { type LoggedInPrincipal } from '~/types';
import { setPrincipal } from '~/stores/authenticated-principal';

export default defineNuxtRouteMiddleware((to) => {
	const nuxtApp = useNuxtApp();
	const runtimeConfig = useRuntimeConfig();

	// will run only on initial client load
	if (import.meta.client && nuxtApp.isHydrating) {
		const authToken = useCookie('auth-token');

		// attempting to access console without existing credentials
		if (!authToken.value && to.name != 'exterior-home') {
			return navigateTo({ name: 'exterior-home' });
		}

		// attempting to access login page without existing credentials
		if (!authToken.value && to.name == 'exterior-home') {
			return;
		}

		// attempting to access console with existing credentials
		if (authToken.value) {
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
								corpName: data.corpOrganization.corpName,
								roleInOrganization: data.roleInOrganization,
								isBroker: data.corpOrganization.broker,
								corpType: data.corpOrganization.corpClass,
							};

							setPrincipal(principalDetails as unknown as LoggedInPrincipal);

							// if the user is on the login page, take them to the console
							if (to.name == 'exterior-home') {
								return navigateTo({ name: 'mobivaluer-home' });
							} else {
								// else if they're on the console, proceed with the navigation
								return;
							}
						} else {
							throw new Error('Principal data retrieval failed. Try again!');
						}
					},
				});
			} catch (_) {
				// for any error clear storage and move user to login
				authToken.value = null;
				return navigateTo({ name: 'exterior-home' });
			}

			return;
		}
	}
});
