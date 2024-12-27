<template>
	<div class="h-full min-h-[53rem]">
		<!-- div to show when there is a fetch error -->
		<div
			v-if="fetchFleetsStatus === 'error'"
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
			v-else-if="fetchFleetsStatus === 'success' && corpFleets.length === 0">
			<BirdieNotFoundIcon />
			<h1 class="font-semibold text-gray-500">Oops! Seems like you have no fleets!</h1>
		</div>

		<!-- div to show when there are authority letters -->
		<div
			class="flex h-full flex-col"
			v-else>
			<!-- search & filter controls -->

			<div class="my-2 flex-grow">
				<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
					<table class="w-full text-left text-gray-500">
						<thead class="bg-gray-100 text-sm uppercase text-gray-700">
							<tr>
								<th
									scope="col"
									class="table-headers">
									Fleet Name
								</th>
								<!-- Details will show client name and their contact -->
								<th
									scope="col"
									class="table-headers">
									Start Date
								</th>
								<th
									scope="col"
									class="table-headers text-start">
									End Date
								</th>
								<th
									scope="col"
									class="table-headers">
									Vehicles Issued
								</th>
								<th
									scope="col"
									class="table-headers">
									In Progress
								</th>
								<th
									scope="col"
									class="table-headers">
									Completed
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
								v-if="fetchFleetsStatus === 'pending'"
								v-for="a in 10"
								:key="a">
								<td
									scope="row"
									class="whitespace-nowrap p-6 font-medium text-gray-300">
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
									<span class="animate-pulse rounded-lg bg-gray-300">agency</span>
								</td>
								<td></td>
							</tr>
							<tr
								class="border-b bg-white hover:bg-gray-100"
								v-else
								v-for="(fleet, index) in corpFleets"
								:key="index">
								<td
									scope="row"
									class="whitespace-nowrap p-6 font-semibold text-gray-600">
									{{ fleet.fleetName }}
								</td>
								<td class="whitespace-nowrap p-6 text-gray-600">
									{{ fleet.startDate }}
								</td>
								<td class="whitespace-nowrap p-6 text-gray-600">
									{{ fleet.endDate }}
								</td>
								<td class="p-6 text-center font-semibold">
									{{ fleet.vehiclesIssued }}
								</td>
								<td class="p-6 text-center">
									{{
										!fleet.vehiclesInProgress ? 'N/A' : fleet.vehiclesInProgress
									}}
								</td>
								<td class="p-6 text-center">
									{{ !fleet.vehiclesCompleted ? 'N/A' : fleet.vehiclesCompleted }}
								</td>
								<td class="p-6 text-end">
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
													class="block w-full px-4 py-2 text-center hover:bg-gray-100"
													:to="{
														name: 'vehicle-valuation-explore-fleet',
														params: {
															fleet_id: fleet.id,
														},
													}">
													View Vehicles
												</NuxtLink>
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
			<div class="flex h-12 items-center justify-between">
				<h1 class="text-sm font-semibold text-gray-500 md:text-base">
					Showing {{ 1 }} of {{ totalFleetPages }} pages.
				</h1>
				<div class="h-full space-x-2 md:space-x-4">
					<button
						class="table-page-buttons"
						@click="fleetPage -= 1"
						:disabled="fleetPage === 0 || totalFleetPages == 1">
						Previous
					</button>
					<button
						class="table-page-buttons"
						@click="fleetPage += 1"
						:disabled="fleetPage === totalFleetPages - 1 || totalFleetPages == 1">
						Next
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'vehicle-valuation-fleet-reports',
		layout: 'console-layout',
	});

	const {
		fetchFleetsStatus,
		executeFetchFleets,
		fetchFleetsError,
		corpFleets,
		fleetPage,
		totalFleetPages,
	} = useValuationFleets();
</script>
