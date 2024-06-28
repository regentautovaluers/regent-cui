<template>
	<div class="py-10 bg-[#f6f9f2] responsive-view h-fit">
		<div class="bg-white w-full p-10 px-2 lg:px-10">
			<!-- search & filter controls -->
			<!-- <div
				class="flex items-center justify-between mb-6 overflow-x-auto flex-nowrap">
				search box
				<div class="relative flex-grow mr-10 max-w-[30%]">
					<input
						type="text"
						class="peer py-3 h-14 px-4 ps-11 bg-gray-200 border-transparent rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none min-w-full"
						placeholder="Search Registration, Booking Number, Make e.t.c"
						v-model="searchFilterTerm" />
					<div
						class="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-2 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
						<img
							src="/images/topnav/search-icon.svg"
							alt="Search Icon" />
					</div>
				</div>
			</div> -->
			<!-- start of data table -->
			<div class="flex flex-col">
				<div class="-m-1.5 overflow-x-auto">
					<div class="p-1.5 min-w-full inline-block align-middle">
						<div class="border rounded-lg shadow overflow-hidden">
							<table class="min-w-full divide-y">
								<thead>
									<tr>
										<th
											scope="col"
											class="px-6 py-3 text-start font-bold text-gray-500">
											Registration No.
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-start font-bold text-gray-500">
											Make
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-start font-bold text-gray-500">
											Model
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-center font-bold text-gray-500">
											Booking No.
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-end font-bold text-gray-500">
											Valuation Date
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-end font-bold text-gray-500">
											Assessed Value
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-end font-bold text-gray-500">
											Client Name
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-end font-bold text-gray-500">
											Regent Branch
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-start font-bold text-gray-500">
											Attached Note
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-end" />
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200">
									<td
										v-if="tamperedVehiclesLoading"
										class="text-center py-4"
										colspan="100%">
										<LoadingIndicator
											:bar-length="`w-[30%]`"
											v-if="tamperedVehiclesLoading" />
										<br />
										<span
											class="text-gray-500 text-lg font-semibold"
											>Loading Your Data.</span
										>
									</td>
									<ErrorOrMissingData
										v-if="fetchErrorOrEmpty" />
									<TamperedVehicles
										v-for="(
											record, index
										) in computedTamperedVehicles"
										:key="index"
										:vehicle-reg-no="record.reg_no"
										:vehicle-make="record.make"
										:vehicle-model="record.model"
										:booking-no="record.vehicle_booking_no"
										:valuation-date="record.add_date"
										:vehicle-assessed-value="
											record.vehicle_assessed_value
										"
										:client-name="
											toTitleCase(record.customer_name)
										"
										:regent-branch="record.regent_branch"
										:attached-note="record.nb" />
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<div
				class="mt-2 w-full rounded-sm flex justify-between items-center py-2">
				<span
					>Showing Page {{ currentPage + 1 }} of
					{{ totalPages }}</span
				>
				<div
					class="space-x-1"
					v-if="totalPages > 1">
					<button
						@click="prevPage"
						class="p-2 text-center text-sm font-semibold rounded-md border bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-500"
						:disabled="currentPage === 0">
						Previous
					</button>

					<button
						@click="nextPage"
						class="p-2 text-center text-sm font-semibold rounded-md border bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-500"
						:disabled="currentPage === totalPages - 1">
						Next
					</button>
				</div>
			</div>
		</div>
		<h1 class="text-3xl font-bold mt-7 lg:mx-10">Explore More Services</h1>
		<div
			class="w-full flex justify-between space-x-4 lg:space-x-0 lg:px-10 whitespace-nowrap overflow-x-auto overflow-y-hidden"
			style="
				::-webkit-scrollbar-thumb {
					border-radius: 10px;
				}

				/* Hide scrollbar for Chrome, Safari and Opera */
				::-webkit-scrollbar {
					display: none;
				}

				/* Hide scrollbar for IE, Edge and Firefox */
				.no-scrollbar {
					-ms-overflow-style: none; /* IE and Edge */
					scrollbar-width: none; /* Firefox */
				}
			">
			<NuxtLink
				v-for="(service, index) in moreServicesData"
				class="flex flex-col whitespace-normal p-6 rounded-2xl hover:shadow-lg hover:bg-white h-64 w-72 min-w-72 max-w-72 transition-transform hover:scale-105"
				:key="index"
				:to="{ name: service.pageName }"
				><img
					:src="service.icon"
					alt="Service Icon Link"
					class="w-16" />
				<h1 class="text-2xl font-bold mt-3">
					{{ service.title }}
				</h1>
				<p class="text-lg">{{ service.description }}</p></NuxtLink
			>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: "valuation-tampered-vehicles",
		layout: "in-app-layout",
	});

	const searchFilterTerm: Ref<string | null> = ref(null);
	const tamperedVehicles: Ref<any[]> = ref([]);
	const fetchLoading: Ref<boolean> = ref(false);
	const fetchErrorOrEmpty: Ref<boolean> = ref(false);
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const { openToast } = useToast();
	const { moreServicesData } = useMoreServicesNavData();
	const totalPages: Ref<number> = ref(0);
	const totalNumber: Ref<number> = ref(0);
	const ITEMS_PER_PAGE: number = 10;
	const currentPage: Ref<number> = ref(0);
	const tamperedVehiclesLoading: Ref<boolean> = ref(false);
	const computedTamperedVehicles: ComputedRef<any[]> = computed(() => {
		totalNumber.value = tamperedVehicles.value.length;
		totalPages.value = Math.ceil(
			tamperedVehicles.value.length / ITEMS_PER_PAGE
		);

		// Calculate the start and end indices for the current page
		const startIndex = currentPage.value * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;

		// Return only the items for the current page
		return tamperedVehicles.value.slice(startIndex, endIndex);
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

	onMounted(async () => {
		tamperedVehiclesLoading.value = true;
		try {
			await $fetch("/ava/api/tampered_vehicles", {
				method: "GET",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				query: {
					uname: runtimeConfig.app.VALUATION_BASE_UNAME,
					pwd: runtimeConfig.app.VALUATION_BASE_PASS,
					corp: getPrincipal.value.corpId,
				},
				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error("Failed to retrieve tampered vehicles");
					}

					const searchResults: any[] = JSON.parse(response._data);
					if (searchResults.length < 1) {
						openToast(
							"Tampered vehicles has no results!",
							"warning"
						);
						fetchErrorOrEmpty.value = true;
					} else {
						tamperedVehicles.value = searchResults;
						openToast(
							"Tampered vehicles loaded successfully",
							"success"
						);
					}
				},
			});
		} catch (error) {
			console.log("An error occured: ", error);
			openToast(
				"Failed to load tampered vehicles. Reload page!",
				"danger"
			);
			fetchErrorOrEmpty.value = true;
		} finally {
			tamperedVehiclesLoading.value = false;
		}
	});
</script>
