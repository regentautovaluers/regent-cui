import type { moreServices } from "~/types/types";

export default function () {
	const moreServicesData: moreServices[] = [
		{
			icon: "/icons/sidenav/roadside-ass-icon.svg",
			title: "Roadside Assistance",
			description: "Prompt roadside support for your clients",
			pageName: "ava-home",
		},
		// {
		// 	icon: "/icons/sidenav/acc-management-icon.svg",
		// 	title: "Accident Management",
		// 	description: "Simplify accident claims for your clients",
		// 	pageName: "",
		// },
		// {
		// 	icon: "/icons/sidenav/emergency-services-icon.svg",
		// 	title: "Emergency Evacuation",
		// 	description:
		// 		"Ensure your clients' safety with swift evacuation services",
		// 	pageName: "",
		// },
		// {
		// 	icon: "/icons/sidenav/garage-icon.svg",
		// 	title: "Garage Services",
		// 	description:
		// 		"Comperehensive auto care solutions at our trusted garages",
		// 	pageName: "",
		// },
		// {
		// 	icon: "/icons/sidenav/support-icon.svg",
		// 	title: "Platform Support",
		// 	description:
		// 		"Need something? Ask us for it through our support page",
		// 	pageName: "dashboard-support",
		// },
	];

	return {
		moreServicesData,
	};
}
