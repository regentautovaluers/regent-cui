<template>
	<div class="console-layout-spacing flex flex-col">
		<div class="tablet:flex-row flex h-fit flex-col items-center justify-between">
			<div class="flex items-center space-x-3 font-semibold text-gray-500">
				<button
					@click="() => (activeView = 'complete')"
					:class="[
						'tablet:text-base border-b-2 text-sm',
						activeView === 'complete'
							? 'border-b-blue-600 text-blue-600'
							: 'border-b-inherit',
					]">
					<span>Completed</span>
				</button>
				<button
					@click="() => (activeView = 'pending')"
					:class="[
						'tablet:text-base border-b-2 text-sm',
						activeView == 'pending'
							? 'border-b-blue-600 text-blue-600'
							: 'border-b-inherit',
					]">
					<span>Ongoing</span>
				</button>
			</div>

			<!-- search box -->
			<div
				class="tablet:mt-0 tablet:w-[50%] laptop-lg:w-[25%] relative mt-2 flex w-full items-center justify-between">
				<input
					type="text"
					class="generic-input"
					placeholder="Enter Exact Reg or Booking No."
					v-model="searchRegNo" />
				<button
					type="submit"
					class="generic-search-submit-button">
					<SearchIcon />
				</button>
			</div>
		</div>

		<form
			@submit.prevent="executeFetchValuations()"
			class="table-filters-form">
			<button
				type="button"
				@click="setShowTampered()"
				:class="[
					'table-filter-form-options',
					showTampered && 'bg-blue-600 text-white hover:bg-blue-600',
				]">
				Only Tampered
			</button>
			<button
				data-popover-target="payment-status-pop-over"
				data-popover-trigger="click"
				data-popover-placement="bottom"
				type="button"
				:class="[
					'table-filter-form-options',
					paymentStatus ? 'bg-blue-600 text-white hover:bg-blue-600' : '',
				]">
				Payment Status
			</button>

			<div
				data-popover
				id="payment-status-pop-over"
				role="tooltip"
				class="invisible absolute z-10 inline-block w-64 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 opacity-0 shadow-xs transition-opacity duration-300">
				<div class="space-y-2 px-3 py-2">
					<div
						class="flex h-10 items-center rounded-lg border border-gray-200 ps-4 hover:bg-gray-200"
						v-for="(ps, index) in ['paid', 'not-paid']"
						:key="index">
						<input
							id="has-spare-tyre"
							type="radio"
							:value="ps"
							v-model="paymentStatus"
							name="bordered-radio"
							class="size-5 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500" />
						<label
							for="has-spare-tyre"
							class="ms-2 w-full py-4 font-medium text-gray-600"
							>{{ ps }}</label
						>
					</div>
				</div>
				<div data-popper-arrow></div>
			</div>

			<button
				data-popover-target="date-range-pop-over"
				data-popover-trigger="click"
				data-popover-placement="bottom"
				type="button"
				:class="[
					'table-filter-form-options',
					startDate || endDate ? 'bg-blue-600 text-white hover:bg-blue-600' : '',
				]">
				Date Range
			</button>

			<div
				data-popover
				id="date-range-pop-over"
				role="tooltip"
				class="invisible absolute z-10 inline-block w-64 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 opacity-0 shadow-xs transition-opacity duration-300">
				<div class="space-y-2 px-3 py-2">
					<!-- Starting date Field -->
					<div>
						<label
							for="cover-period-starts"
							class="generic-input-label mb-0 text-xs"
							>Start Date</label
						>
						<input
							type="date"
							id="cover-period-starts"
							class="generic-input h-10"
							placeholder="Select"
							pattern="\d{4}-\d{2}-\d{2}"
							required
							v-model="startDate" />
					</div>

					<!-- Ending date Field -->
					<div>
						<label
							for="cover-period-starts"
							class="generic-input-label mb-0 text-xs"
							>End Date</label
						>
						<input
							type="date"
							id="cover-period-starts"
							class="generic-input h-10"
							placeholder="Select"
							pattern="\d{4}-\d{2}-\d{2}"
							required
							v-model="endDate" />
					</div>
				</div>
				<div data-popper-arrow></div>
			</div>
			<span
				class="text-lg"
				v-if="startDate || endDate || paymentStatus || paymentMethod || showTampered"
				>&middot;</span
			>
			<button
				type="submit"
				class="table-filter-form-options flex items-center space-x-2"
				v-if="startDate || endDate || paymentStatus || paymentMethod || showTampered">
				<span class="material-symbols--error-rounded size-5"></span>
				<span>Apply Filters</span>
			</button>
			<button
				type="button"
				@click="clearFilters()"
				class="table-filter-form-options flex items-center space-x-2"
				v-if="startDate || endDate || paymentStatus || paymentMethod || showTampered">
				<span class="material-symbols-light--close-rounded size-5"></span>
				<span>Clear Filters</span>
			</button>
		</form>

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
				v-else-if="fetchValuationsStatus === 'success' && !corpValuations.length">
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
									<!-- Details will show client name and their contact -->

									<th
										scope="col"
										class="table-headers tablet:table-cell hidden">
										Client Details
									</th>
									<th
										scope="col"
										class="table-headers tablet:table-cell hidden">
										Inspection Details
									</th>
									<th
										scope="col"
										class="table-headers">
										Vehicle Details
									</th>
									<th
										scope="col"
										class="table-headers desktop-4k:table-cell hidden">
										Progress
									</th>
									<th
										scope="col"
										class="table-headers laptop:table-cell hidden"
										v-if="activeView == 'pending'">
										Pending
									</th>
									<th
										scope="col"
										class="table-headers laptop:table-cell hidden"
										v-if="showTampered">
										Note
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
									<td
										class="p-6 text-gray-300"
										v-if="activeView == 'pending'">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>bookingstage</span
										>
									</td>
									<td
										class="p-6 text-gray-300"
										v-if="showTampered">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>bookingstage</span
										>
									</td>
									<td></td>
								</tr>

								<!-- the actual data -->
								<tr
									class="border-b bg-white text-sm hover:bg-gray-100"
									v-else
									v-for="(valuation, index) in corpValuations"
									:key="index">
									<td class="tablet:table-cell hidden p-4">
										<span
											class="w-fit rounded-lg bg-blue-200 px-1 text-blue-600"
											>{{ valuation.clientPhone ?? 'Phone N/A' }}</span
										>
										<br />
										<span>{{ valuation.clientName }}</span>
									</td>

									<td class="tablet:table-cell hidden p-4">
										<span class="w-fit">{{
											valuation.inspectionDate?.split('T')[0] ?? 'Date N/A'
										}}</span>
										<br />
										<span class="w-fit rounded-lg bg-gray-200 px-1">{{
											valuation.regentBranch.branchName
										}}</span>
									</td>
									<th
										scope="row"
										class="flex items-center p-4 whitespace-nowrap text-gray-900">
										<img
											class="size-12 rounded-lg object-cover"
											:src="valuation.vehicleImage"
											alt="Vehicle Image"
											v-if="valuation.vehicleImage" />
										<div
											v-else
											class="flex size-12 items-center justify-center rounded-lg bg-gray-200 text-gray-500">
											<span>{{
												valuation.regNo?.split(' ')[0] ?? 'Reg N/A'
											}}</span>
										</div>
										<div class="ps-2">
											<div
												class="w-fit rounded-full bg-blue-200 px-1 text-sm text-blue-600">
												{{ valuation.regNo }}
											</div>
											<div class="font-normal text-gray-500">
												{{ valuation.vehicleMake ?? 'Make N/A' }}
											</div>
										</div>
									</th>
									<td class="desktop-4k:table-cell hidden max-w-24 p-4 text-wrap">
										<span class="w-fit">{{
											(valuation.valuationStage as string)
												?.toLowerCase()
												.replaceAll('_', ' ') ?? 'N/A'
										}}</span>
									</td>
									<td
										class="laptop:table-cell hidden w-72 max-w-72 p-4 text-xs text-wrap"
										v-if="activeView == 'pending'">
										{{ valuation.pending ?? 'None' }}
									</td>
									<td
										class="laptop:table-cell hidden w-48 max-w-48 p-4 text-sm text-wrap"
										v-if="showTampered">
										{{ valuation.inspectionNote ?? '-' }}
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
				<div class="mt-8 flex min-h-12 items-center justify-between">
					<h1 class="text-sm font-semibold text-gray-500">
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
		startDate,
		endDate,
		paymentStatus,
		showTampered,
		paymentMethod,
		searchRegNo,
		executeFetchValuations,
		clearFilters,
	} = useCorporateValuations();
	const isFilterFormOpen: Ref<boolean> = ref(false);

	function setShowTampered() {
		if (showTampered.value == null) {
			showTampered.value = true;
		} else {
			showTampered.value = null;
		}
	}
</script>
