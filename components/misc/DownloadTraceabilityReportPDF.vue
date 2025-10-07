<template>
	<div
		class="w-full"
		id="download-as-pdf">
		<div class="flex h-full items-center space-x-3">
			<button
				class="inline-flex h-[50px] w-[50px] items-center justify-center rounded-lg bg-red-500 outline-none">
				<span
					class="icon-[material-symbols-light--shield-outline] text-4xl text-slate-100"></span>
			</button>
			<div>
				<h1 class="text-xl font-semibold text-gray-700">Vehicle Traceability Report</h1>
				<h2 class="text-sm text-gray-500">Generated on August 19, 2025</h2>
			</div>
		</div>
		<h1 class="my-4 font-bold text-gray-700">Executive Summary</h1>
		<div class="grid w-full grid-cols-6 gap-5">
			<!-- total vehicles -->
			<div
				class="h-28 place-content-center place-items-center rounded-lg border border-blue-300 bg-blue-100 outline-none">
				<h1 class="font-bold text-blue-600">{{ props.stats.total_devices }}</h1>
				<h1 class="text-sm text-gray-500">Total Vehicles</h1>
			</div>

			<!-- online vehicles -->
			<div
				class="h-28 place-content-center place-items-center rounded-lg border border-green-300 bg-green-100 outline-none">
				<h1 class="font-bold text-green-600">{{ props.stats.total_online }}</h1>
				<h1 class="text-sm text-gray-500">Online Vehicles</h1>
			</div>

			<!-- offline vehicles -->
			<div
				class="h-28 place-content-center place-items-center rounded-lg border border-red-300 bg-red-100 outline-none">
				<h1 class="font-bold text-red-600">{{ props.stats.total_offline }}</h1>
				<h1 class="text-sm text-gray-500">Offline Vehicles</h1>
			</div>

			<!-- watchlist -->
			<div
				class="h-28 place-content-center place-items-center rounded-lg border border-red-300 bg-red-100 outline-none">
				<h1 class="font-bold text-red-600">{{ props.stats.total_on_watchlist }}</h1>
				<h1 class="text-sm text-gray-500">Watchlist</h1>
			</div>

			<!-- installations -->
			<div
				class="h-28 place-content-center place-items-center rounded-lg border border-blue-300 bg-blue-100 outline-none">
				<h1 class="font-bold text-blue-600">{{ props.stats.new_installations }}</h1>
				<h1 class="text-sm text-gray-500">New Installations</h1>
			</div>

			<!-- expiring soon -->
			<div
				class="h-28 place-content-center place-items-center rounded-lg border border-red-300 bg-red-100 outline-none">
				<h1 class="font-bold text-red-600">{{ props.stats.expires_soon }}</h1>
				<h1 class="text-gray-500">Expiring Soon</h1>
			</div>
		</div>
		<!-- only show if there are devices on the watchlist -->
		<template v-if="onWatchList.length > 0">
			<!-- cricial watchlist -->
			<div class="mt-4 inline-flex items-center space-x-4">
				<span
					class="icon-[material-symbols-light--warning-outline] text-4xl text-red-500"></span>
				<h1 class="font-semibold text-gray-700">Critical Watchlist</h1>
			</div>
			<div
				class="my-8 h-16 place-content-center rounded-lg border border-red-300 bg-red-100 p-2 text-red-600 outline-none">
				<h1 class="text-sm">
					The following vehicles may require immediate intervention due to uncooperative
					clients!
				</h1>
			</div>

			<!-- the table -->
			<div class="flex-grow border border-red-300 outline-none">
				<div class="relative overflow-x-auto">
					<table class="w-full text-left text-gray-500">
						<thead class="bg-red-100 text-sm text-gray-700 uppercase">
							<tr>
								<!-- Details will show client name and their contact -->
								<th
									scope="col"
									class="table-headers ps-3">
									Reg No
								</th>
								<th
									scope="col"
									class="table-headers">
									Client
								</th>
								<th
									scope="col"
									class="table-headers">
									Days Offline
								</th>
								<th
									scope="col"
									class="table-headers">
									Latest Updates
								</th>
							</tr>
						</thead>
						<tbody>
							<!-- the actual data -->
							<tr
								v-for="(v, idx) in onWatchList"
								:key="idx"
								class="border-b border-b-red-300">
								<td class="table-cell w-52 py-5 ps-3 text-sm">
									{{ v.name }}
								</td>
								<td class="table-cell w-52 py-5 text-sm">
									<span class="text-gray-700">{{
										v.driver_data?.name ?? 'Name N/A'
									}}</span>
									<br />
									<span class="text-gray-700">{{
										v.driver_data?.phone ?? 'Phone N/A'
									}}</span>
								</td>
								<td class="table-cell w-32 py-5">
									{{ 0 }}
								</td>

								<td class="table-cell space-y-2 py-5">
									<template
										v-if="v.comment && v.comment.length > 0"
										v-for="c in v.comment">
										<p class="inline-flex w-full space-x-2">
											<span class="text-sm font-semibold text-gray-700"
												>{{ c.username }}:</span
											><span class="text-sm text-wrap text-gray-500"
												>{{ c.comment }}
											</span>
										</p>
										<br />
									</template>
									<span
										v-else
										class="text-sm text-gray-500"
										>No comments for this device!</span
									>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</template>

		<!-- all vehicles -->
		<div class="my-8 inline-flex items-center space-x-4">
			<span
				class="icon-[material-symbols-light--list-alt-rounded] text-4xl text-blue-500"></span>
			<h1 class="font-semibold text-gray-700">All Vehicles</h1>
		</div>

		<!-- the table -->
		<div class="flex-grow border border-blue-300 outline-none">
			<div class="relative overflow-x-auto">
				<table class="w-full text-left text-gray-500">
					<thead class="bg-gray-100 text-sm text-gray-700 uppercase">
						<tr>
							<!-- Details will show client name and their contact -->
							<th
								scope="col"
								class="table-headers ps-3">
								Reg No
							</th>
							<th
								scope="col"
								class="table-headers">
								Client
							</th>
							<th
								scope="col"
								class="table-headers">
								Installed
							</th>
							<th
								scope="col"
								class="table-headers">
								Expiry
							</th>
							<th
								scope="col"
								class="table-headers">
								Status
							</th>
							<th
								scope="col"
								class="table-headers">
								Latest Updates
							</th>
						</tr>
					</thead>
					<tbody>
						<!-- the actual data -->
						<tr
							v-for="(v, idx) in props.vehicles"
							:key="idx"
							class="border-b border-b-blue-300">
							<td class="table-cell w-52 py-5 ps-3 text-sm">
								{{ v.name }}
							</td>
							<td class="table-cell w-52 py-5 text-sm">
								<span class="text-gray-700">{{
									v.driver_data?.name ?? 'Name N/A'
								}}</span>
								<br />
								<span class="text-gray-700">{{
									v.driver_data?.phone ?? 'Phone N/A'
								}}</span>
							</td>
							<td class="table-cell w-32 py-5 text-sm">
								{{
									v.device_data.created_at?.toString().split(' ')[0] ?? 'Date N/A'
								}}
							</td>
							<td class="table-cell w-32 py-5 text-sm">
								{{
									v.device_data.expiration_date?.toString().split(' ')[0] ??
									'Date N/A'
								}}
							</td>
							<td
								:class="[
									'table-cell w-32 py-5 text-sm font-bold uppercase',
									'offline' == v.online && 'text-red-500',
									'expired' == v.online && 'text-yellow-500',
									['ack', 'engine', 'online'].includes(v.online) &&
										'text-green-500',
								]">
								{{ v.online }}
							</td>
							<td class="table-cell space-y-2 py-5">
								<template
									v-if="v.comment && v.comment.length > 0"
									v-for="c in v.comment">
									<p class="inline-flex w-full space-x-2">
										<span class="text-sm font-semibold text-gray-700"
											>{{ c.username }}:</span
										><span class="text-sm text-wrap text-gray-500"
											>{{ c.comment }}
										</span>
									</p>
									<br />
								</template>
								<span
									v-else
									class="text-sm text-gray-500"
									>No comments for this device!</span
								>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { type TrackedVehicles } from '~/types/regent-tracking/tracked-vehicles';

	const props = defineProps({
		stats: {
			required: true,
			type: Object as () => {
				total_online: number;
				total_offline: number;
				new_installations: number;
				expires_soon: number;
				total_devices: number;
				total_on_watchlist: number;
			},
		},
		vehicles: {
			required: true,
			type: Object as () => TrackedVehicles[],
		},
	});

	const onWatchList = computed(
		() => props.vehicles.filter((v) => v.on_watchlist == true) as TrackedVehicles[],
	);
</script>
