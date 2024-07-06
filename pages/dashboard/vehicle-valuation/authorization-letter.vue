<template>
	
</template>

<script setup lang="ts">
	definePageMeta({
		name: "valuation-authorization-letter",
		layout: "in-app-layout",
	});

	// const currentView: Ref<number> = ref(0);
	// const { moreServicesData } = useMoreServicesNavData();
	// const fetchErrorOrEmpty: Ref<boolean> = ref(false);
	// const runtimeConfig = useRuntimeConfig();
	// const { openToast } = useToast();
	// const { getPrincipal } = useAuth();
	// const requestAuthorizationListLoading: Ref<boolean> = ref(false);
	// const authorizationList: Ref<any[]> = ref([]);
	// const totalNumber: Ref<number> = ref(0);
	// const totalPages: Ref<number> = ref(0);
	// const ITEMS_PER_PAGE: number = 10;
	// const currentPage: Ref<number> = ref(0);

	// onMounted(async () => {
	// 	try {
	// 		await $fetch("/ava/api/authorization/authorization_list", {
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

	// 				const authListResuls: any[] = JSON.parse(response._data);
	// 				if (authListResuls.length < 1) {
	// 					openToast("Search has no results!", "warning");
	// 					fetchErrorOrEmpty.value = true;
	// 				} else {
	// 					authorizationList.value = authListResuls;
	// 					openToast("Search valuations successfull", "success");
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
	// 		requestAuthorizationListLoading.value = false;
	// 	}
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

	// const computedAuthorizationList: ComputedRef<any[]> = computed(() => {
	// 	totalNumber.value = authorizationList.value.length;
	// 	totalPages.value = Math.ceil(
	// 		authorizationList.value.length / ITEMS_PER_PAGE
	// 	);

	// 	// Calculate the start and end indices for the current page
	// 	const startIndex = currentPage.value * ITEMS_PER_PAGE;
	// 	const endIndex = startIndex + ITEMS_PER_PAGE;

	// 	// Return only the items for the current page
	// 	return authorizationList.value.slice(startIndex, endIndex);
	// });
</script>
