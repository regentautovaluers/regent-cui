import { type CoreRoute } from '~/types';

export default function () {
	const route = useRoute();
	const { getPrincipal } = useAuth();
	const navigationRoutes = reactive([
		{
			id: 0,
			screenName: 'Home',
			routeName: 'mobivaluer-home',
			renderRoute: true,
		} as CoreRoute,
		{
			id: 1,
			screenName: 'Roadside Assistance',
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
					screenName: 'Road Assistance Reports',
					routeName: 'ra-all-incidents',
					renderRoute: true,
				},
				{
					id: 3,
					screenName: 'Request Roadside Assistance',
					routeName: 'ra-towing-request',
					renderRoute: true,
				},
			],
		},
		{
			id: 2,
			screenName: 'Vehicle Valuation',
			routeName: 'vehicle-valuation-home',
			renderRoute: true,
			childRoutes: [
				{
					id: 1,
					screenName: 'Authorization Letters',
					routeName: 'vehicle-valuation-create-authorization-letter',
					renderRoute: true,
				},
				{
					id: 2,
					screenName: 'Fleet Reports',
					routeName: 'vehicle-valuation-fleet-reports',
					renderRoute: true,
				},
				{
					id: 3,
					screenName: 'General Valuation Report',
					routeName: 'vehicle-valuation-report',
					renderRoute: false,
				},
			],
		},
		{
			id: 3,
			screenName: 'Collateral Verification Hub',
			routeName: 'collateral-verification-query-collateral',
			renderRoute: true,
			childRoutes: [
				{
					id: 1,
					screenName: 'Onboard Assets',
					routeName: 'collateral-verification-onboard-fraudsters',
					renderRoute: false,
				},
				{
					id: 2,
					screenName: 'Onboard Assets',
					routeName: 'collateral-verification-bulk-onboard-fraudsters',
					renderRoute: false,
				},
				{
					id: 3,
					screenName: 'Manage List',
					routeName: 'collateral-verification-manage-list',
					renderRoute: false,
				},
				{
					id: 4,
					screenName: 'Query Collateral',
					routeName: 'collateral-verification-query-collateral',
					renderRoute: false,
				},
			],
		},
		{
			id: 4,
			screenName: 'Regent Tracking',
			routeName: 'regent-tracking-home',
			renderRoute: ['BANK', 'MICRO_FINANCE'].includes(getPrincipal.value.corpType!),
			childRoutes: [
				{
					id: 1,
					screenName: 'Traceability Reports',
					routeName: 'regent-tracking-traceability-report',
					renderRoute: false,
				},
			],
		},
		{
			id: 5,
			screenName: 'Insurance Telematics',
			routeName: 'insurance-telematics-all-vehicles',
			renderRoute: getPrincipal.value.corpType == 'INSURANCE',
			childRoutes: [
				{
					id: 1,
					screenName: 'Traceability Reports',
					routeName: 'regent-tracking-traceability-report',
					renderRoute: false,
				},
			],
		},
		// {
		// 	id: 6,
		// 	screenName: 'Emergency Evacuation',
		// 	routeName: 'emergency-evacuation-home',
		// 	renderRoute: true,
		// },
		// {
		// 	id: 7,
		// 	screenName: 'Accident Management',
		// 	routeName: 'accident-management-home',
		// 	renderRoute: true,
		// },
		// {
		// 	id: 8,
		// 	screenName: 'Garage',
		// 	routeName: 'garage-home',
		// 	renderRoute: true,
		// },
		// {
		// 	id: 9,
		// 	screenName: 'Parts',
		// 	routeName: 'parts-home',
		// 	renderRoute: true,
		// },
	]);
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

	function doesRoutePathInclude(substring: string): boolean {
		return route.path.includes(substring);
	}

	const fuzzyRouteNameMatch = (routeName: string, coreRoute: CoreRoute): boolean => {
		if ((route.name as string) == routeName) return true;

		if (coreRoute.childRoutes) {
			for (const childRoute of coreRoute.childRoutes) {
				if ((route.name as string) == childRoute.routeName) return true;
			}
		}
		return false;
	};

	return {
		navigationRoutes,
		currentScreenName,
		doesRouteNameMatch,
		doesRoutePathInclude,
		fuzzyRouteNameMatch,
	};
}
