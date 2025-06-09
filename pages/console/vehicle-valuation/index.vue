<template>
	<div class="console-layout-spacing flex flex-col">
		<div class="flex h-fit items-center justify-between">
			<div class="space-x-4 font-semibold text-gray-500 md:text-base lg:text-lg">
				<button
					@click="() => (activeView = 'complete')"
					:class="[
						'border-b-2',
						activeView === 'complete'
							? 'border-b-blue-600 text-blue-600'
							: 'border-b-inherit',
					]">
					<span>Completed</span>
				</button>
				<button
					@click="() => (activeView = 'pending')"
					:class="[
						'border-b-2',
						activeView == 'pending'
							? 'border-b-blue-600 text-blue-600'
							: 'border-b-inherit',
					]">
					<span>Pending</span>
				</button>
			</div>

			<!-- search box -->
			<div class="relative flex w-full items-center justify-between md:w-[45%] lg:w-[23%]">
				<input
					type="text"
					class="generic-input"
					placeholder="Search Registration Number" />
				<button
					type="submit"
					class="generic-search-submit-button">
					<SearchIcon />
				</button>
			</div>

			<!-- other filters -->
			<div class="h-full">
				<button
					class="table-filter-buttons"
					@click.prevent="isFilterFormOpen = true">
					Filters<FilterIcon class="text-xl" />
				</button>
			</div>
		</div>

		<div class="h-full min-h-212">
			<!-- div to show when there is a fetch error -->
			<div
				v-if="fetchValuationsStatus === 'error'"
				class="mt-5 flex h-full flex-col items-center justify-center space-y-4 rounded-lg border shadow-sm">
				<BirdieNotFoundIcon />
				<h1 class="font-semibold text-gray-500">Failed to load data!</h1>
				<button
					class="inline-flex items-center space-x-2 rounded-lg border bg-transparent px-2 py-1 text-gray-500 hover:text-gray-600"
					@click="refreshPage">
					<span>Refresh</span>
					<RefreshIcon classes="size-6" />
				</button>
			</div>

			<!-- div to show when there are no authorization letters -->
			<div
				class="mt-5 flex h-full flex-col items-center justify-center space-y-4 rounded-lg border shadow-sm"
				v-else-if="fetchValuationsStatus === 'success' && corpValuations.length === 0">
				<BirdieNotFoundIcon />
				<h1 class="font-semibold text-gray-500">
					Oops! Seems like you have no valuations!
				</h1>
			</div>

			<!-- div to show when there are authority letters -->
			<div
				class="flex h-full flex-col"
				v-else>
				<!-- search & filter controls -->

				<div class="mt-5 flex-grow">
					<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
						<table class="w-full text-left text-gray-500">
							<thead class="bg-gray-100 text-sm text-gray-700 uppercase">
								<tr>
									<th
										scope="col"
										class="table-headers">
										Regent Branch & Date
									</th>
									<!-- Details will show client name and their contact -->
									<th
										scope="col"
										class="table-headers">
										Client Details
									</th>
									<th
										scope="col"
										class="table-headers">
										Inspection Details
									</th>
									<th
										scope="col"
										class="table-headers">
										Vehicle Details
									</th>
									<th
										scope="col"
										class="table-headers">
										Payment
									</th>
									<th
										scope="col"
										class="table-headers">
										Assessed & Market Value
									</th>
									<th
										scope="col"
										class="table-headers">
										Forced Value
									</th>
									<th
										scope="col"
										class="table-headers" />
								</tr>
							</thead>
							<tbody>
								<!-- loading state -->
								<tr
									class="border-b bg-white hover:bg-gray-100"
									v-if="fetchValuationsStatus === 'pending'"
									v-for="a in 10"
									:key="a">
									<td
										scope="row"
										class="p-6 font-medium whitespace-nowrap text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>username</span
										>
									</td>
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>useremail</span
										>
									</td>
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>regenthq</span
										>
									</td>
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>domain role</span
										>
									</td>
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>agency</span
										>
									</td>
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>authorizedby</span
										>
									</td>
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>bookingstage</span
										>
									</td>
									<td></td>
								</tr>

								<!-- the actual data -->
								<tr
									class="border-b bg-white hover:bg-gray-100"
									v-else
									v-for="(valuation, index) in corpValuations"
									:key="index">
									<td class="p-5">
										<span
											class="w-fit rounded-lg bg-pink-200 px-1 text-pink-600"
											>{{ valuation.regentBranch.branchName }}</span
										>
										<br />
										<span>{{ valuation.bookingDate.split('T')[0] }}</span>
									</td>
									<td class="p-5">
										<span
											class="w-fit rounded-lg bg-blue-200 px-1 text-blue-600"
											>{{ valuation.clientPhone }}</span
										>
										<br />
										<span>{{ valuation.clientName }}</span>
									</td>

									<td class="p-5">
										<span class="w-fit">{{
											valuation.inspectionDate == null
												? 'Date N/A'
												: valuation.inspectionDate.split('T')[0]
										}}</span>
										<br />
										<span class="w-fit rounded-lg bg-gray-200 px-1">{{
											valuation.isSpecial
												? 'Special Report'
												: 'Regular Report'
										}}</span>
									</td>
									<th
										scope="row"
										class="flex items-center p-5 whitespace-nowrap text-gray-900">
										<img
											class="size-14 rounded-lg object-cover"
											:src="valuation.vehicleImage"
											alt="Vehicle Image"
											v-if="valuation.vehicleImage" />
										<div
											v-else
											class="flex size-14 items-center justify-center rounded-lg bg-gray-200 text-gray-500">
											<span>{{
												valuation.regNo == null
													? 'N/A'
													: valuation.regNo.split(' ')[0]
											}}</span>
										</div>
										<div class="ps-2">
											<div
												class="w-fit rounded-full bg-blue-200 px-1 text-sm text-blue-600">
												{{ valuation.regNo }}
											</div>
											<div class="font-normal text-gray-500">
												{{ valuation.vehicleMake }}
											</div>
										</div>
									</th>
									<td class="p-5">
										<span class="w-fit">{{
											valuation.chargedAmount == null
												? 'Amount N/A'
												: Intl.NumberFormat('en-US', {
														minimumFractionDigits: 0,
														maximumFractionDigits: 0,
													}).format(valuation.chargedAmount)
										}}</span>
										<br />
										<span
											class="w-fit rounded-lg bg-yellow-200 px-1 text-yellow-600"
											>{{ valuation.paymentMethod ?? 'Method N/A' }}</span
										>
									</td>
									<td class="space-x-3 p-5">
										<span>{{
											!valuation.vehicleValue ||
											!valuation.vehicleValue.assessedValue
												? 'A/Val N/A'
												: Intl.NumberFormat('en-US', {
														minimumFractionDigits: 0,
														maximumFractionDigits: 0,
													}).format(valuation.vehicleValue.assessedValue)
										}}</span>
										<span class="text-2xl">&middot;</span>
										<span>{{
											!valuation.vehicleValue ||
											!valuation.vehicleValue.marketValue
												? 'Mkt/Val N/A'
												: Intl.NumberFormat('en-US', {
														minimumFractionDigits: 0,
														maximumFractionDigits: 0,
													}).format(valuation.vehicleValue.marketValue)
										}}</span>
									</td>
									<td class="p-5">
										{{
											!valuation.vehicleValue ||
											!valuation.vehicleValue.forcedSaleValue
												? 'Fcd/Val N/A'
												: Intl.NumberFormat('en-US', {
														minimumFractionDigits: 0,
														maximumFractionDigits: 0,
													}).format(
														valuation.vehicleValue.forcedSaleValue,
													)
										}}
									</td>
									<td>
										<button
											:id="'dropdownLeftButton' + index"
											:data-dropdown-toggle="'dropdownLeft' + index"
											data-dropdown-placement="left"
											type="button"
											v-if="activeView == 'complete'">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="1em"
												height="1em"
												viewBox="0 0 16 16"
												class="size-6">
												<MenuKebabIcon />
											</svg>
										</button>

										<!-- Dropdown menu -->
										<div
											:id="'dropdownLeft' + index"
											class="z-10 hidden w-44 divide-y divide-gray-100 rounded-lg border bg-white shadow-md">
											<ul
												class="py-2 text-sm text-gray-500"
												aria-labelledby="dropdownLeftButton">
												<li
													v-if="
														valuation.reportURL == null ||
														determineValuationStage(
															valuation.valuationStage,
														)?.status == 'Ongoing'
													">
													<button
														class="block w-full bg-gray-100 px-4 py-2 text-center"
														type="button">
														Report N/A
													</button>
												</li>
												<li v-else>
													<NuxtLink
														:to="{
															name: 'vehicle-valuation-report',
															params: {
																valuation_id: valuation.valuationId,
															},
														}"
														class="block w-full px-4 py-2 text-center hover:bg-gray-100"
														type="button">
														View Report
													</NuxtLink>
												</li>
												<li
													v-if="
														valuation.reportURL != null &&
														determineValuationStage(
															valuation.valuationStage,
														)?.status == 'Completed'
													">
													<a
														target="_self"
														:href="valuation.reportURL"
														class="block w-full px-4 py-2 text-center hover:bg-gray-100">
														Download Report
													</a>
												</li>
											</ul>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<!-- page controls -->
				<div class="flex min-h-12 items-center justify-between">
					<h1 class="text-sm font-semibold text-gray-500 md:text-base">
						Showing {{ page + 1 }} of {{ totalPages }} pages.
					</h1>
					<div class="h-full space-x-2 md:space-x-4">
						<button
							class="table-page-buttons"
							@click="page -= 1"
							:disabled="page === 0 || totalPages == 1">
							Previous
						</button>
						<button
							class="table-page-buttons"
							@click="page += 1"
							:disabled="page === totalPages - 1 || totalPages == 1">
							Next
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Search Corp or Broker modal -->
	<ParentModal
		modal-id="all-valuation-filters"
		modal-title="Results Filters"
		class="h-72"
		v-if="isFilterFormOpen"
		@close-modal="isFilterFormOpen = false">
		<form class="w-full">
			<InformationChip>
				<p class="text-sm font-semibold text-gray-500">
					Select the dates between which you want to filter results.
				</p>
			</InformationChip>
			<div>
				<label
					for="letter-start-date"
					class="generic-input-label generic-input-required-label"
					>Start Date</label
				>
				<input
					type="date"
					id="letter-start-date"
					class="generic-input"
					placeholder="Enter Customer Name as Seen In Their National ID"
					pattern="\d{4}-\d{2}-\d{2}"
					required
					v-model="startDate" />
			</div>

			<!-- Ending date Field -->
			<div>
				<label
					for="letter-end-date"
					class="generic-input-label generic-input-required-label"
					>End Date</label
				>
				<input
					type="date"
					id="letter-end-date"
					class="generic-input"
					placeholder="Enter Customer Name as Seen In Their National ID"
					pattern="\d{4}-\d{2}-\d{2}"
					required
					v-model="endDate" />
			</div>

			<!-- submit button -->
			<button
				type="submit"
				class="generic-form-submit mt-3">
				Apply Filters
			</button>
		</form>
	</ParentModal>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'vehicle-valuation-home',
		layout: 'console-layout',
	});

	const {
		activeView,
		fetchValuationsStatus,
		fetchValuationsError,
		corpValuations,
		totalPages,
		page,
		executeFetchValuations,
	} = useCorporateValuations();
	const isFilterFormOpen: Ref<boolean> = ref(false);
	const startDate: Ref<string> = ref('');
	const endDate: Ref<string> = ref('');
</script>
