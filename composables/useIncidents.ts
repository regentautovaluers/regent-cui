export default function () {
	const runtimeConfig = useRuntimeConfig();
	const { openToast } = useToast();
	const fetchErrorOrEmpty: Ref<boolean> = ref(false);
	const fuelDeliveryIncidents: Ref<any[] | null> = ref(null);
	const jumpstartingIncidents: Ref<any[] | null> = ref(null);
	const towingIncidents: Ref<any[] | null> = ref(null);
	const tyrechangeIncidents: Ref<any[] | null> = ref(null);
	const searchFilterTerm: Ref<string | null> = ref("");
	const searchServiceType: Ref<string | ""> = ref("");
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
	});
	const countFuelDelivery = computed(
		() => fuelDeliveryIncidents.value?.length
	);
	const countJumpstarting = computed(
		() => jumpstartingIncidents.value?.length
	);
	const countTowing = computed(() => towingIncidents.value?.length);
	const countTyreChange = computed(() => tyrechangeIncidents.value?.length);
	const recentIncidentsCol: ComputedRef<any[]> = computed(() => {
		const aggregateArray: any[] = [];

		if (
			fuelDeliveryIncidents.value &&
			fuelDeliveryIncidents.value.length > 0
		) {
			aggregateArray.push(fuelDeliveryIncidents.value[0]);
		}
		if (
			jumpstartingIncidents.value &&
			jumpstartingIncidents.value.length > 0
		) {
			aggregateArray.push(jumpstartingIncidents.value[0]);
		}
		if (towingIncidents.value && towingIncidents.value.length > 0) {
			aggregateArray.push(towingIncidents.value[0]);
		}
		if (tyrechangeIncidents.value && tyrechangeIncidents.value.length > 0) {
			aggregateArray.push(tyrechangeIncidents.value[0]);
		}
		return aggregateArray;
	});
	const determineMostRequestedService = computed(() => {
		"Test Data";
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

	function makeServiceTypeFriendly(rawType: string): string {
		let friendlyType: string = "";
		switch (rawType) {
			case "towing":
				friendlyType = "Towing";
				break;
			case "fueldelivery":
				friendlyType = "Fuel Delivery";
				break;
			case "jumpstarting":
				friendlyType = "Jumpstarting";
				break;
			case "tyre change":
				friendlyType = "Tyre Change";
		}

		return friendlyType;
	}

	onMounted(async () => {
		fetchErrorOrEmpty.value = true;
		try {
			await $fetch(
				`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/corp/reports/services/corporate/${getPrincipal.value.corpId}`,
				{
					method: "GET",
					async onResponse({ response }) {
						if (response.status !== 200) {
							throw new Error("Failed to retrieve incidents!");
						}
						fuelDeliveryIncidents.value =
							response._data.fueldelivery;
						jumpstartingIncidents.value =
							response._data.jumpstarting;
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

						openToast(
							"Successfully loaded your incidents",
							"success"
						);
					},
				}
			);
		} catch (error) {
			console.log("An error occured: ", error);
			openToast("Failed to load your members. Reload page!", "danger");
		}
	});

	return {
		nextPage,
		prevPage,
		determineMostRequestedService,
		countJumpstarting,
		countFuelDelivery,
		countTowing,
		countTyreChange,
		compiledData,
		currentPage,
		searchFilterTerm,
		searchServiceType,
		totalPages,
		fetchErrorOrEmpty,
		recentIncidentsCol,
		makeServiceTypeFriendly,
	};
}
