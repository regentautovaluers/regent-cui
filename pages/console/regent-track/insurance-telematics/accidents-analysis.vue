<template>
	<!-- Preffered Regent Branch -->
	<div
		class="mb-3 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800"
		role="alert">
		<div class="flex items-center">
			<svg
				class="me-2 h-4 w-4 shrink-0"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="currentColor"
				viewBox="0 0 20 20">
				<path
					d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
			</svg>
			<span class="sr-only">Info</span>
			<h3 class="text-sm font-medium">Notice On Computations</h3>
		</div>

		<p class="mt-2 mb-4 text-sm">
			Kindly note that executing these computations is resource intensive and takes a while.
			We have done our best to optimize the running time.
			<span class="font-semibold"
				>Kindly avoid refreshing the page, or navigating away from it during this
				process!</span
			>
			To improve your experience,
			<span class="font-semibold"
				>each vehicle's result will be populated as soon as it is available</span
			>. You are free to scroll through the table even as the computations are running.
			<span class="font-semibold"
				>Changing the time period filter or refreshing the page causes this data to reload,
				and progress to restart.</span
			>
			The progress counter below should help you know how many vehicle's computations are
			already done.
		</p>
		<div class="flex">
			<div
				type="button"
				class="space-x-1 rounded-lg border border-yellow-800 bg-transparent px-3 py-1.5 text-center text-sm font-medium text-yellow-800 hover:bg-yellow-900 hover:text-white focus:ring-4 focus:ring-yellow-300 focus:outline-none">
				<span>Computed</span><span class="text-lg">{{ totalDone() }}</span
				><span>/</span><span class="text-base">{{ computingFor }}</span>
			</div>
		</div>
	</div>

	<!-- general vehicle data -->
	<div class="flex flex-1 flex-col rounded-lg border-2 bg-white outline-none">
		<div
			class="laptop:p-4 tablet:flex-row tablet:space-y-0 flex h-24 flex-col items-center justify-between space-y-2 border-b p-2">
			<div class="tablet:w-1/2 w-full">
				<h1 class="text-lg font-bold text-gray-700">All Accidents</h1>
				<h2 class="text-sm text-gray-500">
					Shows most recent accident within selected timeframe
				</h2>
				<div class="flex w-fit items-center space-x-3">
					<h1 class="font-semibold text-gray-600">Guide:</h1>
					<div class="inline-flex items-center space-x-1">
						<span class="size-3 rounded-full bg-green-500"> </span>
						<span class="test-sm text-gray-500"> Low Risk </span>
					</div>
					<div class="inline-flex items-center space-x-1">
						<span class="size-3 rounded-full bg-yellow-500"> </span>
						<span class="test-sm text-gray-500"> Medium Risk </span>
					</div>
					<div class="inline-flex items-center space-x-1">
						<span class="size-3 rounded-full bg-red-500"> </span>
						<span class="test-sm text-gray-500"> High Risk </span>
					</div>
				</div>
			</div>
		</div>
		<div>
			<div
				class="tablet:flex-row tablet:space-y-0 tablet:p-5 flex w-full flex-col items-center justify-between space-y-2 p-3">
				<div
					class="tablet:w-[75%] laptop:w-[85%] relative flex w-full items-center justify-between">
					<span
						class="icon-[material-symbols-light--search] absolute translate-x-1 text-2xl text-gray-700"></span>
					<input
						type="text"
						name="search-tracked-device"
						id="search-tracked-device"
						placeholder="Search by registration or client name"
						class="h-14 w-1/3 rounded-md ps-8 text-sm text-gray-700 outline-none placeholder:text-gray-500"
						v-model.trim="searchString" />
				</div>

				<div
					class="thin-scrollbar tablet:w-[25%] laptop:w-[15%] w-full space-y-5 overflow-y-auto">
					<button
						id="filter-filters-dd-btn"
						data-dropdown-toggle="filters-dd"
						class="inline-flex h-14 w-full items-center justify-between rounded-lg border border-gray-200 px-5 py-2.5 text-center text-sm font-bold text-gray-500 outline-none hover:bg-gray-200"
						type="button">
						<span v-if="!filterPeriod">Select Time Period</span>
						<span v-else-if="filterPeriod == 'today'">Today</span>
						<span v-else-if="filterPeriod == 'this-week'">This Week</span>
						<span v-else-if="filterPeriod == 'last-30-days'">This Month</span>
						<span v-else-if="filterPeriod == 'last-3-months'">Last Three Months</span>
						<span
							class="icon-[material-symbols-light--keyboard-arrow-down] size-[25px] text-gray-500"></span>
					</button>
					<!-- Dropdown menu -->
					<div
						id="filters-dd"
						class="laptop:-translate-x-10 tablet:w-1/2 laptop:w-96 z-10 hidden w-full divide-y divide-gray-100 rounded-lg border-2 border-gray-200 bg-white shadow-xs">
						<ul
							class="w-full space-y-2 p-2 text-sm text-gray-700"
							aria-labelledby="dropdownDefaultButton">
							<li
								class="w-full"
								v-for="(e, idx) in availablePeriodButtons"
								:key="idx">
								<button
									type="button"
									:class="[
										'inline-flex w-full items-center space-x-2 rounded-md px-4 py-2 text-start hover:bg-gray-200',
										filterPeriod == e.period && 'bg-blue-200',
									]"
									@click="setFilterPeriod(e.period as any)">
									<span
										class="icon-[svg-spinners--ring-resize] text-lg text-gray-600"
										v-if="
											computingInsuranceMetrics && filterPeriod == e.period
										"></span>
									<span>{{ e.name }}</span>
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<!-- table -->
			<div class="flex-grow">
				<div class="relative overflow-x-auto">
					<table class="w-full text-left text-gray-500">
						<thead class="bg-gray-100 text-sm text-gray-700 uppercase">
							<tr>
								<!-- Details will show client name and their contact -->
								<th
									scope="col"
									class="table-headers tablet:table-cell hidden ps-3">
									Device
								</th>
								<th
									scope="col"
									class="table-headers tablet:table-cell hidden">
									Driver
								</th>
								<th
									scope="col"
									class="table-headers tablet:table-cell hidden">
									Speed At Impact
								</th>
								<th
									scope="col"
									class="table-headers desktop-4k:table-cell hidden">
									Impact Time & Loc.
								</th>
								<th
									scope="col"
									class="table-headers laptop:table-cell hidden">
									Analysis
								</th>
								<th
									scope="col"
									class="table-headers laptop:table-cell hidden">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							<!-- loading state -->
							<tr
								class="border-b bg-white hover:bg-gray-100"
								v-for="a in 10"
								:key="a"
								v-if="fetchingClientVehicles">
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>regenthq</span
									>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>regenthq</span
									>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>regenthq</span
									>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300">agency</span>
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

							<!-- the actual data -->
							<tr
								v-else-if="
									!fetchingClientVehicles &&
									computedVehicles.vehicles &&
									computedVehicles.vehicles.length > 0
								"
								v-for="(v, idx) in computedVehicles.vehicles"
								:key="idx"
								class="border-b bg-white text-sm hover:bg-gray-100">
								<td class="tablet:table-cell py-4 ps-3">
									{{ v.name }}
								</td>
								<td class="tablet:table-cell py-4">
									<p class="inline-flex w-fit items-center space-x-1">
										<span
											class="icon-[material-symbols-light--person-2-rounded] text-xl"></span>
										<span class="text-gray-700">{{
											v.driver_data?.name ?? 'Name N/A'
										}}</span>
									</p>
									<br />
									<p class="inline-flex w-fit items-center space-x-1">
										<span
											class="icon-[material-symbols-light--settings-phone-sharp] text-xl"></span>
										<span>{{ v.driver_data?.phone ?? 'Phone N/A' }}</span>
									</p>
								</td>
								<td class="tablet:table-cell hidden py-4">
									<span
										:class="[
											'rounded-full px-2 py-1 text-sm',
											!v.latestAccident && 'text-gray-500',
											v.latestAccident?.speedBeforeCrash &&
												v.latestAccident?.speedBeforeCrash > 80 &&
												'border-[1px] border-red-500 bg-red-200 text-red-500',
											v.latestAccident?.speedBeforeCrash &&
												v.latestAccident?.speedBeforeCrash < 80 &&
												'border-[1px] border-green-500 bg-green-200 text-green-500',
										]"
										>{{
											!v.latestAccident || !v.latestAccident?.speedBeforeCrash
												? '-'
												: `${v.latestAccident?.speedBeforeCrash} ${v.latestAccident?.speedUnits}`
										}}</span
									>
								</td>
								<td class="tablet:table-cell py-4 ps-3">
									<p class="inline-flex w-fit items-center space-x-1">
										<span
											class="icon-[material-symbols-light--person-2-rounded] text-xl"></span>
										<span class="text-gray-700">{{
											v.latestAccident?.geoCodeLocation ?? 'Location N/A'
										}}</span>
									</p>
									<br />
									<p class="inline-flex w-fit items-center space-x-1">
										<span
											class="icon-[material-symbols-light--settings-phone-sharp] text-xl"></span>
										<span>{{ v.latestAccident?.time ?? 'Time N/A' }}</span>
									</p>
								</td>
								<td class="tablet:table-cell hidden space-y-2 py-4">
									<span
										class="inline-flex w-40 items-center justify-between space-x-1">
										<span class="text-sm text-gray-600">Impact Force</span>
										<span class="text-gray-500">&VerticalBar;</span>
										<span
											v-if="computingInsuranceMetrics && !v.latestAccident"
											class="icon-[svg-spinners--3-dots-scale] size-5 text-gray-500"></span>
										<span
											:class="[
												'font-semibold',
												!v.latestAccident ||
													(!v.latestAccident?.impactForce &&
														'text-gray-500'),
												v.latestAccident?.impactForce &&
													v.latestAccident?.impactForce > 8 &&
													'text-red-500',
												v.latestAccident?.impactForce &&
													v.latestAccident?.impactForce >= 4 &&
													v.latestAccident?.impactForce &&
													v.latestAccident?.impactForce <= 8 &&
													'text-yellow-500',
												v.latestAccident?.impactForce &&
													v.latestAccident?.impactForce < 4 &&
													'text-green-500',
											]"
											v-else
											>{{ v.latestAccident?.impactForce ?? '-' }}</span
										>
									</span>
									<br />
									<span
										class="inline-flex w-40 items-center justify-between space-x-1">
										<span class="text-sm text-gray-600">Harsh Braking</span>
										<span class="text-gray-500">&VerticalBar;</span>
										<span
											v-if="computingInsuranceMetrics && !v.driverRiskScore"
											class="icon-[svg-spinners--3-dots-scale] size-5 text-gray-500"></span>
										<span
											:class="[
												'font-semibold',
												!v.latestAccident && 'text-gray-500',
												v.latestAccident?.harshBrakingBeforeCrash &&
													'text-red-500',
												!v.latestAccident?.harshBrakingBeforeCrash &&
													'text-green-500',
											]"
											v-else
											>{{
												v.latestAccident?.harshBrakingBeforeCrash
													? 'Yes'
													: 'No'
											}}</span
										>
									</span>
									<!-- <br />
									<span
										class="inline-flex w-40 items-center justify-between space-x-1">
										<span class="text-sm text-gray-600">Weather</span>
										<span class="text-gray-500">&VerticalBar;</span>
										<span
											v-if="computingInsuranceMetrics && !v.latestAccident"
											class="icon-[svg-spinners--3-dots-scale] size-5 text-gray-500"></span>
										<span
											class="text-gray-500"
											v-else
											>{{ v.latestAccident?.weather ?? '-' }}</span
										>
									</span>
									<br /> -->
								</td>
								<td class="tablet:table-cell hidden py-4 ps-3">
									<button
										class="rounded-md border-[1px] border-blue-500 bg-blue-100 px-2 py-1 text-blue-500 disabled:border-gray-500 disabled:bg-gray-100 disabled:text-gray-500"
										:data-modal-target="`incident-analysis-${idx}-modal`"
										:data-modal-toggle="`incident-analysis-${idx}-modal`"
										:disabled="
											isDeviceSubscriptionExpired(v) ||
											(computingInsuranceMetrics && !v.latestAccident)
										"
										@click="setSidebarCollapsedState(false)">
										View Details
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- page controls -->
			<div
				class="tablet:flex-row tablet:min-h-12 tablet:h-12 my-5 flex h-16 min-h-16 flex-col items-center justify-between px-5">
				<h1 class="text-sm font-semibold text-gray-500">
					Showing {{ page + 1 }} of {{ computedVehicles.totalPages }} pages.
				</h1>
				<div
					class="tablet:w-fit tablet:block flex h-full w-full justify-center space-x-2 md:space-x-4">
					<button
						class="table-page-buttons"
						@click="page -= 1"
						:disabled="page === 0 || computedVehicles.totalPages == 1">
						Previous
					</button>
					<button
						class="table-page-buttons"
						@click="page += 1"
						:disabled="
							page === computedVehicles.totalPages - 1 ||
							computedVehicles.totalPages == 1
						">
						Next
					</button>
				</div>
			</div>
		</div>

		<!-- modal to add comment for table entry -->
		<ParentModal
			v-if="
				!fetchingClientVehicles &&
				computedVehicles.vehicles &&
				computedVehicles.vehicles.length > 0
			"
			v-for="(v, idx) in computedVehicles.vehicles"
			:key="idx"
			modal-title="Incident Analysis"
			:modal-id="`incident-analysis-${idx}-modal`"
			modal-size="large"
			:modal-subtitle="`Generated on ${new Date().toLocaleDateString()}`">
			<IncidentAnalysisExpandedView
				:id="v.id"
				:reg-no="v.name"
				a
				:client-phone="v.driver_data?.phone ?? 'Name N/A'"
				:client-name="v.driver_data?.name ?? 'Phone N/A'"
				:device-status="v.online"
				:latest-accident="v.latestAccident!" />
		</ParentModal>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'insurance-telematics-accidents-analysis',
		layout: 'console-layout',
	});

	const {
		page,
		size,
		searchString,
		computedVehicles,
		fetchingClientVehicles,
		activeRiskLevel,
		errorFetchingClientVehicles,
		totalVehicles,
		fromDate,
		toDate,
		computingInsuranceMetrics,
		filterPeriod,
		availablePeriodButtons,
		getComputingAnalyticsFor: computingFor,
		getTotalAnalyticsDone: totalDone,
		setRiskLevel,
		setFilterPeriod,
		isDeviceSubscriptionExpired,
	} = useAnalyzeInsuranceMetrics();
</script>
