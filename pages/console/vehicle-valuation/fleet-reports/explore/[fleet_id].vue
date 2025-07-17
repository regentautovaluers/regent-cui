<template>
	<!-- new UI layout -->
	<div class="console-layout-spacing flex flex-col">
		<div class="tablet:flex-row flex h-fit flex-col items-center justify-between">
			<div class="flex items-center space-x-3 font-semibold text-gray-500">
				<button
					@click="() => (activeView = 'all')"
					:class="[
						'tablet:text-base border-b-2 text-sm',
						activeView === 'all'
							? 'border-b-blue-600 text-blue-600'
							: 'border-b-inherit',
					]">
					<span>All Entries</span>
				</button>
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

		<div class="h-full min-h-212">
			<!-- div to show when there is a fetch error -->
			<div
				v-if="fetchFleetsJobsStatus === 'error'"
				class="mt-2 flex h-full flex-col items-center justify-center space-y-4 rounded-lg border shadow-sm">
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
				class="mt-2 flex h-full flex-col items-center justify-center space-y-4 rounded-lg border shadow-sm"
				v-else-if="fetchFleetsJobsStatus === 'success' && corpFleetsJobs.length === 0">
				<BirdieNotFoundIcon />
				<h1 class="font-semibold text-gray-500">
					Oops! Seems like you have no fleet vehicles!
				</h1>
			</div>

			<!-- div to show when there are authority letters -->
			<div
				class="flex h-full flex-col"
				v-else>
				<!-- search & filter controls -->

				<div class="my-2 flex-grow">
					<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
						<table class="w-full text-left text-gray-500">
							<thead class="bg-gray-100 text-gray-700 uppercase">
								<tr>
									<th
										scope="col"
										class="table-headers">
										Reg No, Year & Make
									</th>
									<th
										scope="col"
										class="table-headers">
										Chassis & Mileage
									</th>
									<th
										scope="col"
										class="table-headers">
										Engine Number
									</th>
									<th
										scope="col"
										class="table-headers">
										Asessed & W/screen Value
									</th>
									<th
										scope="col"
										class="table-headers">
										Radio (& 2-Way) Value
									</th>
									<th
										scope="col"
										class="table-headers">
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
									v-if="fetchFleetsJobsStatus === 'pending'"
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
											>bookedtoday</span
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
								</tr>
								<tr
									class="border-b bg-white text-sm hover:bg-gray-100"
									v-else
									v-for="(fleet, index) in corpFleetsJobs"
									:key="index">
									<td class="p-4">
										<span class="inline-flex items-center space-x-1">
											<span
												class="w-fit rounded-lg bg-pink-200 px-1 text-sm text-pink-600"
												>{{ fleet.regNo }}</span
											>
											<span
												class="w-fit rounded-lg bg-blue-200 px-1 text-sm text-blue-600">
												{{ fleet.yearOfManufacture }}</span
											>
										</span>
										<br />
										<span class="text-sm">{{
											fleet.vehicleMake ?? 'N/A'
										}}</span>
									</td>
									<td class="inline-flex flex-col p-4">
										<span class="text-sm">{{
											fleet.chassisNumber ?? 'N/A'
										}}</span>
										<span
											class="w-fit rounded-lg bg-pink-200 px-1 text-sm text-pink-600"
											>{{ fleet.mileageRead ?? 'N/A' }}</span
										>
									</td>
									<td class="p-4 font-semibold text-blue-600">
										{{ fleet.engineNumber ?? 'N/A' }}
									</td>
									<td class="inline-flex w-full flex-col p-4">
										<span>{{ fleet.asessedValue ?? 'N/A' }}</span>
										<span
											class="w-fit rounded-lg bg-pink-200 px-1 text-pink-600"
											>{{ fleet.windscreenValue ?? 'N/A' }}</span
										>
									</td>
									<td class="p-4">
										<span>{{ fleet.radioValue ?? 'N/A' }}</span>
										<br />
										<span
											class="w-fit rounded-lg bg-pink-200 px-1 text-pink-600"
											>{{ fleet.twoWayRadioValue ?? 'N/A' }}</span
										>
									</td>
									<td class="p-4 font-semibold text-blue-600">
										{{ fleet.inspectionNB ?? 'N/A' }}
									</td>
									<td class="p-4 text-end">
										<button
											:id="'dropdownLeftButton' + index"
											:data-dropdown-toggle="'dropdownLeft' + index"
											data-dropdown-placement="left"
											type="button">
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
												<li>
													<NuxtLink
														v-if="fleet.reportURL != null"
														class="block w-full px-4 py-2 text-center hover:bg-gray-100"
														:to="{
															name: 'vehicle-valuation-report',
															params: {
																valuation_id: fleet.jobId,
															},
														}">
														View Report
													</NuxtLink>
													<button
														v-else
														class="block w-full px-4 py-2 text-center hover:bg-gray-100">
														Report N/A
													</button>
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
					<h1 class="text-sm font-semibold text-gray-500 md:text-base">
						Showing {{ 1 }} of {{ totalFleetJobPages }} pages.
					</h1>
					<div class="h-full space-x-2 md:space-x-4">
						<button
							class="table-page-buttons"
							@click="fleetJobPage -= 1"
							:disabled="fleetJobPage === 0 || totalFleetJobPages == 1">
							Previous
						</button>
						<button
							class="table-page-buttons"
							@click="fleetJobPage += 1"
							:disabled="
								fleetJobPage === totalFleetJobPages - 1 || totalFleetJobPages == 1
							">
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
		name: 'vehicle-valuation-explore-fleet',
		layout: 'console-layout',
	});

	const isFilterFormOpen: Ref<boolean> = ref(false);

	const {
		fleetJobPage,
		totalFleetJobPages,
		fetchFleetsJobsStatus,
		corpFleetsJobs,
		executeFetchJobsFleets,
		fetchFleetsJobsError,
		activeView,
		searchRegNo,
	} = useValuationFleetJobs();
</script>
