export default async function () {
	const { openToast } = useToast();
	const membersList: Ref<any[]> = ref([]);
	const page: Ref<number> = ref(0);
	const size: Ref<number> = ref(10);
	const totalNumber: Ref<number> = ref(0);
	const totalPages: Ref<number> = ref(0);
	const runtimeConfig = useRuntimeConfig();
	const { getDetails } = usePrincipal();
	const fetchingMoreData: Ref<boolean> = ref(false);
	const fetchErrorOccured: Ref<boolean> = ref(false);
	const fetchedPages: Ref<number[]> = ref([]);
	const route = useRoute();

	try {
		await $fetch(
			`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/memberships`,
			{
				method: "GET",
				query: {
					corporateId: getDetails.company,
					page: page.value,
					size: size.value,
				},
				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error(
							"Failed to retrieve corporate's members"
						);
					}

					totalNumber.value = response._data.totalCount;
					totalPages.value = response._data.totalPages;

					// we add page 0 to the list of fetchedPages so that we dont fetch it again
					fetchedPages.value.push(0);

					filterMembersRecord(
						response._data.memberships,
						determineFilterFlag()
					);
				},
			}
		);
	} catch (error) {
		console.log("An error occured: ", error);
		fetchErrorOccured.value = true;
		openToast("Failed to load your members. Reload page!", "danger");
	}

	watch(
		page,
		async (newValue) => {
			if (
				!fetchedPages.value.includes(newValue) &&
				newValue < totalPages.value
			) {
				console.log(
					"condition for running filter met... will be fetching more data..."
				);
				fetchingMoreData.value = true;
				try {
					await $fetch(
						`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/memberships`,
						{
							method: "GET",
							query: {
								corporateId: getDetails.company,
								page: newValue,
								size: size.value,
							},
							async onResponse({ response }) {
								if (response.status !== 200) {
									throw new Error(
										"Failed to retrieve corporate's members"
									);
								}
								filterMembersRecord(
									response._data.memberships,
									determineFilterFlag()
								);
							},
						}
					);
				} catch (error) {
					console.log("An error occured: ", error);
					openToast(
						"Failed to load more members. Reload page!",
						"danger"
					);
				} finally {
					fetchingMoreData.value = false;
				}
			}
		},
		{ immediate: true }
	);

	function filterMembersRecord(records: object[], filterFlag: string): void {
		// Filter the memberships array
		const filteredMemberships: object[] = records.filter(
			(membership: any) => {
				return membership.membershipVehicleCounts.some(
					(vehicleCount: any) => {
						return vehicleCount.membership_name === filterFlag;
					}
				);
			}
		);

		if (filteredMemberships.length === 0) {
			// page.value += 1;
		} else {
			membersList.value = membersList.value.concat(filteredMemberships);
		}
	}

	function determineFilterFlag(): string {
		const routeName = route.name;
		let filterFlag: string = "";

		if (routeName === "roadside-members") {
			filterFlag = "Roadside Assistance";
		} else if (routeName === "emergency-members") {
			filterFlag = "Emergency Evacuation";
		}

		return filterFlag;
	}

	return {
		membersList,
		determineFilterFlag,
		page,
		totalPages,
		fetchingMoreData,
	};
}
