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
			<div class="flex items-center space-x-4">
				<button
					class="inline-flex h-12 w-40 items-center justify-center space-x-1 rounded-md bg-green-500 text-sm text-slate-100 transition-colors duration-200 ease-in-out outline-none hover:bg-green-600">
					<span class="icon-[material-symbols-light--download-rounded] text-2xl"></span>
					<span>Export Excel</span></button
				><button
					class="inline-flex h-12 w-40 items-center justify-center space-x-1 rounded-md bg-red-500 text-sm text-slate-100 transition-colors duration-200 ease-in-out outline-none hover:bg-red-600">
					<span
						class="icon-[material-symbols-light--table-convert-outline] text-2xl"></span>
					<span>Export PDF</span>
				</button>
			</div>
		</div>

		<!-- the stats -->
		<div class="grid h-28 grid-cols-6 gap-5">
			<div
				class="flex h-full items-center justify-center rounded-lg border bg-white p-5 shadow-xs outline-none">
				<div class="flex-grow">
					<h2 class="text-sm text-gray-500">Total Vehicles</h2>
					<h1 class="text-lg font-semibold text-gray-700">1200</h1>
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
					<h1 class="text-lg font-semibold text-gray-700">1190</h1>
					<h3 class="inline-flex items-center space-x-1 text-sm">
						<span class="font-bold text-green-500">99.17%</span
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
					<h1 class="text-lg font-semibold text-gray-700">1190</h1>
					<h3 class="inline-flex items-center space-x-1 text-sm">
						<span class="font-bold text-red-500">99.17%</span
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
					<h2 class="text-sm text-gray-500">Watchlist</h2>
					<h1 class="text-lg font-semibold text-gray-700">1190</h1>
					<h3 class="inline-flex items-center space-x-1 text-sm text-red-500">
						Requires Attention
					</h3>
				</div>
				<button
					class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-red-300 bg-red-100">
					<span
						class="icon-[material-symbols-light--warning-rounded] text-3xl text-red-600"></span>
				</button>
			</div>
			<div
				class="flex h-full items-center justify-center rounded-lg border bg-white p-5 shadow-xs outline-none">
				<div class="flex-grow">
					<h2 class="text-sm text-gray-500">Installations</h2>
					<h1 class="text-lg font-semibold text-gray-700">1190</h1>
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
					<h1 class="text-lg font-semibold text-gray-700">125</h1>
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
					<h2 class="text-sm text-gray-500">1200 Vehicles Found</h2>
				</div>
			</div>
			<div class>
				<form class="flex w-full items-center justify-between p-5">
					<input
						type="text"
						name="search-tracked-device"
						id="search-tracked-device"
						placeholder="Search by registration, client name or client number."
						class="h-14 w-1/3 rounded-md ps-10 text-sm text-gray-700 outline-none placeholder:text-gray-500" />
				</form>

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
										Reg No
									</th>
									<th
										scope="col"
										class="table-headers">
										Client Details
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
								<!-- <tr
									class="border-b bg-white hover:bg-gray-100"
									v-for="a in 10"
									:key="a">
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
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>bookingstage</span
										>
									</td>
									<td></td>
								</tr> -->

								<!-- the actual data -->
								<tr
									class="border-b bg-white text-sm hover:bg-gray-100"
									v-for="a in 10"
									:key="a">
									<td
										class="tablet:table-cell hidden py-5 ps-3 font-bold text-gray-700">
										KDC 000A
									</td>
									<td class="tablet:table-cell py-5">
										<p class="inline-flex w-fit items-center space-x-1">
											<span
												class="icon-[material-symbols-light--person-2-rounded] text-xl"></span>
											<span class="text-gray-700">Jane Kasele Wangari</span>
										</p>
										<br />
										<p class="inline-flex w-fit items-center space-x-1">
											<span
												class="icon-[material-symbols-light--settings-phone-sharp] text-xl"></span>
											<span>07002000000</span>
										</p>
									</td>
									<td class="tablet:table-cell py-5">
										<p class="inline-flex w-fit space-x-2">
											<span class="font-semibold text-gray-700"
												>Installed:</span
											>
											<span>02-20-2023</span>
										</p>
										<br />
										<p class="inline-flex w-fit space-x-2">
											<span class="font-semibold text-gray-700"
												>Expires:
											</span>
											<span>10-14-2025</span>
										</p>
									</td>
									<td class="tablet:table-cell hidden py-5">
										<p class="inline-flex items-center space-x-2">
											<span
												class="icon-[material-symbols-light--nest-clock-farsight-analog-outline] text-xl"></span>
											<span>18-08-2025</span>
										</p>
									</td>
									<td class="tablet:table-cell hidden py-5">
										<p class="inline-flex items-center space-x-2">
											<span
												class="icon-[material-symbols-light--android-wifi-4-bar-off] text-xl text-red-600"></span>
											<span
												class="rounded-full border-[1px] border-red-500 bg-red-200 px-2 py-1 text-sm text-red-500"
												>offline</span
											>
										</p>
									</td>
									<td
										class="tablet:table-cell hidden w-[30rem] max-w-[30rem] py-5">
										<p
											class="inline-flex flex-col space-y-1 space-x-2 rounded-md bg-blue-100 p-2">
											<span class="font-semibold text-gray-700"
												>Account Manager</span
											><span class="text-xs text-wrap text-gray-500"
												>Lorem ipsum dolor sit amet consectetur adipisicing
												elit. Repellendus nihil odit laborum corrupti?
											</span>
										</p>
									</td>
									<td class="tablet:table-cell hidden py-5 ps-3">
										<button
											class="rounded-md border-[1px] border-green-500 bg-green-100 px-2 py-1 text-green-500">
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
						Showing {{ 1 }} of {{ 100 }} pages.
					</h1>
					<div
						class="tablet:w-fit tablet:block flex h-full w-full justify-center space-x-2 md:space-x-4">
						<button class="table-page-buttons">Previous</button>
						<button class="table-page-buttons">Next</button>
					</div>
				</div>
			</div>
		</div>
		<!-- end of general vehicle data -->

		<!-- watchlist vehicles -->
		<div
			class="divide-y-[2px] overflow-clip rounded-lg border border-gray-200 bg-white shadow-sm outline-none">
			<div class="flex h-28 items-center justify-between bg-red-50 p-5 text-sm">
				<div class="flex h-full items-center space-x-3">
					<button
						class="inline-flex h-[90%] w-16 items-center justify-center rounded-lg bg-red-500 outline-none">
						<span
							class="icon-[material-symbols-light--shield-outline] text-4xl text-slate-100"></span>
					</button>
					<div>
						<h1 class="text-xl font-semibold text-gray-700">Critical Watchlist</h1>
						<h2 class="text-sm text-gray-500">
							These vehicles are offline with uncooperative clients. Immediate bank
							intervention may be required.
						</h2>
					</div>
				</div>
				<h2 class="text-sm text-red-600">10 vehicles requiring attention</h2>
			</div>
			<div class="bg-red-50">
				<form class="flex h-fit w-full items-center justify-between p-5">
					<input
						type="text"
						name="search-tracked-device"
						id="search-tracked-device"
						placeholder="Search by registration, client name or client number."
						class="h-14 w-1/3 rounded-md ps-10 text-sm text-gray-700 outline-none placeholder:text-gray-500" />
				</form>

				<!-- table -->
				<div class="flex-grow">
					<div class="relative overflow-x-auto">
						<table class="w-full text-left text-gray-500">
							<thead class="bg-red-200 text-sm text-red-700 uppercase">
								<tr>
									<!-- Details will show client name and their contact -->

									<th
										scope="col"
										class="table-headers tablet:table-cell hidden ps-3">
										Reg No
									</th>
									<th
										scope="col"
										class="table-headers">
										Client Details
									</th>
									<th
										scope="col"
										class="table-headers desktop-4k:table-cell hidden">
										Offline Duration
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
								<!-- <tr
									class="border-b bg-white hover:bg-gray-100"
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
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>bookingstage</span
										>
									</td>
									<td></td>
								</tr> -->

								<!-- the actual data -->
								<tr
									class="border-b bg-white text-sm hover:bg-gray-100"
									v-for="a in 10"
									:key="a">
									<td
										class="tablet:table-cell hidden py-5 ps-3 font-bold text-gray-700">
										KDC 000A
									</td>
									<td class="tablet:table-cell py-5">
										<p class="inline-flex w-fit items-center space-x-1">
											<span
												class="icon-[material-symbols-light--person-2-rounded] text-xl"></span>
											<span class="text-gray-700">Jane Kasele Wangari</span>
										</p>
										<br />
										<p class="inline-flex w-fit items-center space-x-1">
											<span
												class="icon-[material-symbols-light--settings-phone-sharp] text-xl"></span>
											<span>07002000000</span>
										</p>
									</td>
									<td class="tablet:table-cell py-5">
										<p class="inline-flex w-fit items-center space-x-2">
											<span
												class="icon-[material-symbols-light--android-wifi-4-bar-off] text-xl text-red-600"></span>
											<span class="font-semibold text-red-600"
												>5 days ago</span
											>
										</p>
										<br />
										<p class="inline-flex w-fit space-x-2">
											<span
												class="icon-[material-symbols-light--nest-clock-farsight-analog-outline] text-xl"></span>
											<span class="inline-flex items-center space-x-1">
												<span class="text-gray-700">Last Seen: </span
												><span> 03-01-2021</span>
											</span>
										</p>
									</td>
									<td class="tablet:table-cell hidden py-5">
										<p class="inline-flex items-center space-x-2">
											<span
												class="rounded-full border-[1px] border-red-500 bg-red-200 px-2 py-1 text-sm text-red-500"
												>offline</span
											>
										</p>
									</td>
									<td
										class="tablet:table-cell hidden w-[30rem] max-w-[30rem] py-5">
										<p
											class="inline-flex flex-col space-y-1 space-x-2 rounded-md bg-blue-100 p-2">
											<span class="font-semibold text-gray-700"
												>Account Manager</span
											><span class="text-xs text-wrap text-gray-500"
												>Lorem ipsum dolor sit amet consectetur adipisicing
												elit. Repellendus nihil odit laborum corrupti?
											</span>
										</p>
									</td>
									<td class="tablet:table-cell hidden py-5 ps-3">
										<div class="flex flex-col items-start space-y-1">
											<button
												class="w-[65%] rounded-md border-[1px] border-green-500 bg-green-100 px-2 py-1 text-center text-green-500">
												Add Comment
											</button>
											<button
												class="w-[65%] rounded-md border-[1px] border-gray-500 bg-gray-100 px-2 py-1 text-center text-gray-500">
												Remove from Watchlist
											</button>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<!-- page controls -->
				<div
					class="tablet:flex-row tablet:min-h-12 tablet:h-12 my-5 mt-5 flex h-16 min-h-16 flex-col items-center justify-between px-5">
					<h1 class="text-sm font-semibold text-gray-500">
						Showing {{ 1 }} of {{ 100 }} pages.
					</h1>
					<div
						class="tablet:w-fit tablet:block flex h-full w-full justify-center space-x-2 md:space-x-4">
						<button class="table-page-buttons">Previous</button>
						<button class="table-page-buttons">Next</button>
					</div>
				</div>
			</div>
		</div>
		<!-- end of watchlist vehicles -->

		<!-- ending analysis -->
		<div class="grid h-[16rem] grid-cols-2 gap-10">
			<div class="h-full rounded-lg border p-5 shadow-sm outline-none">
				<h1 class="font-semibold text-gray-700">Vehicle Status Distribution</h1>
				<!-- online vehicles -->
				<div class="mt-5 space-y-2">
					<div class="flex items-center justify-between">
						<h1 class="inline-flex items-center space-x-2">
							<div class="size-3 rounded-full bg-green-500"></div>
							<span class="text-sm font-semibold text-gray-700">Online</span>
						</h1>
						<h2 class="inline-flex items-center space-x-2">
							<span class="text-sm font-semibold text-green-500">1,190</span>
							<span class="text-sm text-gray-500">(99.17%)</span>
						</h2>
					</div>
					<div class="h-2.5 w-full rounded-full bg-gray-200">
						<div
							class="h-2.5 rounded-full bg-green-500"
							style="width: 45%"></div>
					</div>
				</div>
				<!-- offline vehicles  -->
				<div class="mt-8 space-y-2">
					<div class="flex items-center justify-between">
						<h1 class="inline-flex items-center space-x-2">
							<div class="size-3 rounded-full bg-red-500"></div>
							<span class="text-sm font-semibold text-gray-700">Online</span>
						</h1>
						<h2 class="inline-flex items-center space-x-2">
							<span class="text-sm font-semibold text-red-500">1,190</span>
							<span class="text-sm text-gray-500">(99.17%)</span>
						</h2>
					</div>
					<div class="h-2.5 w-full rounded-full bg-gray-200">
						<div
							class="h-2.5 rounded-full bg-red-500"
							style="width: 45%"></div>
					</div>
				</div>
			</div>
			<div class="h-full rounded-lg border p-5 shadow-sm outline-none">
				<h1 class="font-semibold text-gray-700">Crticial Alerts</h1>
				<!-- critical alerts -->
				<div
					class="mt-5 flex h-20 items-center justify-between rounded-lg border border-red-200 bg-red-100 px-5 outline-none">
					<div class="flex h-full items-center space-x-2">
						<span
							class="icon-[material-symbols-light--warning-outline] text-5xl text-red-500"></span>
						<div>
							<h1 class="text-lg font-semibold text-red-800">Traceability Report</h1>
							<h2 class="text-sm text-red-800">
								Real-time Vehicle Status and Monitoring
							</h2>
						</div>
					</div>
					<h1 class="text-xl font-semibold text-red-800">4</h1>
				</div>

				<!-- emergency vehicles -->
				<div
					class="mt-5 flex h-20 items-center justify-between rounded-lg border border-purple-200 bg-purple-100 px-5 outline-none">
					<div class="flex h-full items-center space-x-2">
						<span
							class="icon-[material-symbols-light--nest-clock-farsight-analog] text-5xl text-purple-500"></span>
						<div>
							<h1 class="text-lg font-semibold text-purple-800">
								Traceability Report
							</h1>
							<h2 class="text-sm text-purple-800">
								Real-time Vehicle Status and Monitoring
							</h2>
						</div>
					</div>
					<h1 class="text-xl font-semibold text-purple-800">4</h1>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'regent-tracking-traceability-report',
		layout: 'console-layout',
	});

	const {
		searchRegNo,
		fetchTrackingCertificatesStatus,
		size,
		currentPage,
		trackingCertificates,
		totalPages,
		downloadReports,
		executeFetchTrackingCertificates,
		exportToExcel,
	} = useTrackingTraceabilityReports();
</script>
