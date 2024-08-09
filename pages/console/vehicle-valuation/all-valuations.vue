<template>
	<div class="responsive-view h-fit bg-[#f6f9f2] py-10">
		<div class="flex items-center justify-between py-5">
			<!-- Table switcher -->
			<div class="border-b-1 w- space-x-4 text-sm md:text-base lg:w-fit lg:text-lg">
				<button
					@click="() => (currentTable = 0)"
					:class="[
						'border-b-2',
						currentTable === 0 ? 'border-b-blue-600 text-blue-600' : 'border-b-inherit',
					]">
					<span>Recently Complete</span>
				</button>
				<button
					@click="() => (currentTable = 1)"
					:class="[
						'border-b-2',
						currentTable === 1 ? 'border-b-blue-600 text-blue-600' : 'border-b-inherit',
					]">
					<span>Pending Valuations</span>
				</button>
			</div>
			<div class="flex flex-grow items-center justify-end">
				<!-- search box -->
				<div class="relative flex max-w-[40%] flex-grow">
					<form
						class="w-full"
						@submit.prevent="searchValuations">
						<input
							type="text"
							required
							class="peer h-12 min-w-full rounded-2xl border-transparent bg-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
							placeholder="Search Registration Number Here"
							v-model="searchFilterTerm" />
						<button
							type="submit"
							class="absolute inset-y-0 end-0 flex w-14 justify-center rounded-2xl bg-blue-500 p-2 text-white"
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
						v-if="searchFilterTerm !== '' || searchByValuationDate !== ''"
						@click="
							() => {
								searchFilterTerm = '';
							}
						"
						title="Clear Filters"
						class="ml-2 size-10 rounded-full bg-gray-300 p-2 text-center">
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
					<div class="inline-block min-w-full p-1.5 align-middle">
						<div class="overflow-hidden rounded-lg border shadow">
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
									<ErrorOrMissingData v-if="fetchCompleteErrorOrEmpty" />
									<ValuationsRecord
										v-for="(record, index) in computedCompleteValuations"
										:key="index"
										:vehicle-id="record.vehicle_id"
										:vehicle-reg-no="record.vehicleRegNumber"
										:client-name="toTitleCase(record.customer_name)"
										:vehicle-make="
											capitalizeFirstLetterOfEachWord(record.vehicleMake)
										"
										:vehicle-model="
											capitalizeFirstLetterOfEachWord(record.vehicleModel)
										"
										:valuation-date="record.valuation_date"
										:vehicle-value="
											Number(record.vehicleValue).toLocaleString()
										"
										:note-value="lowerCaseEachLetter(record.note_value)"
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
					<div class="inline-block min-w-full p-1.5 align-middle">
						<div class="overflow-hidden rounded-lg border shadow">
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
									<ErrorOrMissingData v-if="fetchPendingErrorOrEmpty" />
									<ValuationsRecord
										v-for="(record, index) in computedPendingValuations"
										:key="index"
										:vehicle-id="record.vehicle_id"
										:vehicle-reg-no="record.vehicleRegNumber"
										:client-name="toTitleCase(record.customer_name)"
										:vehicle-make="
											capitalizeFirstLetterOfEachWord(record.vehicleMake)
										"
										:vehicle-model="
											capitalizeFirstLetterOfEachWord(record.vehicleModel)
										"
										:valuation-date="record.valuation_date"
										:vehicle-value="
											Number(record.vehicleValue).toLocaleString()
										"
										:note-value="lowerCaseEachLetter(record.note_value)"
										:booking-no="record.booking_no" />
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<!-- end of data table -->
		</div>
		<div class="mt-2 flex w-full items-center justify-between rounded-sm py-2">
			<span>Showing Page {{ currentPage + 1 }} of {{ totalPages }}</span>
			<div
				class="space-x-1"
				v-if="totalPages > 1">
				<button
					@click="prevPage"
					class="rounded-md border bg-blue-600 p-2 text-center text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-500"
					:disabled="currentPage === 0">
					Previous
				</button>

				<button
					@click="nextPage"
					class="rounded-md border bg-blue-600 p-2 text-center text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-500"
					:disabled="currentPage === totalPages - 1">
					Next
				</button>
			</div>
		</div>
	</div>

	<!-- search modal -->
	<div
		id="hs-valutionsearch-modal"
		class="hs-overlay pointer-events-none fixed start-0 top-0 z-[80] hidden size-full overflow-y-auto overflow-x-hidden">
		<div
			class="m-3 mt-0 opacity-0 transition-all ease-out hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 lg:mx-auto lg:w-full lg:max-w-4xl">
			<div
				class="pointer-events-auto flex flex-col rounded-xl border bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-neutral-700/70">
				<div
					class="flex items-center justify-between border-b px-4 py-3 dark:border-neutral-700">
					<h3 class="font-bold text-gray-800 dark:text-white">Search Results</h3>
					<button
						@click="
							() => {
								valuationsFromSearch = [];
							}
						"
						type="button"
						class="flex size-7 items-center justify-center rounded-full border border-transparent text-sm font-semibold text-gray-800 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-neutral-700"
						data-hs-overlay="#hs-valutionsearch-modal">
						<span class="sr-only">Close</span>
						<svg
							class="size-4 flex-shrink-0"
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
				<div class="overflow-y-auto p-4">
					<!-- start of data table -->
					<div class="flex flex-col">
						<div class="-m-1.5 overflow-x-auto">
							<div class="inline-block min-w-full p-1.5 align-middle">
								<div class="overflow-hidden rounded-lg border shadow">
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
												class="py-4 text-center"
												colspan="100%">
												<LoadingIndicator
													:bar-length="`w-[30%]`"
													v-if="searchValuationLoading" />
												<br />
												<span class="text-lg font-semibold text-gray-500"
													>Loading Your Data.</span
												>
											</td>
											<ErrorOrMissingData v-if="searchErrorOrEmpty" />
											<MinimizedValuationsDataRecord
												v-for="(record, index) in valuationsFromSearch"
												:key="index"
												:vehicle-id="record.vehicle_id"
												:vehicle-reg-no="record.vehicleRegNumber"
												:vehicle-make="
													capitalizeFirstLetterOfEachWord(
														record.vehicleMake,
													)
												"
												:vehicle-model="
													capitalizeFirstLetterOfEachWord(
														record.vehicleModel,
													)
												"
												:valuation-date="record.valuation_date"
												:assessed-value="
													Number(record.assessed_value).toLocaleString()
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
		name: 'valuation-all-valuations',
		layout: 'in-app-layout',
	});

	const currentTable: Ref<number> = ref(0);
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
