<template>
	<div class="console-layout-spacing">
		<!-- div to show when there is a fetch error -->
		<div
			v-if="fetchFleetsStatus === 'error'"
			class="flex h-full flex-1 flex-col items-center justify-center space-y-4 rounded-lg border bg-white text-sm shadow-sm">
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
			class="flex h-full flex-1 flex-col items-center justify-center space-y-4 rounded-lg border bg-white text-sm shadow-sm"
			v-else-if="fetchFleetsStatus === 'success' && corpFleets.length === 0">
			<BirdieNotFoundIcon />
			<h1 class="font-semibold text-gray-500">Oops! Seems like you have no fleets!</h1>
		</div>

		<!-- div to show when there are authority letters -->
		<div
			class="flex h-full flex-1 flex-col"
			v-else>
			<!-- search & filter controls -->

			<div class="my-3 flex-grow">
				<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
					<table class="w-full text-left text-gray-500">
						<thead class="bg-gray-100 text-sm text-gray-700 uppercase">
							<tr>
								<th
									scope="col"
									class="table-headers ps-3">
									Name
								</th>
								<!-- Details will show client name and their contact -->
								<th
									scope="col"
									class="table-headers laptop-lg:table-cell hidden">
									Time Period
								</th>
								<th
									scope="col"
									class="table-headers">
									Issued
								</th>
								<th
									scope="col"
									class="table-headers tablet:table-cell hidden">
									In Progress
								</th>
								<th
									scope="col"
									class="table-headers mobile-lg:table-cell hidden">
									Completed
								</th>
								<th
									scope="col"
									class="table-headers laptop:table-cell hidden text-center">
									Intermediary
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
									class="p-6 font-medium whitespace-nowrap text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>username</span
									>
								</td>
								<td class="laptop-lg:table-cell hidden p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>bookedtoday</span
									>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>regenthq</span
									>
								</td>
								<td class="mobile-lg:table-cell hidden p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>domain role</span
									>
								</td>
								<td class="tablet:table-cell hidden p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300">agency</span>
								</td>
								<td class="laptop:table-cell hidden p-6 text-gray-300">
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
									class="generic-table-cell py-4 ps-3 font-semibold text-gray-600">
									{{ fleet.fleetName }}
								</td>
								<td
									class="generic-table-cell laptop-lg:table-cell hidden py-4 text-gray-600">
									<span class="w-fit rounded-lg bg-blue-200 px-1 text-blue-600"
										>from {{ fleet.startDate }}</span
									><br /><span>to {{ fleet.endDate }}</span>
								</td>
								<td class="generic-table-cell py-4 font-semibold">
									{{ fleet.vehiclesIssued ?? '0' }}
								</td>
								<td
									class="generic-table-cell tablet:table-cell hidden py-4 font-semibold text-yellow-500">
									{{ fleet.vehiclesInProgress ?? '0' }}
								</td>
								<td
									class="generic-table-cell mobile-lg:table-cell hidden py-4 font-semibold text-green-500">
									{{ fleet.vehiclesCompleted ?? '0' }}
								</td>
								<td
									class="generic-table-cell laptop:table-cell hidden w-48 max-w-48 py-4 text-center text-wrap">
									{{ fleet.brokerOrganization?.corpName ?? 'N/A' }}
								</td>
								<td class="py-4 pe-3 text-end">
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
													v-if="
														fleet.vehiclesIssued &&
														fleet.vehiclesIssued > 0
													"
													:to="{
														name: 'vehicle-valuation-explore-fleet',
														params: {
															fleet_id: fleet.id,
														},
													}">
													View Vehicles
												</NuxtLink>
												<button
													class="block w-full px-4 py-2 text-center hover:bg-gray-100"
													v-else>
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
			<div
				class="tablet:flex-row tablet:min-h-12 tablet:h-12 mt-5 flex h-16 min-h-16 flex-col items-center justify-between">
				<h1 class="text-sm font-semibold text-gray-500">
					Showing {{ page + 1 }} of {{ totalPages }} pages.
				</h1>
				<div
					class="tablet:w-fit tablet:block flex h-full w-full justify-center space-x-2 md:space-x-4">
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
		fleetPage: page,
		totalFleetPages: totalPages,
	} = useValuationFleets();
</script>
