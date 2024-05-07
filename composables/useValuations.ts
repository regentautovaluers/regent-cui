export default function useValuations() {
	const runtimeConfig = useRuntimeConfig();
	const { getDetails } = usePrincipal();
	const totalNumber: Ref<number> = ref(0);
	// const searchTotalNumber: Ref<number> = ref(0);
	// const searchTotalPages: Ref<number> = ref(0);
	const ITEMS_PER_PAGE: number = 10;
	const currentPage: Ref<number> = ref(0);
	const totalPages: Ref<number> = ref(0);
	const { openToast } = useToast();
	const valuationsFromSearch: Ref<any[]> = ref([]);
	const searchFilterTerm: Ref<string> = ref("");
	const searchByValuationDate: Ref<string> = ref("");
	const searchValuationLoading: Ref<boolean> = ref(false);
	const recentValuations: Ref<any[]> = ref([]);
	const pendingValuations: Ref<any[]> = ref([]);
	const searchErrorOrEmpty: Ref<boolean> = ref(false);
	const fetchPendingErrorOrEmpty: Ref<boolean> = ref(false);
	const fetchCompleteErrorOrEmpty: Ref<boolean> = ref(false);
	// TODO: Delete this at a later date
	const searchServiceType: Ref<string> = ref("");

	async function searchValuations() {
		searchValuationLoading.value = true;
		try {
			await $fetch("/ava/api/assessment/search_assessment", {
				method: "GET",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				query: {
					uname: runtimeConfig.app.VALUATION_BASE_UNAME,
					pwd: runtimeConfig.app.VALUATION_BASE_PASS,
					corp: getDetails.company,
					reg_no: searchFilterTerm.value,
				},
				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error("Failed to retrieve incidents!");
					}

					const searchResults: any[] = JSON.parse(response._data);
					if (searchResults.length < 1) {
						openToast("Search has no results!", "warning");
						searchErrorOrEmpty.value = true;
					} else {
						valuationsFromSearch.value = searchResults;
						openToast("Search valuations successfull", "success");
					}
				},
			});
		} catch (error) {
			console.log("An error occured: ", error);
			openToast("Failed to load valuations. Reload page!", "danger");
			searchErrorOrEmpty.value = true;
		} finally {
			searchValuationLoading.value = false;
		}
	}

	async function fetchPendingValuations() {
		fetchPendingErrorOrEmpty.value = true;
		try {
			await $fetch("/ava/api/assessment/pending_list", {
				method: "GET",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				query: {
					uname: runtimeConfig.app.VALUATION_BASE_UNAME,
					pwd: runtimeConfig.app.VALUATION_BASE_PASS,
					corp: getDetails.company,
				},
				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error("Failed to retrieve incidents!");
					}

					pendingValuations.value = JSON.parse(response._data);
					fetchPendingErrorOrEmpty.value = false;
					openToast(
						"Successfully loaded your pending valuations",
						"success"
					);
				},
			});
		} catch (error) {
			console.log("An error occured: ", error);
			openToast("Failed to load your members. Reload page!", "danger");
		}
	}

	async function fetchRecentValuations() {
		fetchCompleteErrorOrEmpty.value = true;
		try {
			await $fetch("/ava/api/assessment/assessments_list", {
				method: "GET",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				query: {
					uname: runtimeConfig.app.VALUATION_BASE_UNAME,
					pwd: runtimeConfig.app.VALUATION_BASE_PASS,
					corp: getDetails.company,
				},
				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error("Failed to retrieve incidents!");
					}

					recentValuations.value = JSON.parse(response._data);
					fetchCompleteErrorOrEmpty.value = false;
					openToast(
						"Successfully loaded your recent valuations",
						"success"
					);
				},
			});
		} catch (error) {
			console.log("An error occured: ", error);
			openToast("Failed to load your members. Reload page!", "danger");
		}
	}

	function performValuationListsProcessing(sourceList: any[]): any[] {
		// Filter the aggData array based on the searchFilterTerm
		let filteredData = sourceList.filter((item) => {
			// Check if the searchFilterTerm matches any of the specified fields
			const termMatch = item.vehicleRegNumber.includes(
				searchFilterTerm.value
			);

			// Return true if both filters match or if both filters are disabled (empty strings)
			return (
				termMatch ||
				(searchFilterTerm.value === "" &&
					searchServiceType.value === "")
			);
		});

		totalNumber.value = filteredData.length;
		totalPages.value = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

		// Calculate the start and end indices for the current page
		const startIndex = currentPage.value * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;

		// Return only the items for the current page
		return filteredData.slice(startIndex, endIndex);
	}

	// Add a method to navigate to the next page
	function nextPage() {
		if (currentPage.value < totalPages.value - 1) {
			currentPage.value++;
		}
	}

	// Add a method to navigate to the previous page
	function prevPage() {
		if (currentPage.value > 0) {
			currentPage.value--;
		}
	}

	// function performSearchListProcessing(sourceList: any[]): any {
	// 	searchTotalNumber.value = sourceList.length;
	// 	searchTotalPages.value = Math.ceil(sourceList.length / ITEMS_PER_PAGE);

	// 	// Calculate the start and end indices for the current page
	// 	const startIndex = currentPage.value * ITEMS_PER_PAGE;
	// 	const endIndex = startIndex + ITEMS_PER_PAGE;

	// 	// Return only the items for the current page
	// 	return sourceList.slice(startIndex, endIndex);
	// }

	const computedCompleteValuations = computed(() => {
		return performValuationListsProcessing(recentValuations.value);
	});

	const computedPendingValuations = computed(() => {
		return performValuationListsProcessing(pendingValuations.value);
	});

	// const computedSearchValuations = computed(() => {
	// 	return performSearchListProcessing(valuationsFromSearch.value);
	// });

	return {
		fetchRecentValuations,
		fetchPendingValuations,
		searchValuations,
		nextPage,
		prevPage,
		searchFilterTerm,
		computedPendingValuations,
		computedCompleteValuations,
		fetchCompleteErrorOrEmpty,
		fetchPendingErrorOrEmpty,
		valuationsFromSearch,
		searchErrorOrEmpty,
		searchValuationLoading,
		totalPages,
		currentPage,
		searchByValuationDate,
	};
}
