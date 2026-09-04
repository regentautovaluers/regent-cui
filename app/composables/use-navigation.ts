export default function () {
  const { meta, name: routeName } = useRoute();

  const routes: RoutesAvailable[] = [
    {
      id: 0,
      name: "home",
      screenName: "Home",
      display: true,
      icon: "icon-[material-symbols--grid-view-outline-rounded]",
    },
    {
      id: 0,
      name: "ava-chat",
      screenName: "AVA Chat",
      display: false,
      icon: "icon-[material-symbols--family-star]",
    },
    {
      id: 1,
      name: "vehicle-valuation",
      screenName: "Vehicle Valuation",
      display: true,
      icon: "icon-[material-symbols--bar-chart-rounded]",
      children: [
        {
          id: 0,
          name: "valuations-all-valuations",
          screenName: "All Valuations",
          display: true,
        },
        {
          id: 1,
          name: "valuations-create-authorization-letter",
          screenName: "Create Authorization Letter",
          display: true,
        },
        {
          id: 2,
          name: "valuations-legacy",
          screenName: "Legacy Reports (Mobi)",
          display: true,
        },
      ],
    },
    {
      id: 2,
      name: "ra-home",
      screenName: "Roadside Assistance",
      display: true,
      icon: "icon-[material-symbols--auto-towing-rounded]",
      children: [
        {
          id: 0,
          name: "ra-request-assistance",
          screenName: "Request Assistance",
          display: true,
        },
        {
          id: 1,
          name: "ra-previous-incidents",
          screenName: "Previous Incidents",
          display: true,
        },
        {
          id: 2,
          name: "ra-onboard-client",
          screenName: "Client Onboarding",
          display: true,
        },
      ],
    },
    {
      id: 3,
      name: "cv-onboard-single",
      screenName: "Collateral Verification",
      display: true,
      icon: "icon-[material-symbols--auto-towing-rounded]",
      children: [
        {
          id: 0,
          name: "cv-onboard-single",
          screenName: "Onboard Record",
          display: true,
          icon: "icon-[material-symbols--add-notes]",
        },
        {
          id: 1,
          name: "cv-onboard-bulk",
          screenName: "Onboard Bulk Records",
          display: true,
          icon: "icon-[material-symbols--assignment-add-outline]",
        },
        {
          id: 2,
          name: "cv-collateral-list",
          screenName: "Collateral List",
          display: true,
          icon: "icon-[material-symbols--lists-rounded]",
        },
        {
          id: 3,
          name: "cv-collateral-verification",
          screenName: "Collateral Verification",
          display: true,
          icon: "icon-[material-symbols--database-search-outline-rounded]",
        },
        {
          id: 4,
          name: "cv-iprs-verification",
          screenName: "IPRS Verification",
          display: true,
          icon: "icon-[material-symbols--screen-search-desktop-outline-rounded]",
        },
        {
          id: 5,
          name: "cv-token-manager",
          screenName: "Manage Search Tokens",
          display: true,
          icon: "icon-[material-symbols--energy-savings-leaf-outline-rounded]",
        },
      ],
    },
    {
      id: 4,
      name: "tracking-home",
      screenName: "Regent Tracking",
      display: true,
      icon: "icon-[material-symbols--globe-location-pin-rounded]",
      children: [
        {
          id: 0,
          name: "tracking-traceability-reports",
          screenName: "Traceability Reports",
          display: true,
        },
      ],
    },
    {
      id: 5,
      name: "telematics-home",
      screenName: "Insurance Telematics",
      display: true,
      icon: "icon-[material-symbols--data-exploration-rounded]",
    },
    {
      id: 6,
      name: "settings-home",
      screenName: "Settings",
      display: false,
      icon: "icon-[material-symbols--data-exploration-rounded]",
      children: [
        {
          id: 0,
          name: "settings-add-user",
          screenName: "Add New User",
          display: true,
          icon: "icon-[material-symbols--person-add-outline-rounded]",
        },
        {
          id: 1,
          name: "settings-manage-users",
          screenName: "Manage All Users",
          display: true,
          icon: "icon-[material-symbols--person-edit-rounded]",
        },
        {
          id: 2,
          name: "settings-manage-branches",
          screenName: "Your Branches",
          display: true,
          icon: "icon-[material-symbols--other-houses-outline-rounded]",
        },
      ],
    },
  ];

  function routeNameMatch(t: string) {
    return routeName === t;
  }

  return {
    routes,
    routeNameMatch,
  };
}
