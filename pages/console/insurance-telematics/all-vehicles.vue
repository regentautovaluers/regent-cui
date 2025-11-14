<template>
	<!-- general vehicle data -->
	<div class="flex flex-1 flex-col rounded-lg border-2 bg-white outline-none">
		<div
			class="laptop:p-4 tablet:flex-row tablet:space-y-0 flex h-24 flex-col items-center justify-between space-y-2 border-b p-2">
			<div class="tablet:w-1/2 w-full">
				<h1 class="text-lg font-bold text-gray-700">All Vehicles</h1>
				<h2 class="text-sm text-gray-500">{{ totalVehicles }} Vehicles Found</h2>
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
						activeRiskLevel == 'low' && 'bg-blue-100',
					]"
					type="button"
					@click="setRiskLevel('low')">
					Low Risk
				</button>
				<button
					:class="[
						'inline-flex items-center justify-center space-x-2 font-semibold',
						activeRiskLevel == 'medium' && 'bg-blue-100',
					]"
					type="button"
					@click="setRiskLevel('medium')">
					Medium Risk
				</button>
				<button
					:class="[
						'inline-flex items-center justify-center space-x-2 font-semibold disabled:bg-gray-100',
						activeRiskLevel == 'high' && 'bg-blue-100',
					]"
					type="button"
					@click="setRiskLevel('high')">
					High Risk
				</button>
			</div>
		</div>
		<div class="">
			<div class="relative flex w-full items-center justify-between p-5">
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

								<td class="tablet:table-cell py-4">{{ 890 }} Km</td>
								<td class="tablet:table-cell hidden py-4">
									<span
										:class="[
											'rounded-full border-[1px] px-2 py-1 text-sm',
											'offline' == v.online &&
												'border-red-500 bg-red-200 text-red-500',
											'expired' == v.online &&
												'border-yellow-500 bg-yellow-200 text-yellow-500',
											['ack', 'engine', 'online'].includes(v.online) &&
												'border-green-500 bg-green-200 text-green-500',
										]"
										>{{ v.online }}</span
									>
								</td>
								<td class="tablet:table-cell hidden space-y-2 py-4">
									<span
										class="inline-flex w-40 items-center justify-between space-x-1">
										<span class="text-sm text-gray-600">Overspeed</span>
										<span class="text-gray-500">&VerticalBar;</span>
										<span
											v-if="computingDriverRiskLevel && !v.driverRiskScore"
											class="icon-[svg-spinners--3-dots-scale] size-3 text-red-500"></span>
										<span
											class="font-semibold text-red-500"
											v-else
											>{{
												v.driverRiskScore?.overspeedScore
													?.percentageScore ?? 0
											}}</span
										>
									</span>
									<br />
									<span
										class="inline-flex w-40 items-center justify-between space-x-1">
										<span class="text-sm text-gray-600">Harsh Accel.</span>
										<span class="text-gray-500">&VerticalBar;</span>
										<span
											v-if="computingDriverRiskLevel && v.driverRiskScore"
											class="icon-[svg-spinners--3-dots-scale] size-3 text-green-500"></span>
										<span
											class="font-semibold text-green-500"
											v-else
											>{{
												v.driverRiskScore?.harshAccelerationScore
													?.percentageScore ?? 0
											}}</span
										>
									</span>
									<br />
									<span
										class="inline-flex w-40 items-center justify-between space-x-1">
										<span class="text-sm text-gray-600">Harsh Brake</span>
										<span class="text-gray-500">&VerticalBar;</span>
										<span
											v-if="computingDriverRiskLevel && v.driverRiskScore"
											class="icon-[svg-spinners--3-dots-scale] size-3 text-yellow-500"></span>
										<span
											class="font-semibold text-yellow-500"
											v-else
											>{{
												v.driverRiskScore?.brakingScore?.percentageScore ??
												0
											}}</span
										>
									</span>
								</td>
								<td class="tablet:table-cell hidden py-4 ps-3">
									<button
										class="rounded-md border-[1px] border-green-500 bg-green-100 px-2 py-1 text-green-500"
										:data-modal-target="`add-comment-tbl-${idx}`"
										:data-modal-toggle="`add-comment-tbl-${idx}`">
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
		errorFetchingClientVehicles,
		computingDriverRiskLevel,
		setRiskLevel,
	} = useDrivingScore();
</script>
