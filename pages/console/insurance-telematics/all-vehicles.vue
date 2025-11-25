<template>
	<!-- general vehicle data -->
	<div class="flex flex-1 flex-col rounded-lg border-2 bg-white outline-none">
		<div
			class="laptop:p-4 tablet:flex-row tablet:space-y-0 flex h-24 flex-col items-center justify-between space-y-2 border-b p-2">
			<div class="tablet:w-1/2 w-full">
				<h1 class="text-lg font-bold text-gray-700">All Vehicles</h1>
				<h2 class="text-sm text-gray-500">{{ totalVehicles }} Vehicles Found</h2>
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
			<!-- tab switcher -->
			<div
				class="tablet:w-1/2 laptop:w-1/3 grid h-12 w-full grid-cols-4 divide-x-[1.5px] overflow-clip rounded-lg border-[1px] text-xs text-gray-600">
				<button
					:class="['font-semibold', !activeRiskLevel && 'bg-blue-100']"
					type="button"
					@click="setRiskLevel(null)">
					All Vehicles
				</button>
				<button
					:class="[
						'inline-flex items-center justify-center space-x-2 font-semibold',
						activeRiskLevel == 'Low Risk' && 'bg-blue-100',
					]"
					type="button"
					@click="setRiskLevel('Low Risk')">
					Low Risk
				</button>
				<button
					:class="[
						'inline-flex items-center justify-center space-x-2 font-semibold',
						activeRiskLevel == 'Medium Risk' && 'bg-blue-100',
					]"
					type="button"
					@click="setRiskLevel('Medium Risk')">
					Medium Risk
				</button>
				<button
					:class="[
						'inline-flex items-center justify-center space-x-2 font-semibold disabled:bg-gray-100',
						activeRiskLevel == 'High Risk' && 'bg-blue-100',
					]"
					type="button"
					@click="setRiskLevel('High Risk')">
					High Risk
				</button>
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
						placeholder="Search by registration, client name or client number."
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
						<span v-else-if="filterPeriod == 'last-6-months'">Last Six Months</span>
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
											computingDriverRiskLevel && filterPeriod == e.period
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
									Distance Driven
								</th>
								<th
									scope="col"
									class="table-headers desktop-4k:table-cell hidden">
									Overall Score
								</th>
								<th
									scope="col"
									class="table-headers laptop:table-cell hidden">
									Behavior Metrics
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

								<td class="tablet:table-cell py-4">
									{{ v.driverRiskScore?.totalDistanceTraveled ?? '-' }} Km
								</td>
								<td class="tablet:table-cell hidden py-4">
									<span
										:class="[
											'rounded-full px-2 py-1 text-sm',
											!v.driverRiskScore && 'text-gray-500',
											v.driverRiskScore?.averageScore! > 5 &&
												'border-[1px] border-red-500 bg-red-200 text-red-500',
											v.driverRiskScore?.averageScore! >= 2 &&
												v.driverRiskScore?.averageScore! <= 4 &&
												'border-[1px] border-yellow-500 bg-yellow-200 text-yellow-500',
											v.driverRiskScore?.averageScore! < 2 &&
												'border-[1px] border-green-500 bg-green-200 text-green-500',
										]"
										>{{ v.driverRiskScore?.averageScore ?? '-' }}</span
									>
								</td>
								<td class="tablet:table-cell hidden space-y-2 py-4">
									<span
										class="inline-flex w-40 items-center justify-between space-x-1">
										<span class="text-sm text-gray-600">Harsh Corn.</span>
										<span class="text-gray-500">&VerticalBar;</span>
										<span
											v-if="computingDriverRiskLevel && !v.driverRiskScore"
											class="icon-[svg-spinners--3-dots-scale] size-5 text-gray-500"></span>
										<span
											:class="[
												'font-semibold',
												!v.driverRiskScore && 'text-gray-500',
												v.driverRiskScore?.harshCornering
													?.percentageScore! > 5 && 'text-red-500',
												v.driverRiskScore?.harshCornering
													?.percentageScore! >= 2 &&
													v.driverRiskScore?.harshCornering
														?.percentageScore! <= 4 &&
													'text-yellow-500',
												v.driverRiskScore?.harshCornering
													?.percentageScore! < 2 && 'text-green-500',
											]"
											v-else
											>{{
												v.driverRiskScore?.harshCornering
													?.percentageScore ?? '-'
											}}</span
										>
									</span>
									<br />
									<span
										class="inline-flex w-40 items-center justify-between space-x-1">
										<span class="text-sm text-gray-600">Harsh Accel.</span>
										<span class="text-gray-500">&VerticalBar;</span>
										<span
											v-if="computingDriverRiskLevel && !v.driverRiskScore"
											class="icon-[svg-spinners--3-dots-scale] size-5 text-gray-500"></span>
										<span
											:class="[
												'font-semibold',
												!v.driverRiskScore && 'text-gray-500',
												v.driverRiskScore?.harshAccelerationScore
													?.percentageScore! > 5 && 'text-red-500',
												v.driverRiskScore?.harshAccelerationScore
													?.percentageScore! >= 2 &&
													v.driverRiskScore?.harshAccelerationScore
														?.percentageScore! <= 4 &&
													'text-yellow-500',
												v.driverRiskScore?.harshAccelerationScore
													?.percentageScore! < 2 && 'text-green-500',
											]"
											v-else
											>{{
												v.driverRiskScore?.harshAccelerationScore
													?.percentageScore ?? '-'
											}}</span
										>
									</span>
									<br />
									<span
										class="inline-flex w-40 items-center justify-between space-x-1">
										<span class="text-sm text-gray-600">Harsh Brake</span>
										<span class="text-gray-500">&VerticalBar;</span>
										<span
											v-if="computingDriverRiskLevel && !v.driverRiskScore"
											class="icon-[svg-spinners--3-dots-scale] size-5 text-gray-500"></span>
										<span
											:class="[
												'font-semibold',
												!v.driverRiskScore && 'text-gray-500',
												v.driverRiskScore?.brakingScore?.percentageScore! >
													5 && 'text-red-500',
												v.driverRiskScore?.brakingScore?.percentageScore! >=
													2 &&
													v.driverRiskScore?.brakingScore
														?.percentageScore! <= 4 &&
													'text-yellow-500',
												v.driverRiskScore?.brakingScore?.percentageScore! <
													2 && 'text-green-500',
											]"
											v-else
											>{{
												v.driverRiskScore?.brakingScore?.percentageScore ??
												'-'
											}}</span
										>
									</span>
								</td>
								<td class="tablet:table-cell hidden py-4 ps-3">
									<button
										class="rounded-md border-[1px] border-blue-500 bg-blue-100 px-2 py-1 text-blue-500 disabled:border-gray-500 disabled:bg-gray-100 disabled:text-gray-500"
										:data-modal-target="`driving-score-${idx}-modal`"
										:data-modal-toggle="`driving-score-${idx}-modal`"
										:disabled="computingDriverRiskLevel && !v.driverRiskScore"
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
			modal-title="Driving Score "
			:modal-id="`driving-score-${idx}-modal`"
			modal-size="large"
			:modal-subtitle="`Vehicle ${v.name} - ${v.driver_data?.name ?? 'Name N/A'}`">
			<DrivingBehaviourExpandedView
				:id="v.id"
				:reg-no="v.name"
				:client-phone="v.driver_data?.name ?? 'Name N/A'"
				:client-name="v.driver_data?.phone ?? 'Phone N/A'"
				:device-status="v.online"
				:driver-risk-score="v.driverRiskScore" />
		</ParentModal>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'insurance-telematics-all-vehicles',
		layout: 'console-layout',
	});

	const {
		page,
		size,
		searchString,
		computedVehicles,
		fetchingClientVehicles,
		activeRiskLevel,
		totalVehicles,
		filterPeriod,
		errorFetchingClientVehicles,
		computingDriverRiskLevel,
		setRiskLevel,
		setFilterPeriod,
	} = useDrivingScore();

	const availablePeriodButtons = reactive([
		{
			name: 'Today',
			period: 'today',
		},
		{
			name: 'This Week',
			period: 'this-week',
		},
		{
			name: 'Last 30 Days',
			period: 'last-30-days',
		},
		{
			name: 'Last 3 Months',
			period: 'last-3-months',
		},
		{
			name: 'Last 6 Months',
			period: 'last-6-months',
		},
	]);
</script>
