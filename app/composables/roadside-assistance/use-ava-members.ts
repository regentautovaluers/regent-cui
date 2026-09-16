export function useAVAMembers() {
  const { public: pubConf } = useRuntimeConfig();
  const { triggerModal } = useModal();
  const { $showToast } = useNuxtApp();
  const { get } = useStandardizedApi();
  const REQ_PAGE_SIZE = 12;
  const page = ref(0);
  const query = computed(() => ({
    size: REQ_PAGE_SIZE,
    page: page.value,
  }));
  const activeDescription: Ref<0 | 1> = ref(0);
  const activeAVAMember: Ref<Pick<
    AVAMember,
    "full_name" | "phone_number" | "userEmail"
  > | null> = ref(null);
  const memberVehicleEntries: Ref<SlimmedGetCorporateAVAMemberVehicles> = ref({
    membershipVehicles: [],
    pagination: null,
  });
  const loadingMemberVehicles = ref(false);
  const serviceDescriptions: readonly {
    name: string;
    description: string;
  }[] = [
    {
      name: "Roadside Assistance",
      description:
        "Our 24/7 road rescue service gets you back on track, whether it’s a flat tire or a breakdown. We are, committed to minimizing disruptions and maximizing safety \
        on the road, so you can continue your journey with peace of mind!",
    },
    {
      name: "Emergency Evacuation",
      description:
        "Whether it’s a remote wilderness \
				rescue or a medical evacuation, our team combines the speed of air travel with the stability of ground \
				support, ensuring your safety during critical moments.",
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

  const {
    data: avaMemberDistribution,
    status: loadingAVAMemberDistributionStatus,
    refresh: refreshAVAMemberDistributionStatus,
  } = useApiData<AVAMemberVehicleDistribution>(
    computed(() => `ava-member-distribution`),
    "/api/roadside-assistance/load-ava-members-distribution",
    {
      query,
      lazy: false,
      // Keep previous data visible while fetching the next page for seamless UX
      dedupe: "defer",
    },
  );

  const transformDistribution = computed(() => {
    if (!avaMemberDistribution.value) {
      return {
        distribution: [
          { name: "Paid", value: 25 },
          { name: "Unpaid", value: 25 },
          { name: "Active", value: 25 },
          { name: "Inactive", value: 25 },
        ],
        total: 25 + 25,
      };
    }
    return {
      distribution: [
        { name: "Paid", value: Math.trunc(avaMemberDistribution.value.paid) },
        {
          name: "Unpaid",
          value: Math.trunc(avaMemberDistribution.value.unpaid),
        },
        {
          name: "Active",
          value: Math.trunc(avaMemberDistribution.value.active),
        },
        {
          name: "Inactive",
          value: Math.trunc(avaMemberDistribution.value.inactive),
        },
      ],
      total:
        avaMemberDistribution.value.paid + avaMemberDistribution.value.unpaid,
    };
  });

  function triggerLoadMemberVehicles(
    fullName: string,
    email: string | null,
    phone: string | null,
  ) {
    // set the active member
    activeAVAMember.value = {
      full_name: fullName,
      phone_number: phone,
      userEmail: email,
    };

    //  trigger the modal
    triggerModal();

    // then start the loading process
    loadMemberVehicles(0);
  }

  async function loadMemberVehicles(page: number) {
    try {
      loadingMemberVehicles.value = true;
      // build the request URL
      let requestUrl = `/api/roadside-assistance/load-ava-member-vehicles?page=${page}&size=${pubConf.PAGE_SIZE}`;
      if (activeAVAMember.value) {
        if (activeAVAMember.value.phone_number) {
          requestUrl +=
            requestUrl + `&userPhone=${activeAVAMember.value.phone_number}`;
        }

        if (activeAVAMember.value.userEmail) {
          requestUrl +=
            requestUrl + `&userEmail=${activeAVAMember.value.userEmail}`;
        }
      }
      let vehicleEntries = await get(requestUrl);

      if (vehicleEntries.success) {
        const response =
          vehicleEntries as StandardSuccessResponse<SlimmedGetCorporateAVAMemberVehicles>;
        // set the pagination
        memberVehicleEntries.value.pagination = response.data.pagination;

        // copy in the vehicles
        for (let x of response.data.membershipVehicles) {
          memberVehicleEntries.value.membershipVehicles.push(x);
        }
      }
    } catch (ex) {
      $showToast({
        title: "Failed to load vehicles!",
        description: "Something went wrong. Please try again!",
        color: "error",
      });
    } finally {
      loadingMemberVehicles.value = false;
    }
  }

  return {
    page,
    avaMembers,
    status,
    getActiveDescription,
    activeDescription,
    activeAVAMember,
    avaMemberDistribution,
    loadingAVAMemberDistributionStatus,
    loadingMemberVehicles,
    memberVehicleEntries,
    transformDistribution,
    refreshAVAMemberDistributionStatus,
    triggerLoadMemberVehicles,
    loadMemberVehicles,
    refresh,
  };
}
