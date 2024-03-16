import type { ApplicationRoute } from "~/types/types";

const applicationRoutes: ApplicationRoute[] = [
	{
		id: 1,
		displayName: "Home",
		icon: "/sidenav/home-icon.svg",
		routeName: "dashboard-home",
	},
	{
		id: 2,
		displayName: "Vehicle Valuation",
		icon: "sidenav/vehicle-valuation-icon.svg",
		routeName: "valuation-home",
		children: [
			{
				id: 1,
				displayName: "All Valuations",
				routeName: "valuation-all-valuations",
			},
			{
				id: 2,
				displayName: "Create Authorization Letter",
				routeName: "valuation-authorization-letter",
			},
			{
				id: 3,
				displayName: "Reports",
				routeName: "valuation-reports",
			},
			{
				id: 4,
				displayName: "User Management",
				routeName: "valuation-user-management",
			},
			{
				id: 5,
				displayName: "Tampered Vehicles",
				routeName: "valuation-tampered-vehicles",
			},
		],
	},
	{
		id: 3,
		displayName: "Roadside Assistance",
		icon: "sidenav/roadside-ass-icon.svg",
		routeName: "ava-home",
		children: [
			{
				id: 1,
				displayName: "Towing",
				routeName: "ava-towing",
			},
			{
				id: 2,
				displayName: "Tyre Change",
				routeName: "ava-tyre-change",
			},

			{
				id: 4,
				displayName: "Jumpstarting",
				routeName: "ava-jumpstarting",
			},
			{
				id: 5,
				displayName: "Fuel Delivery",
				routeName: "ava-fuel-delivery",
			},
			{
				id: 3,
				displayName: "Mobile Service",
				routeName: "ava-mobile-service",
			},
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
		icon: "sidenav/settings-icon.svg",
		routeName: "dashboard-settings",
	},
	{
		id: 5,
		displayName: "Support",
		icon: "sidenav/support-icon.svg",
		routeName: "dashboard-support",
	},
	{
		id: 6,
		displayName: "Memberships",
		icon: "sidenav/memberships-icon.svg",
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
