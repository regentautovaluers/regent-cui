export default function () {
	const { openToast } = useToast();
	const runtimeConfig = useRuntimeConfig();
	const membersList: Ref<any[]> = ref([]);
	const page: Ref<number> = ref(0);
	const size: Ref<number> = ref(10);
	const { getPrincipal } = useAuth();
	const totalNumber: Ref<number> = ref(0);
	const totalPages: Ref<number> = ref(0);
	const fetchErrorOrEmpty: Ref<boolean> = ref(false);
	const searchFilterTerm: Ref<string> = ref("");
	const searchMembershipCategory: Ref<string> = ref("");

	const computedRequestURI: ComputedRef<string> = computed(() => {
		let baseURI = `/api/v1/memberships?corporateId=${getPrincipal.value.corpId}&page=${page.value}&size=${size.value}`;
		if (searchFilterTerm.value !== "") {
			baseURI += `&searchTerm=${searchFilterTerm.value}`;
		}
		if (searchMembershipCategory.value !== "") {
			baseURI += `&category=${searchMembershipCategory.value}`;
		}
		return baseURI;
	});

	const { pending: fetchingMoreData, execute: refreshMembers } = useFetch(
		computedRequestURI,
		{
			baseURL: runtimeConfig.public.AVA_BASE_URL,
			method: "GET",
			server: false,
			lazy: false,

			onResponse({ response }) {
				if (response.status !== 200) {
					throw new Error("Failed to retrieve corporate's members");
				}
				membersList.value = response._data.memberships;
				totalNumber.value = response._data.totalCount;
				totalPages.value = response._data.totalPages;

				if (membersList.value.length > 0) {
					fetchErrorOrEmpty.value = false;
				}
			},
			onRequestError({ error }) {
				console.log("An error occured: ", error);
				fetchErrorOrEmpty.value = true;
				openToast(
					"Failed to load your members. Reload page!",
					"danger"
				);
			},
		}
	);

	const clearFiltering = () => {
		searchFilterTerm.value = "";
		searchMembershipCategory.value = "";
		page.value = 0;
	};

	const loadNextPage = () => {
		if (page.value + 1 < totalPages.value) {
			page.value++;
		}
	};

	const loadPreviousPage = () => {
		if (page.value > 0) {
			page.value--;
		}
	};

	return {
		membersList,
		totalNumber,
		page,
		totalPages,
		fetchErrorOrEmpty,
		searchFilterTerm,
		searchMembershipCategory,
		fetchingMoreData,
		refreshMembers,
		clearFiltering,
		loadNextPage,
		loadPreviousPage,
	};
}
