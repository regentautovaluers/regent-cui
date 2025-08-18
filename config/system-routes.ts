import type { CoreRoute } from '~/types';

const navigationRoutes: readonly CoreRoute[] = [
	{
		id: 0,
		screenName: 'Welcome',
		routeName: 'mobivaluer-home',
		renderRoute: true,
	},
	{
		id: 1,
		screenName: 'AVA Road Assistance',
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
				screenName: 'Road Members',
				routeName: 'ava-ra-members',
				renderRoute: true,
			},
			{
				id: 3,
				screenName: 'Emergency (E) Members',
				routeName: 'ava-ee-members',
				renderRoute: true,
			},
			{
				id: 4,
				screenName: 'Road Assistance Reports',
				routeName: 'ra-all-incidents',
				renderRoute: true,
			},
			{
				id: 5,
				screenName: 'Request Road Assistance',
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
	// {
	// 	id: 4,
	// 	screenName: 'Tracking',
	// 	routeName: 'regent-tracking-home',
	// 	renderRoute: true,
	// 	childRoutes: [
	// 		{
	// 			id: 1,
	// 			screenName: 'Traceability Reports',
	// 			routeName: 'regent-tracking-traceability-report',
	// 			renderRoute: true,
	// 		},
	// 	],
	// },
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
];

export default navigationRoutes;
