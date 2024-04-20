export default async function () {
	const { openToast } = useToast();
	const runtimeConfig = useRuntimeConfig();
	const membersList: Ref<any[]> = ref([]);
	const page: Ref<number> = ref(0);
	const size: Ref<number> = ref(10);
	const { getDetails } = usePrincipal();
	const totalNumber: Ref<number> = ref(0);
	const totalPages: Ref<number> = ref(0);
	const fetchErrorOrEmpty: Ref<boolean> = ref(false);
	const fetchedPages: Ref<number[]> = ref([]);
	const searchFilterTerm: Ref<string> = ref("");
	const searchMembershipCategory: Ref<string> = ref("");
	const fetchingMoreData: Ref<boolean> = ref(false);

	try {
		fetchErrorOrEmpty.value = true;
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
					membersList.value = response._data.memberships;
					totalNumber.value = response._data.totalCount;
					totalPages.value = response._data.totalPages;

					// we add page 0 to the list of fetchedPages so that when then user scrolls through the pages,
					// we dont fetch it again
					fetchedPages.value.push(0);
					fetchErrorOrEmpty.value = false;
				},
			}
		);
	} catch (error) {
		console.log("An error occured: ", error);
		fetchErrorOrEmpty.value = true;
		openToast("Failed to load your members. Reload page!", "danger");
	}

	const computedPagedList = computed(() => {
		const start = (page.value + 1 - 1) * size.value;
		const end = start + size.value;

		if (membersList.value?.length !== 0) {
			if (membersList.value?.length < 1) {
				return membersList.value;
			} else {
				return membersList.value?.slice(start, end);
			}
		}
	});

	watch([searchFilterTerm, searchMembershipCategory], async (newValues) => {
		if (newValues[0] !== "" || newValues[1] !== "") {
			// before querying for anything, reset the values set by the inital load or default page loads
			membersList.value = [];
			totalPages.value = 0;
			fetchedPages.value = [];

			try {
				await $fetch(
					`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/memberships`,
					{
						method: "GET",
						query: {
							corporateId: getDetails.company,
							page: page.value,
							size: size.value,
							...(newValues[0] !== ""
								? { searchTerm: newValues[0] }
								: {}),
							...(newValues[1] !== ""
								? { category: newValues[1] }
								: {}),
						},
						async onResponse({ response }) {
							if (response.status !== 200) {
								throw new Error(
									"Failed to retrieve filtered corporate's members"
								);
							}
							membersList.value = response._data.memberships;
							totalPages.value = response._data.totalPages;

							// we add page 0 to the list of fetchedPages so that when then user scrolls through the pages,
							// we dont fetch it again
							fetchedPages.value.push(0);
						},
					}
				);
			} catch (error) {
				console.log("An error occured: ", error);
				fetchErrorOrEmpty.value = true;
				openToast(
					"Failed to load filtered members. Reload page!",
					"danger"
				);
			}
		}
	});

	watch(page, async (newValue, oldValue) => {
		if (fetchedPages.value.includes(newValue)) {
			return;
		} else if (
			newValue > oldValue &&
			!fetchedPages.value.includes(newValue)
		) {
			try {
				fetchingMoreData.value = false;
				await $fetch(
					`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/memberships`,
					{
						method: "GET",
						query: {
							corporateId: getDetails.company,
							page: newValue,
							size: size.value,
							...(searchFilterTerm.value !== ""
								? { searchTerm: searchFilterTerm.value }
								: {}),
							...(searchMembershipCategory.value !== ""
								? { category: searchMembershipCategory.value }
								: {}),
						},
						async onResponse({ response }) {
							if (response.status !== 200) {
								throw new Error(
									"Failed to retrieve corporate's members"
								);
							}
							membersList.value = membersList?.value?.concat(
								response._data.memberships
							);
							fetchedPages.value.push(newValue);
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
	});

	function reducePage(newPageView: number) {
		page.value = newPageView;
	}

	return {
		totalNumber,
		page,
		totalPages,
		fetchErrorOrEmpty,
		searchFilterTerm,
		searchMembershipCategory,
		computedPagedList,
		fetchingMoreData,
		reducePage,
		fetchedPages,
	};
}
