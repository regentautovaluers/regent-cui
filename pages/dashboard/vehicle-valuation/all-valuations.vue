<template>
	<div class="py-10 bg-[#f6f9f2] responsive-view h-fit">
		<div class="py-5 flex items-center justify-between">
			<!-- Table switcher -->
			<div
				class="text-sm md:text-base lg:text-lg border-b-1 space-x-4 w- lg:w-fit">
				<button
					@click="() => (currentTable = 0)"
					:class="[
						'border-b-2',
						currentTable === 0
							? 'border-b-blue-600 text-blue-600'
							: 'border-b-inherit',
					]">
					<span>Recently Complete</span>
				</button>
				<button
					@click="() => (currentTable = 1)"
					:class="[
						'border-b-2',
						currentTable === 1
							? 'border-b-blue-600 text-blue-600'
							: 'border-b-inherit',
					]">
					<span>Pending Valuations</span>
				</button>
			</div>

			<!-- search box -->
			<div class="relative flex-grow mr-10 max-w-[35%]">
				<input
					type="text"
					class="peer py-3 h-12 px-4 bg-gray-200 border-transparent rounded-2xl focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none min-w-full"
					placeholder="Search Registration Number Here"
					v-model="searchFilterTerm" />
				<button
					class="absolute inset-y-0 end-0 flex justify-center rounded-2xl w-14 bg-blue-500 pointer-events-none p-2 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
					<img
						src="/images/topnav/search-icon.svg"
						alt="Search Icon" />
				</button>
			</div>
			<div>
				<!-- filter by Membership type -->
				<div
					class="hs-dropdown relative inline-flex [--placement:bottom-right]">
					<button
						id="hs-dropdown-default"
						type="button"
						class="hs-dropdown-toggle py-3 px-4 inline-flex h-12 items-center gap-x-2 font-medium rounded-2xl border border-gray-200 text-gray-800 shadow-sm"
						:class="
							!searchByValuationDate
								? 'bg-white text-black'
								: 'bg-blue-600 text-white'
						">
						Membership Category
						<svg
							class="hs-dropdown-open:rotate-180 size-4"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round">
							<path d="m6 9 6 6 6-6" />
						</svg>
					</button>
					<div
						class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2 mt-2 border after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full space-y-2 z-20"
						aria-labelledby="hs-dropdown-default">
						<div
							v-for="(option, index) in [
								{
									text: 'Corporate Members',
									id: 'corp-cat',
									value: 'corporate',
								},
								{
									text: 'Individual Members',
									id: 'indiv-cat',
									value: 'individual',
								},
							]"
							:key="index"
							class="flex hover:bg-gray-200 p-2 rounded-lg items-center">
							<!-- prettier-ignore -->
							<input
											:id="option.id"
											type="radio"
											name="membership-category"
											:value="option.value"
											class="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
											v-model="searchByValuationDate" />
							<label
								for="corp-cat"
								class="text-gray-500 ms-2 dark:text-gray-400"
								>{{ option.text }}</label
							>
						</div>
					</div>
				</div>

				<!-- button to disable filters -->
				<button
					v-if="
						searchFilterTerm !== '' || searchByValuationDate !== ''
					"
					@click="
						() => {
							searchFilterTerm = '';
							searchByValuationDate = '';
						}
					"
					title="Clear Filters"
					class="bg-gray-300 text-center p-2 rounded-full size-10 ml-2">
					<Icon
						name="material-symbols:close"
						class="text-lg" />
				</button>
			</div>
		</div>
		<div
			v-if="currentTable === 0"
			class="mt-4 lg:min-h-[40rem]">
			<!-- start of completed valuations data table -->
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
											Reg No.
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-start font-bold text-gray-500">
											Client Name
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-start font-bold text-gray-500">
											Vehicle Make
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-start font-bold text-gray-500">
											Vehicle Model
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-end font-bold text-gray-500">
											Valuation Date
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-end font-bold text-gray-500">
											Vehicle Value
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-center font-bold text-gray-500">
											Note Value
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-end font-bold text-gray-500">
											Booking No.
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-end" />
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200">
									<ErrorOrMissingData
										v-if="fetchCompleteErrorOrEmpty" />
									<ValuationsRecord
										v-for="(
											record, index
										) in computedCompleteValuations"
										:key="index"
										:vehicle-id="record.vehicle_id"
										:vehicle-reg-no="
											record.vehicleRegNumber
										"
										:client-name="
											toTitleCase(record.customer_name)
										"
										:vehicle-make="
											capitalizeFirstLetterOfEachWord(
												record.vehicleMake
											)
										"
										:vehicle-model="
											capitalizeFirstLetterOfEachWord(
												record.vehicleModel
											)
										"
										:valuation-date="record.valuation_date"
										:vehicle-value="
											Number(
												record.vehicleValue
											).toLocaleString()
										"
										:note-value="
											lowerCaseEachLetter(
												record.note_value
											)
										"
										:booking-no="record.booking_no" />
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<!-- end of data table -->
		</div>
		<div
			v-if="currentTable === 1"
			class="mt-4 lg:min-h-[40rem]">
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
											Reg No.
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-start font-bold text-gray-500">
											Client Name
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-start font-bold text-gray-500">
											Vehicle Make
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-start font-bold text-gray-500">
											Vehicle Model
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-end font-bold text-gray-500">
											Valuation Date
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-end font-bold text-gray-500">
											Vehicle Value
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-center font-bold text-gray-500">
											Note Value
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-end font-bold text-gray-500">
											Booking No.
										</th>
										<th
											scope="col"
											class="px-6 py-3 text-end" />
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200">
									<ErrorOrMissingData
										v-if="fetchPendingErrorOrEmpty" />
									<ValuationsRecord
										v-for="(
											record, index
										) in computedPendingValuations"
										:key="index"
										:vehicle-id="record.vehicle_id"
										:vehicle-reg-no="
											record.vehicleRegNumber
										"
										:client-name="
											toTitleCase(record.customer_name)
										"
										:vehicle-make="
											capitalizeFirstLetterOfEachWord(
												record.vehicleMake
											)
										"
										:vehicle-model="
											capitalizeFirstLetterOfEachWord(
												record.vehicleModel
											)
										"
										:valuation-date="record.valuation_date"
										:vehicle-value="
											Number(
												record.vehicleValue
											).toLocaleString()
										"
										:note-value="
											lowerCaseEachLetter(
												record.note_value
											)
										"
										:booking-no="record.booking_no" />
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<!-- end of data table -->
		</div>
		<div
			class="mt-2 w-full rounded-sm flex justify-between items-center py-2">
			<span>Showing Page {{ currentPage + 1 }} of {{ totalPages }}</span>
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
</template>

<script setup lang="ts">
	definePageMeta({
		name: "valuation-all-valuations",
		layout: "in-app-layout",
	});

	const currentTable: Ref<number> = ref(0);
	const searchFilterTerm: Ref<string> = ref("");
	const searchByValuationDate: Ref<string> = ref("");
	const recentValuations: Ref<any[]> = ref([]);
	const pendingValuations: Ref<any[]> = ref([]);
	const fetchCompleteErrorOrEmpty: Ref<boolean> = ref(false);
	const fetchPendingErrorOrEmpty: Ref<boolean> = ref(false);
	const currentPage: Ref<number> = ref(0);
	const totalPages: Ref<number> = ref(0);
	const { openToast } = useToast();
	const runtimeConfig = useRuntimeConfig();
	const { getDetails } = usePrincipal();
	const totalNumber: Ref<number> = ref(0);
	const ITEMS_PER_PAGE: number = 10;
	const {
		capitalizeFirstLetterOfEachWord,
		lowerCaseEachLetter,
		toTitleCase,
	} = useUtils();

	// TODO: Delete this at a later date
	const searchServiceType: Ref<string | ""> = ref("");

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

	function performValuationListsProcessing(sourceList: any[]): any[] {
		// Filter the aggData array based on the searchFilterTerm and searchServiceType
		let filteredData = sourceList.filter((item) => {
			// Check if the searchFilterTerm matches any of the specified fields
			const termMatch = item.vehicleRegNumber.includes(
				searchFilterTerm.value
			);

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

	const computedCompleteValuations = computed(() => {
		return performValuationListsProcessing(recentValuations.value);
	});

	const computedPendingValuations = computed(() => {
		return performValuationListsProcessing(pendingValuations.value);
	});

	onMounted(async () => {
		await fetchRecentValuations();
		await fetchPendingValuations();
	});
</script>
