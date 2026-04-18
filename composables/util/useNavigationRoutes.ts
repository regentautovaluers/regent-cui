import { type CoreRoute } from '~/types';

export default function () {
	const route = useRoute();
	const { getPrincipal } = useAuth();
	const { bypassRegentTrackingLogin } = useRegentTrackingAuth();

	const navigationRoutes = reactive([
		{
			id: 0,
			screenName: 'Home',
			routeName: 'mobivaluer-home',
			renderRoute: true,
			icon: 'icon-[material-symbols-light--home-outline-rounded]',
		} as CoreRoute,
		{
			id: 1,
			screenName: 'Roadside Assistance',
			routeName: 'ava-memberships-home',
			renderRoute: true,
			icon: 'icon-[material-symbols-light--auto-towing]',
			description:
				'Our 24/7 road rescue service swiftly gets you back on track, whether it’s a flat tire or a breakdown. \
				Trust our services to ensure a smooth ride, so you can continue your journey with peace of mind! \
				We’re committed to minimizing disruptions and maximizing safety on the road.',
			shortDescription:
				'Our 24/7 road rescue service swiftly gets you back on track, whether it’s a flat tire or a breakdown.',
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
			routeName: 'vehicle-valuation-ongoing-reports',
			renderRoute: true,
			icon: 'icon-[material-symbols-light--garage-money-outline-rounded]',
			description:
				'With over 20 years of experience, we offer fair and data-driven vehicle assessments you can trust. \
			 	Access all your reports as well as request for valuations from our new AVA app available on the Google \
				Playstore and coming soon to the Apple App Store.',
			shortDescription:
				'With over 20 years of experience, we offer fair and data-driven vehicle assessments you can trust.',
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
			screenName: 'Collateral Verification',
			routeName: 'collateral-verification-home',
			renderRoute: false,
			icon: 'icon-[material-symbols-light--document-search-outline]',
			description:
				'Introducing our newest addition to our range of services. Our collateral verification \
				system tracks various vehicles used as loan collaterals, alongside verification of various \
				client specifics like national IDs and vehicle vins. Help us grow our database!',
			shortDescription:
				'Our system tracks vehicles used as collateral, alongside verification of various \
				specifics like national IDs',
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
			routeName: bypassRegentTrackingLogin() ? 'regent-tracking-home' : 'regent-track-auth',
			renderRoute: ['BANK', 'MICRO_FINANCE', 'SACCO'].includes(
				getPrincipal()?.corpOrganization.corpClass!,
			),
			icon: 'icon-[material-symbols-light--globe-location-pin]',
			description:
				'Our vehicle and fleet tracking services ensure that you have real-time visibility over your assets. \
			 	Monitor your fleet, track your vehicles, and stay on top of your logistics. Our GPS tracking technology \
				is reliable, efficient, and easy to use, providing you with the insights you need to optimize your operations \
				and make informed decisions.',
			shortDescription:
				'With over 20 years of experience, we offer fair and data-driven vehicle assessments you can trust.',
			childRoutes: [
				{
					id: 1,
					screenName: 'Traceability Reports',
					routeName: 'regent-tracking-traceability-report',
					renderRoute: true,
				},
			],
		},
		{
			id: 5,
			screenName: 'Insurance Telematics',
			routeName: bypassRegentTrackingLogin()
				? 'insurance-telematics-all-vehicles'
				: 'regent-track-auth',
			renderRoute:
				getPrincipal()?.corpOrganization.corpClass == 'INSURANCE' ||
				getPrincipal()?.corpOrganization.corpId ==
					'CP-COAD-3A14D3' /*hardcoded for demo purposes*/,
			description:
				"Gain instant and reliable insights into driver's behaviour analysis and risk assessment. Our simple \
				classification algorithm uses various metrics to intricately classify drives into categories depending on various measurable \
				metrics like harsh acceleration and braking.",
			shortDescription:
				"Gain instant and reliable insights into driver's behaviour analysis and risk assessment.",
			icon: 'icon-[material-symbols-light--map-outline-rounded]',
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
			id: 6,
			screenName: 'Emergency Evacuation',
			routeName: 'emergency-evacuation-home',
			renderRoute: false,
			description:
				'Our emergency response service is your lifeline during critical moments. Whether it’s a remote wilderness \
				rescue or a medical evacuation, our team combines the speed of air travel with the stability of ground \
				support, ensuring your safety when every second counts.',
			shortDescription:
				'Our emergency response service is your lifeline during critical moments where every second counts.',
		},
		{
			id: 7,
			screenName: 'Accident Management',
			routeName: 'accident-management-home',
			renderRoute: false,
		},
		{
			id: 8,
			screenName: 'Garage',
			routeName: 'garage-home',
			renderRoute: false,
		},
		{
			id: 9,
			screenName: 'Parts',
			routeName: 'parts-home',
			renderRoute: false,
		},
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
