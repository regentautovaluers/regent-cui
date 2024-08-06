export default function () {
	const runtimeConfig = useRuntimeConfig();
	const { openToast } = useToast();
	const fuelDeliveryIncidents: Ref<any[]> = ref([]);
	const jumpstartingIncidents: Ref<any[]> = ref([]);
	const towingIncidents: Ref<any[]> = ref([]);
	const tyrechangeIncidents: Ref<any[]> = ref([]);
	const searchFilterTerm: Ref<string | null> = ref('');
	const searchServiceType: Ref<string | ''> = ref('');
	const totalNumber: Ref<number> = ref(0);
	const currentPage: Ref<number> = ref(0);
	const totalPages: Ref<number> = ref(0);
	const ITEMS_PER_PAGE: number = 10;
	const { getPrincipal } = useAuth();

	const compiledData = computed(() => {
		const aggData = [
			...(fuelDeliveryIncidents.value || []),
			...(jumpstartingIncidents.value || []),
			...(towingIncidents.value || []),
			...(tyrechangeIncidents.value || []),
		];

		// Filter the aggData array based on the searchFilterTerm and searchServiceType
		let filteredData = aggData.filter((item) => {
			// Check if the searchFilterTerm matches any of the specified fields
			const termMatch =
				item.registration_no.includes(searchFilterTerm.value) ||
				item.user_name.includes(searchFilterTerm.value) ||
				item.user_email.includes(searchFilterTerm.value) ||
				item.user_phone.includes(searchFilterTerm.value);

			// Check if the searchServiceType matches the service field
			const serviceTypeMatch = item.service === searchServiceType.value;

			// Return true if both filters match or if both filters are disabled (empty strings)
			return (
				termMatch ||
				serviceTypeMatch ||
				(searchFilterTerm.value === '' && searchServiceType.value === '')
			);
		});

		totalNumber.value = filteredData.length;
		totalPages.value = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

		// Calculate the start and end indices for the current page
		const startIndex = currentPage.value * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;

		// Return only the items for the current page
		return filteredData.slice(startIndex, endIndex);
	});

	const individualIncidentsCount = computed(() => [
		fuelDeliveryIncidents.value.length,
		jumpstartingIncidents.value.length,
		towingIncidents.value.length,
		tyrechangeIncidents.value.length,
	]);

	const recentIncidentsCol: ComputedRef<any[]> = computed(() => {
		const aggregateArray: any[] = [];

		if (fuelDeliveryIncidents.value.length > 0) {
			aggregateArray.push(fuelDeliveryIncidents.value[0]);
		}
		if (jumpstartingIncidents.value.length > 0) {
			aggregateArray.push(jumpstartingIncidents.value[0]);
		}
		if (towingIncidents.value.length > 0) {
			aggregateArray.push(towingIncidents.value[0]);
		}
		if (tyrechangeIncidents.value.length > 0) {
			aggregateArray.push(tyrechangeIncidents.value[0]);
		}
		return aggregateArray;
	});

	const determineMostRequestedService = computed(() => {
		'Test Data';
	});

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

	const { pending: fetchErrorOrEmpty } = useFetch(
		`/api/v1/corp/reports/services/corporate/${getPrincipal.value.corpId}`,
		{
			baseURL: runtimeConfig.public.AVA_BASE_URL,
			method: 'GET',
			server: false,
			lazy: true,
			async onResponse({ response }) {
				if (response.status !== 200) {
					throw new Error('Failed to retrieve incidents!');
				}
				fuelDeliveryIncidents.value = response._data.fueldelivery;
				jumpstartingIncidents.value = response._data.jumpstarting;
				towingIncidents.value = response._data.towing;
				tyrechangeIncidents.value = response._data.tyrechange;

				if (
					fuelDeliveryIncidents.value?.length > 0 ||
					jumpstartingIncidents.value?.length > 0 ||
					towingIncidents.value?.length > 0 ||
					tyrechangeIncidents.value?.length > 0
				) {
					fetchErrorOrEmpty.value = false;
				}

				openToast('Successfully loaded your incidents', 'success');
			},
		},
	);

	return {
		nextPage,
		prevPage,
		determineMostRequestedService,
		individualIncidentsCount,
		compiledData,
		currentPage,
		searchFilterTerm,
		searchServiceType,
		totalPages,
		fetchErrorOrEmpty,
		recentIncidentsCol,
	};
}
