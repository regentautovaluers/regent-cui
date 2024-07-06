import type { ApplicationRoute } from "~/types/types";

const applicationRoutes: ApplicationRoute[] = [
	{
		id: 1,
		displayName: "Home",
		icon: "/icons/sidenav/home-icon.svg",
		routeName: "dashboard-home",
	},
	{
		id: 2,
		displayName: "Vehicle Valuation",
		icon: "/icons/sidenav/vehicle-valuation-icon.svg",
		routeName: "valuation-home",
		children: [
			// {
			// 	id: 1,
			// 	displayName: "All Valuations",
			// 	routeName: "valuation-all-valuations",
			// },
			// {
			// 	id: 2,
			// 	displayName: "My Authorization Letters",
			// 	routeName: "valuation-authorization-letter",
			// },
			// {
			// 	id: 3,
			// 	displayName: "Reports",
			// 	routeName: "valuation-reports",
			// },
			{
				id: 4,
				displayName: "User Management",
				routeName: "valuation-my-account",
			},
			// {
			// 	id: 5,
			// 	displayName: "Tampered Vehicles",
			// 	routeName: "valuation-tampered-vehicles",
			// },
		],
	},
	{
		id: 3,
		displayName: "Roadside Assistance",
		icon: "/icons/sidenav/roadside-ass-icon.svg",
		routeName: "ava-home",
		children: [
			{
				id: 1,
				displayName: "Towing",
				routeName: "ava-towing",
				icon: "/icons/misc/request-towing-icon.svg",
			},
			{
				id: 2,
				displayName: "Tyre Change",
				routeName: "ava-tyre-change",
				icon: "/icons/misc/tyre-change-icon.svg",
			},

			{
				id: 4,
				displayName: "Jumpstarting",
				routeName: "ava-jumpstarting",
				icon: "/icons/misc/jumpstarting-icon.svg",
			},
			{
				id: 5,
				displayName: "Fuel Delivery",
				routeName: "ava-fuel-delivery",
				icon: "/icons/misc/fuel-delivery-icon.svg",
			},
			// {
			// 	id: 3,
			// 	displayName: "Mobile Service",
			// 	routeName: "ava-mobile-service",
			// 	icon: "/icons/misc/mobile-service-icon.svg",
			// },
			{
				id: 6,
				displayName: "All Incidents",
				routeName: "ava-all-incidents",
			},
		],
	},
	{
		id: 4,
		displayName: "Settings",
		icon: "/icons/sidenav/settings-icon.svg",
		routeName: "dashboard-settings",
	},
	{
		id: 5,
		displayName: "Memberships",
		icon: "/icons/sidenav/memberships-icon.svg",
		routeName: "memberships-home",
		children: [
			{
				id: 1,
				displayName: "Add A New Member",
				routeName: "new-member",
			},
			{
				id: 2,
				displayName: "Manage Fleets",
				routeName: "manage-fleets",
			},
			{
				id: 3,
				displayName: "Roadside Members",
				routeName: "roadside-members",
			},
			{
				id: 4,
				displayName: "Emergency (E) Members",
				routeName: "emergency-members",
			},
		],
	},
];

export default applicationRoutes;
