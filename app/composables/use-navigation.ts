export default function () {
  const { meta, name: routeName } = useRoute();

  const routes: RoutesAvailable[] = [
    {
      id: 0,
      name: "home",
      screenName: "Home",
      display: true,
      icon: "icon-[material-symbols--garage-home-rounded]",
    },
    {
      id: 0,
      name: "ava-chat",
      screenName: "AVA Chat",
      display: true,
      icon: "icon-[material-symbols--family-star]",
    },
    {
      id: 1,
      name: "vehicle-valuation",
      screenName: "Vehicle Valuation",
      display: true,
      icon: "icon-[material-symbols--garage-money-rounded]",
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
      id: 4,
      name: "telematics-home",
      screenName: "Insurance Telematics",
      display: true,
      icon: "icon-[material-symbols--data-exploration-rounded]",
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
