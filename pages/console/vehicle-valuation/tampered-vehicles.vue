<template>
	
</template>

<script setup lang="ts">
	definePageMeta({
		name: "valuation-tampered-vehicles",
		layout: "in-app-layout",
	});

	// const searchFilterTerm: Ref<string | null> = ref(null);
	// const tamperedVehicles: Ref<any[]> = ref([]);
	// const fetchLoading: Ref<boolean> = ref(false);
	// const fetchErrorOrEmpty: Ref<boolean> = ref(false);
	// const runtimeConfig = useRuntimeConfig();
	// const { getPrincipal } = useAuth();
	// const { openToast } = useToast();
	// const { moreServicesData } = useMoreServicesNavData();
	// const totalPages: Ref<number> = ref(0);
	// const totalNumber: Ref<number> = ref(0);
	// const ITEMS_PER_PAGE: number = 10;
	// const currentPage: Ref<number> = ref(0);
	// const tamperedVehiclesLoading: Ref<boolean> = ref(false);
	// const computedTamperedVehicles: ComputedRef<any[]> = computed(() => {
	// 	totalNumber.value = tamperedVehicles.value.length;
	// 	totalPages.value = Math.ceil(
	// 		tamperedVehicles.value.length / ITEMS_PER_PAGE
	// 	);

	// 	// Calculate the start and end indices for the current page
	// 	const startIndex = currentPage.value * ITEMS_PER_PAGE;
	// 	const endIndex = startIndex + ITEMS_PER_PAGE;

	// 	// Return only the items for the current page
	// 	return tamperedVehicles.value.slice(startIndex, endIndex);
	// });

	// // Add a method to navigate to the next page
	// function nextPage() {
	// 	if (currentPage.value < totalPages.value - 1) {
	// 		currentPage.value++;
	// 	}
	// }

	// // Add a method to navigate to the previous page
	// function prevPage() {
	// 	if (currentPage.value > 0) {
	// 		currentPage.value--;
	// 	}
	// }

	// onMounted(async () => {
	// 	tamperedVehiclesLoading.value = true;
	// 	try {
	// 		await $fetch("/ava/api/tampered_vehicles", {
	// 			method: "GET",
	// 			headers: {
	// 				"Content-Type": "application/x-www-form-urlencoded",
	// 			},
	// 			query: {
	// 				uname: runtimeConfig.app.VALUATION_BASE_UNAME,
	// 				pwd: runtimeConfig.app.VALUATION_BASE_PASS,
	// 				corp: getPrincipal.value.corpId,
	// 			},
	// 			async onResponse({ response }) {
	// 				if (response.status !== 200) {
	// 					throw new Error("Failed to retrieve tampered vehicles");
	// 				}

	// 				const searchResults: any[] = JSON.parse(response._data);
	// 				if (searchResults.length < 1) {
	// 					openToast(
	// 						"Tampered vehicles has no results!",
	// 						"warning"
	// 					);
	// 					fetchErrorOrEmpty.value = true;
	// 				} else {
	// 					tamperedVehicles.value = searchResults;
	// 					openToast(
	// 						"Tampered vehicles loaded successfully",
	// 						"success"
	// 					);
	// 				}
	// 			},
	// 		});
	// 	} catch (error) {
	// 		console.log("An error occured: ", error);
	// 		openToast(
	// 			"Failed to load tampered vehicles. Reload page!",
	// 			"danger"
	// 		);
	// 		fetchErrorOrEmpty.value = true;
	// 	} finally {
	// 		tamperedVehiclesLoading.value = false;
	// 	}
	// });
</script>
