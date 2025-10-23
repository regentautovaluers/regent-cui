<template>
	<div class="console-layout-spacing flex flex-col space-y-10">
		<!-- top part -->
		<div
			class="inline-flex h-28 items-center justify-between rounded-lg border border-gray-200 bg-white p-5 shadow-sm outline-none">
			<div class="flex h-full items-center space-x-3">
				<button
					class="inline-flex h-[70%] w-[50px] items-center justify-center rounded-lg bg-red-500 outline-none">
					<span
						class="icon-[material-symbols-light--shield-outline] text-4xl text-slate-100"></span>
				</button>
				<div>
					<h1 class="text-xl font-semibold text-gray-700">Traceability Report</h1>
					<h2 class="text-sm text-gray-500">Real-time Vehicle Status and Monitoring</h2>
				</div>
			</div>
			<button
				class="inline-flex h-12 w-40 items-center justify-center space-x-1 rounded-md bg-blue-500 text-sm text-slate-100 transition-colors duration-200 ease-in-out outline-none hover:bg-blue-600"
				@click.prevent="() => reportToExcel()"
				type="button">
				<span
					:class="[
						'text-xl',
						loadingReportExport
							? 'icon-[svg-spinners--ring-resize]'
							: 'icon-[material-symbols-light--sim-card-download-outline]',
					]"></span>
				<span>Download Report</span>
			</button>
		</div>

		<!-- the stats -->
		<div class="grid h-28 grid-cols-5 gap-5">
			<div
				class="flex h-full items-center justify-center rounded-lg border bg-white p-5 shadow-xs outline-none">
				<div class="flex-grow">
					<h2 class="text-sm text-gray-500">Total Vehicles</h2>
					<h1 class="text-lg font-semibold text-gray-700">
						{{ computedStatistics.total_devices }}
					</h1>
				</div>
				<button
					class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-blue-300 bg-blue-100">
					<span
						class="icon-[material-symbols-light--supervisor-account] text-3xl text-blue-600"></span>
				</button>
			</div>
			<div
				class="flex h-full items-center justify-center rounded-lg border bg-white p-5 shadow-xs outline-none">
				<div class="flex-grow">
					<h2 class="text-sm text-gray-500">Online Vehicles</h2>
					<h1 class="text-lg font-semibold text-gray-700">
						{{ computedStatistics.total_online }}
					</h1>
					<h3 class="inline-flex items-center space-x-1 text-sm">
						<span class="font-bold text-green-500"
							>{{ computedStatistics.dist.online_dist }}%</span
						><span class="text-gray-500">of total</span>
					</h3>
				</div>
				<button
					class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-green-300 bg-green-100">
					<span
						class="icon-[material-symbols-light--android-wifi-4-bar] text-3xl text-green-600"></span>
				</button>
			</div>
			<div
				class="flex h-full items-center justify-center rounded-lg border bg-white p-5 shadow-xs outline-none">
				<div class="flex-grow">
					<h2 class="text-sm text-gray-500">Offline Vehicles</h2>
					<h1 class="text-lg font-semibold text-gray-700">
						{{ computedStatistics.total_offline }}
					</h1>
					<h3 class="inline-flex items-center space-x-1 text-sm">
						<span class="font-bold text-red-500"
							>{{ computedStatistics.dist.offline_dist }}%</span
						><span class="text-gray-500">of total</span>
					</h3>
				</div>
				<button
					class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-red-300 bg-red-100">
					<span
						class="icon-[material-symbols-light--android-wifi-4-bar-off] text-3xl text-red-600"></span>
				</button>
			</div>
			<div
				class="flex h-full items-center justify-center rounded-lg border bg-white p-5 shadow-xs outline-none">
				<div class="flex-grow">
					<h2 class="text-sm text-gray-500">Installations</h2>
					<h1 class="text-lg font-semibold text-gray-700">
						{{ computedStatistics.new_installations }}
					</h1>
					<h3 class="inline-flex items-center space-x-1 text-sm text-gray-500">
						Last 1 Month
					</h3>
				</div>
				<button
					class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-blue-300 bg-blue-100">
					<span
						class="icon-[material-symbols-light--chart-data-outline] text-3xl text-blue-600"></span>
				</button>
			</div>
			<div
				class="flex h-full items-center justify-center rounded-lg border bg-white p-5 shadow-xs outline-none">
				<div class="flex-grow">
					<h2 class="text-sm text-gray-500">Expiring Soon</h2>
					<h1 class="text-lg font-semibold text-gray-700">
						{{ computedStatistics.expires_soon }}
					</h1>
					<h3 class="inline-flex items-center space-x-1 text-sm text-gray-500">
						Within 30 days
					</h3>
				</div>
				<button
					class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-purple-300 bg-purple-100">
					<span
						class="icon-[material-symbols-light--date-range] text-3xl text-purple-600"></span>
				</button>
			</div>
		</div>

		<!-- general vehicle data -->
		<div
			class="divide-y-[2px] rounded-lg border border-gray-200 bg-white shadow-sm outline-none">
			<div class="flex h-24 items-center justify-between p-5 text-sm">
				<div>
					<h1 class="text-lg font-bold text-gray-700">All Vehicles</h1>
					<h2 class="text-sm text-gray-500">
						{{ computedStatistics.total_devices }} Vehicles Found
					</h2>
				</div>
				<label class="inline-flex cursor-pointer items-center">
					<input
						type="checkbox"
						value=""
						class="peer sr-only"
						v-model="onlyOnWatchlist" />
					<div
						class="peer relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
					<span class="ms-3 text-sm font-semibold text-gray-700">Only On Watchlist</span>
				</label>
			</div>
			<div class>
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
										class="table-headers">
										<span class="font-bold">Installation &</span><br /><span
											class="font-bold"
											>Subscription</span
										>
									</th>
									<th
										scope="col"
										class="table-headers desktop-4k:table-cell hidden">
										Last Seen
									</th>
									<th
										scope="col"
										class="table-headers laptop:table-cell hidden">
										Status
									</th>
									<th
										scope="col"
										class="table-headers laptop:table-cell hidden">
										Latest Updates
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
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>bookingstage</span
										>
									</td>
									<td></td>
								</tr>

								<!-- the actual data -->
								<tr
									v-else-if="
										!fetchingClientVehicles &&
										computedVehicles &&
										computedVehicles.length > 0
									"
									v-for="(v, idx) in computedVehicles"
									:key="idx"
									:class="[
										'border-b text-sm',
										v.on_watchlist && 'bg-red-100 hover:bg-red-200',
										!v.on_watchlist && 'bg-white hover:bg-gray-100',
									]">
									<td class="tablet:table-cell py-5 ps-3">
										<span class="font-bold text-gray-700">{{ v.name }}</span>
										<br />
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
									<td class="tablet:table-cell py-5">
										<p class="inline-flex w-fit space-x-2">
											<span class="font-semibold text-gray-700"
												>Installed:</span
											>
											<span>{{
												v.device_data.created_at
													?.toString()
													.split(' ')[0] ?? 'Date N/A'
											}}</span>
										</p>
										<br />
										<p class="inline-flex w-fit space-x-2">
											<span class="font-semibold text-gray-700"
												>Expires:
											</span>
											<span>{{
												v.device_data.expiration_date
													?.toString()
													.split(' ')[0] ?? 'Date N/A'
											}}</span>
										</p>
									</td>
									<td class="tablet:table-cell hidden py-5">
										<p class="inline-flex items-center space-x-2">
											<span
												class="icon-[material-symbols-light--nest-clock-farsight-analog-outline] text-xl"></span>
											<span>{{
												v.device_data.traccar.ack_time
													?.toString()
													.split(' ')[0] ?? 'Date N/A'
											}}</span>
										</p>
									</td>
									<td class="tablet:table-cell hidden py-5">
										<p class="inline-flex items-center space-x-2">
											<span
												:class="[
													'icon-[material-symbols-light--android-wifi-4-bar-off] text-xl',
													'offline' == v.online && 'text-red-500',
													'expired' == v.online && 'text-yellow-500',
													['ack', 'engine', 'online'].includes(
														v.online,
													) && 'text-green-500',
												]"></span>
											<span
												:class="[
													'rounded-full border-[1px] px-2 py-1 text-sm',
													'offline' == v.online &&
														'border-red-500 bg-red-200 text-red-500',
													'expired' == v.online &&
														'border-yellow-500 bg-yellow-200 text-yellow-500',
													['ack', 'engine', 'online'].includes(
														v.online,
													) &&
														'border-green-500 bg-green-200 text-green-500',
												]"
												>{{ v.online }}</span
											>
										</p>
									</td>
									<td
										class="tablet:table-cell hidden w-[25rem] max-w-[25rem] space-y-2 py-5">
										<template
											v-if="v.comment && v.comment.length > 0"
											v-for="c in v.comment">
											<p
												class="inline-flex w-full flex-col space-y-1 space-x-2 rounded-md bg-blue-100 p-2">
												<span class="font-semibold text-gray-700">{{
													c.username
												}}</span
												><span class="text-xs text-wrap text-gray-500"
													>{{ c.comment }}
												</span>
											</p>
											<br />
										</template>
										<div
											v-else
											class="flex items-center rounded-md bg-yellow-100 p-2">
											<span class="text-xs text-gray-500"
												>No comments for this device!</span
											>
										</div>
									</td>
									<td class="tablet:table-cell hidden py-5 ps-3">
										<button
											class="rounded-md border-[1px] border-green-500 bg-green-100 px-2 py-1 text-green-500"
											:data-modal-target="`add-comment-tbl-${idx}`"
											:data-modal-toggle="`add-comment-tbl-${idx}`">
											Add Comment
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
		<!-- end of general vehicle data -->

		<!-- ending analysis -->
		<div class="grid h-[14rem] grid-cols-2 gap-10">
			<div class="h-full rounded-lg border bg-white p-5 shadow-sm outline-none">
				<h1 class="font-semibold text-gray-700">Vehicle Status Distribution</h1>
				<!-- online vehicles -->
				<div class="mt-5 space-y-2">
					<div class="flex items-center justify-between">
						<h1 class="inline-flex items-center space-x-2">
							<div class="size-3 rounded-full bg-green-500"></div>
							<span class="text-sm font-semibold text-gray-700">Online</span>
						</h1>
						<h2 class="inline-flex items-center space-x-2">
							<span class="text-sm font-semibold text-green-500">{{
								computedStatistics.total_online
							}}</span>
							<span class="text-sm text-gray-500"
								>({{ computedStatistics.dist.online_dist }}%)</span
							>
						</h2>
					</div>
					<div class="h-2.5 w-full rounded-full bg-gray-200">
						<div
							class="h-2.5 rounded-full bg-green-500"
							v-bind:style="{
								width: `${computedStatistics.dist.online_dist}%`,
							}"></div>
					</div>
				</div>
				<!-- offline vehicles  -->
				<div class="mt-8 space-y-2">
					<div class="flex items-center justify-between">
						<h1 class="inline-flex items-center space-x-2">
							<div class="size-3 rounded-full bg-red-500"></div>
							<span class="text-sm font-semibold text-gray-700">Offline</span>
						</h1>
						<h2 class="inline-flex items-center space-x-2">
							<span class="text-sm font-semibold text-red-500">{{
								computedStatistics.total_offline
							}}</span>
							<span class="text-sm text-gray-500"
								>({{ computedStatistics.dist.offline_dist }}%)</span
							>
						</h2>
					</div>
					<div class="h-2.5 w-full rounded-full bg-gray-200">
						<div
							class="h-2.5 rounded-full bg-red-500"
							v-bind:style="{
								width: `${computedStatistics.dist.offline_dist}%`,
							}"></div>
					</div>
				</div>
			</div>

			<!-- stats -->
			<div class="h-full rounded-lg border bg-white p-5 shadow-sm outline-none">
				<h1 class="font-semibold text-gray-700">Crticial Alerts</h1>
				<!-- critical alerts -->
				<div
					class="mt-5 flex h-20 items-center justify-between rounded-lg border border-red-200 bg-red-100 px-5 outline-none">
					<div class="flex h-full items-center space-x-2">
						<span
							class="icon-[material-symbols-light--warning-outline] text-4xl text-red-500"></span>
						<div>
							<h1 class="font-semibold text-red-800">Watchlist Vehicles</h1>
							<h2 class="text-sm text-red-800">
								These vehicles are offline with uncooperative clients.
							</h2>
						</div>
					</div>
					<h1 class="font-semibold text-red-800">
						{{ computedStatistics.total_on_watchlist }}
					</h1>
				</div>

				<!-- emergency vehicles -->
				<div
					class="mt-5 flex h-20 items-center justify-between rounded-lg border border-purple-200 bg-purple-100 px-5 outline-none">
					<div class="flex h-full items-center space-x-2">
						<span
							class="icon-[material-symbols-light--nest-clock-farsight-analog] text-4xl text-purple-500"></span>
						<div>
							<h1 class="font-semibold text-purple-800">Expiring Subscriptions</h1>
							<h2 class="text-sm text-purple-800">Renewal required within 30 days</h2>
						</div>
					</div>
					<h1 class="font-semibold text-purple-800">
						{{ computedStatistics.expires_soon }}
					</h1>
				</div>
			</div>
		</div>

		<!-- modal to add comment for table entry -->
		<ParentModal
			v-if="!fetchingClientVehicles && computedVehicles && computedVehicles.length > 0"
			v-for="(v, idx) in computedVehicles"
			:key="idx"
			modal-title="Add Your Comment "
			:modal-id="`add-comment-tbl-${idx}`"
			modal-size="large"
			:modal-subtitle="`Vehicle ${v.name} - ${v.driver_data?.name ?? 'Name N/A'}`">
			<AddTraceabilityReportComment
				:id="v.id"
				:reg-no="v.name"
				:client-phone="v.driver_data?.name ?? 'Name N/A'"
				:client-name="v.driver_data?.phone ?? 'Phone N/A'"
				:device-status="v.online"
				:comments="v.comment" />
		</ParentModal>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'regent-tracking-traceability-report',
		layout: 'console-layout',
	});

	const {
		page,
		searchString,
		computedVehicles,
		fetchingClientVehicles,
		totalPages,
		computedStatistics,
		onlyOnWatchlist,
		loadingReportExport,
		reportToExcel,
	} = useDeviceTraceabilityReport();
</script>
