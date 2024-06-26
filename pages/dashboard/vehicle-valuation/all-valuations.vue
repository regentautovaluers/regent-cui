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
			<div class="flex-grow flex justify-end items-center">
				<!-- search box -->
				<div class="flex-grow flex relative max-w-[40%]">
					<form
						class="w-full"
						@submit.prevent="searchValuations">
						<input
							type="text"
							required
							class="peer py-3 h-12 px-4 bg-gray-200 border-transparent rounded-2xl focus:border-blue-500 focus:ring-blue-500 min-w-full"
							placeholder="Search Registration Number Here"
							v-model="searchFilterTerm" />
						<button
							type="submit"
							class="absolute end-0 text-white inset-y-0 flex justify-center rounded-2xl w-14 bg-blue-500 p-2"
							data-hs-overlay="#hs-valutionsearch-modal">
							<img
								src="/images/topnav/search-icon.svg"
								alt="Search Icon" />
						</button>
					</form>
				</div>
				<div>
					<!-- button to disable filters -->
					<button
						v-if="
							searchFilterTerm !== '' ||
							searchByValuationDate !== ''
						"
						@click="
							() => {
								searchFilterTerm = '';
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
		</div>
		<div
			v-if="currentTable === 0"
			class="mt-4 lg:min-h-[40rem]">
			<!-- start of completed valuations data table -->
			<div class="flex flex-col bg-white">
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
			<div class="flex flex-col bg-white">
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

	<!-- search modal -->
	<div
		id="hs-valutionsearch-modal"
		class="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
		<div
			class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all lg:max-w-4xl lg:w-full m-3 lg:mx-auto">
			<div
				class="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
				<div
					class="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
					<h3 class="font-bold text-gray-800 dark:text-white">
						Search Results
					</h3>
					<button
						@click="
							() => {
								valuationsFromSearch = [];
							}
						"
						type="button"
						class="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700"
						data-hs-overlay="#hs-valutionsearch-modal">
						<span class="sr-only">Close</span>
						<svg
							class="flex-shrink-0 size-4"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round">
							<path d="M18 6 6 18"></path>
							<path d="m6 6 12 12"></path>
						</svg>
					</button>
				</div>
				<div class="p-4 overflow-y-auto">
					<!-- start of data table -->
					<div class="flex flex-col">
						<div class="-m-1.5 overflow-x-auto">
							<div
								class="p-1.5 min-w-full inline-block align-middle">
								<div
									class="border rounded-lg shadow overflow-hidden">
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
													Assessed Value
												</th>
												<th
													scope="col"
													class="px-6 py-3 text-end" />
											</tr>
										</thead>
										<tbody class="divide-y divide-gray-200">
											<td
												v-if="searchValuationLoading"
												class="text-center py-4"
												colspan="100%">
												<LoadingIndicator
													:bar-length="`w-[30%]`"
													v-if="
														searchValuationLoading
													" />
												<br />
												<span
													class="text-gray-500 text-lg font-semibold"
													>Loading Your Data.</span
												>
											</td>
											<ErrorOrMissingData
												v-if="searchErrorOrEmpty" />
											<MinimizedValuationsDataRecord
												v-for="(
													record, index
												) in valuationsFromSearch"
												:key="index"
												:vehicle-id="record.vehicle_id"
												:vehicle-reg-no="
													record.vehicleRegNumber
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
												:valuation-date="
													record.valuation_date
												"
												:assessed-value="
													Number(
														record.assessed_value
													).toLocaleString()
												" />
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
					<!-- end of data table -->
				</div>
				<!-- <div
					class="mt-2 w-full rounded-sm flex justify-between items-center py-2">
					<span
						>Showing Page {{ currentPage + 1 }} of
						{{ searchTotalPages }}</span
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
				</div> -->
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

	const {
		capitalizeFirstLetterOfEachWord,
		lowerCaseEachLetter,
		toTitleCase,
	} = useUtils();
	const {
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
	} = useValuations();

	onMounted(async () => {
		await fetchRecentValuations();
		await fetchPendingValuations();
	});
</script>
