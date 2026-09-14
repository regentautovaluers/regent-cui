export function useAVAMembers() {
  const REQ_PAGE_SIZE = 12;
  const page = ref(0);
  const query = computed(() => ({
    size: REQ_PAGE_SIZE,
    page: page.value,
  }));
  const activeDescription: Ref<0 | 1> = ref(0);
  const serviceDescriptions: readonly {
    name: string;
    description: string;
  }[] = [
    {
      name: "Roadside Assistance",
      description:
        "Our 24/7 road rescue service swiftly gets you back on track, whether it’s a flat tire or a breakdown. \
				Trust our services to ensure a smooth ride, committed to minimizing disruptions and maximizing safety \
        on the road, so you can continue your journey with peace of mind!",
    },
    {
      name: "Emergency Evacuation",
      description:
        "Our emergency response service is your lifeline during critical moments. Whether it’s a remote wilderness \
				rescue or a medical evacuation, our team combines the speed of air travel with the stability of ground \
				support, ensuring your safety when every second counts.",
    },
  ];
  const getActiveDescription = computed(
    () => serviceDescriptions[activeDescription.value]!,
  );
  const {
    data: avaMembers,
    status,
    refresh,
  } = useApiData<CorporateAVAMembers>(
    computed(() => `corporate-ava-members-${JSON.stringify(toValue(query))}`),
    "/api/roadside-assistance/load-ra-members",
    {
      query,
      lazy: false,
      // Keep previous data visible while fetching the next page for seamless UX
      dedupe: "defer",
    },
  );

  return {
    page,
    avaMembers,
    status,
    getActiveDescription,
    activeDescription,
    refresh,
  };
}
