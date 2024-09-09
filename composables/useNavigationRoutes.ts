import { type CoreRoute } from '~/types';

const useNavigationRoutes = () => {
	const route = useRoute();
	const navigationRoutes: readonly CoreRoute[] = [
		{
			id: 0,
			screenName: 'Home',
			routeName: 'mobivaluer-home',
			renderRoute: true,
		},
		{
			id: 1,
			screenName: 'AVA Memberships',
			routeName: 'ava-memberships-home',
			renderRoute: true,
			childRoutes: [
				{
					id: 1,
					screenName: 'Onboard Member',
					routeName: 'ava-membership-types',
					renderRoute: true,
				},
				{
					id: 2,
					screenName: 'Roadside Members',
					routeName: 'ava-ra-members',
					renderRoute: true,
				},
				{
					id: 3,
					screenName: 'Emergency (E) Members',
					routeName: 'ava-ee-members',
					renderRoute: true,
				},
			],
		},
		{
			id: 2,
			screenName: 'Roadside Assistance',
			routeName: 'ra-home',
			renderRoute: true,
			childRoutes: [
				{
					id: 1,
					screenName: 'All Incidents',
					routeName: 'ra-all-incidents',
					renderRoute: true,
				},
				{
					id: 2,
					screenName: 'Towing',
					routeName: 'ra-towing-request',
					renderRoute: true,
				},
				{
					id: 3,
					screenName: 'Tyre Change',
					routeName: 'ra-tyrechange-request',
					renderRoute: true,
				},
				{
					id: 4,
					screenName: 'Jumpstarting',
					routeName: 'ra-jumpstarting-request',
					renderRoute: true,
				},
				{
					id: 5,
					screenName: 'Fuel Delivery',
					routeName: 'ra-fueldelivery-request',
					renderRoute: true,
				},
			],
		},
		{
			id: 3,
			screenName: 'Vehicle Valuation',
			routeName: 'vehicle-valuation-home',
			renderRoute: true,
			childRoutes: [
				{
					id: 1,
					screenName: 'User Management',
					routeName: 'vehicle-valuation-manage-user',
					renderRoute: true,
				},
				{
					id: 2,
					screenName: 'Authorization Letter',
					routeName: 'vehicle-valuation-authorization-letter',
					renderRoute: true,
				},
			],
		},
	];
	const currentScreenName: ComputedRef<string> = computed(() => {
		const routeName: string = route.name as string;
		let screenName: string = '';

		for (const routeObject of navigationRoutes) {
			if (routeObject.routeName === routeName) {
				screenName = routeObject.screenName;
				break;
			}
			if (routeObject.childRoutes) {
				for (const childRouteObject of routeObject.childRoutes) {
					if (childRouteObject.routeName === routeName) {
						screenName = childRouteObject.screenName;
						break;
					}
				}
			}
		}

		return screenName;
	});

	const doesRouteNameMatch = (routeName: string): boolean => {
		return route.name === routeName;
	};

	return {
		navigationRoutes,
		currentScreenName,
		doesRouteNameMatch,
	};
};

export default useNavigationRoutes;
