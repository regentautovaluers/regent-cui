<template>
	<div class="console-layout-spacing flex flex-1 flex-col">
		<!-- top information column -->
		<div
			class="flex h-28 items-center justify-between rounded-t-lg border bg-white p-4 shadow-sm">
			<div class="flex w-full items-center space-x-3 md:w-fit">
				<UserAvatar />
				<div class="mobile-lg:text-sm h-full flex-col overflow-hidden text-xs">
					<h1 class="inline-flex items-center space-x-3">
						<span class="font-semibold text-blue-600"
							>Hi, {{ getPrincipal.username }}</span
						>
						<HandshakeIcon />
					</h1>
					<h2 class="text-gray-500">Welcome to Your Roadside Assistance Dashboard.</h2>
				</div>
			</div>
			<NuxtLink
				:to="{ name: 'ava-membership-types' }"
				class="generic-nuxt-link mobile-md:flex mobile-lg:text-sm hidden text-xs font-normal whitespace-nowrap uppercase">
				Onboard Member
			</NuxtLink>
		</div>

		<!-- statistics strip -->
		<div
			class="mobile-lg:grid-cols-2 laptop:grid-cols-4 mb-10 grid grid-cols-1 gap-4 rounded-b-lg border border-t-0 bg-white p-3 shadow-sm">
			<div
				class="mobile-lg:min-h-20 flex items-start justify-start space-x-3 p-2 text-sm text-gray-500">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="1em"
					height="1em"
					viewBox="0 0 24 24"
					class="size-6">
					<path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3c-1.072-2.143-.224-4.054 2-6c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5" />
				</svg>
				<div>
					<h1 class="font-semibold">Most Requested</h1>
					<h2>{{ computedMostRequested }}</h2>
				</div>
			</div>
			<div
				class="mobile-lg:min-h-20 flex items-start justify-start space-x-3 p-2 text-sm text-gray-500">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="1em"
					height="1em"
					viewBox="0 0 24 24"
					class="size-6">
					<g
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-miterlimit="10"
						stroke-width="1.5">
						<path
							d="M21.5 12h-2.111M12 2.5v2.111M2.5 12h2.111M12 21.5v-2.111m0 0A7.389 7.389 0 1 0 12 4.61a7.389 7.389 0 0 0 0 14.778Z" />
						<path d="M12 16.222a4.222 4.222 0 1 0 0-8.444a4.222 4.222 0 0 0 0 8.444Z" />
					</g>
				</svg>
				<div>
					<h1 class="font-semibold">Incident Hotspots</h1>
					<h2>{{ totalIncidents + ' Total Incidents' }}</h2>
					<!-- <NuxtLink
						:to="{ name: 'ra-visual-informer' }"
						class="text-blue-600 hover:text-blue-700">
						View Map
					</NuxtLink> -->
				</div>
			</div>
			<div
				class="mobile-lg:min-h-20 flex items-start justify-start space-x-3 p-2 text-sm text-gray-500">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="1em"
					height="1em"
					viewBox="0 0 32 32"
					class="size-6">
					<path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M16 8v8l4 4m9-4c0 7.18-5.82 13-13 13S3 23.18 3 16S8.82 3 16 3s13 5.82 13 13" />
				</svg>
				<div>
					<h1 class="font-semibold">Ongoing</h1>
					<h2>{{ ongoingIncidents + ' Requests' }}</h2>
				</div>
			</div>
			<div
				class="mobile-lg:min-h-20 flex items-start justify-start space-x-3 p-2 text-sm text-gray-500">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="1em"
					height="1em"
					viewBox="0 0 24 24"
					class="size-6">
					<path
						fill="currentColor"
						d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z" />
				</svg>
				<div>
					<h1 class="font-semibold">Completed</h1>
					<h2>{{ getTotalCompleted + ' Requests' }}</h2>
				</div>
			</div>
		</div>

		<!-- Requests quick links -->
		<div class="mobile-lg:grid-cols-2 laptop:grid-cols-4 mb-10 grid grid-cols-1 gap-4">
			<NuxtLink
				:to="{
					name: 'ra-fueldelivery-request',
					query: {
						client_lat: clientCoordinates.lat,
						client_lng: clientCoordinates.lng,
					},
				}"
				class="ava-services-quicklinks group bg-white">
				<FuelDeliveryServiceIcon
					color="#1c64f2"
					:classes="['size-8']" />
				<span>Fuel Delivery</span></NuxtLink
			>
			<NuxtLink
				:to="{
					name: 'ra-jumpstarting-request',
					query: {
						client_lat: clientCoordinates.lat,
						client_lng: clientCoordinates.lng,
					},
				}"
				class="ava-services-quicklinks bg-white">
				<JumpstartingServiceIcon
					color="#1c64f2"
					:classes="['size-8']" />
				<span>Jumpstarting</span></NuxtLink
			>
			<NuxtLink
				:to="{
					name: 'ra-tyrechange-request',
					query: {
						client_lat: clientCoordinates.lat,
						client_lng: clientCoordinates.lng,
					},
				}"
				class="ava-services-quicklinks bg-white">
				<TyrechangeServiceIcon
					color="#1c64f2"
					:classes="['size-8']" />
				<span>Tyrechange</span></NuxtLink
			>
			<NuxtLink
				:to="{
					name: 'ra-towing-request',
					query: {
						client_lat: clientCoordinates.lat,
						client_lng: clientCoordinates.lng,
					},
				}"
				class="ava-services-quicklinks bg-white">
				<TowingServiceIcon
					color="#1c64f2"
					:classes="['size-8']" />
				<span>Towing</span></NuxtLink
			>
		</div>

		<!-- div to show when there is an error -->
		<div
			v-if="fetchRoadsideIncidentsStatus === 'error'"
			class="flex h-full flex-1 flex-col items-center justify-center space-y-4 rounded-lg border bg-white text-sm shadow-sm">
			<BirdieNotFoundIcon />
			<h1 class="font-semibold text-gray-500">Oops! Fetch Failed!</h1>
			<button
				class="inline-flex items-center space-x-2 rounded-lg border bg-transparent px-2 py-1 text-gray-500 hover:text-gray-600"
				@click="refreshPage">
				<span>Refresh</span>
				<RefreshIcon classes="size-6" />
			</button>
		</div>

		<!-- div to show when there are no incidents -->
		<div
			v-else-if="
				fetchRoadsideIncidentsStatus === 'success' && incidentsListSlice.length === 0
			"
			class="flex h-full flex-1 flex-col items-center justify-center space-y-4 rounded-lg border bg-white text-sm shadow-sm">
			<BirdieNotFoundIcon />
			<h1 class="font-semibold text-gray-500">Oops! Seems like you have no incidents!</h1>
			<NuxtLink
				:to="{ name: 'ra-towing-request' }"
				class="generic-nuxt-link">
				Make Towing Request
			</NuxtLink>
		</div>

		<div
			v-else
			class="laptop:grid-cols-[20%_80%] grid flex-1 grid-cols-1 gap-y-4">
			<!-- side-information including chart -->
			<div class="tablet:flex-row tablet:space-x-5 laptop:flex-col flex flex-col space-y-5">
				<div
					class="tablet:h-full laptop:h-1/2 tablet:w-1/2 laptop:w-full flex h-[28rem] w-full flex-col rounded-md border bg-white px-5 shadow-sm">
					<h1 class="my-4 text-xl font-extrabold">Distribution</h1>
					<div
						class="flex h-full items-center justify-center"
						v-if="
							fetchRAIncidentsAnalyticsStatus === 'pending' &&
							!raIncidentsDoughnutData.data.length
						">
						<FormSubmissionLoader class="size-10 animate-spin text-gray-300" />
					</div>
					<div
						class="flex h-full flex-col items-center justify-center"
						v-else-if="
							fetchRAIncidentsAnalyticsStatus === 'success' &&
							!raIncidentsDoughnutData.data.length
						">
						<BirdieNotFoundIcon />
						<h1 class="mb-1 font-semibold text-gray-500">No Data!</h1>
					</div>
					<div
						class="flex h-full flex-col items-center justify-center"
						v-else-if="fetchRAIncidentsAnalyticsStatus === 'error'">
						<BirdieNotFoundIcon />
						<h1 class="mb-1 font-semibold text-gray-500">Oops! Fetch Failed!</h1>
						<button
							class="inline-flex items-center space-x-2 rounded-lg border bg-transparent px-2 py-1 text-gray-500 hover:text-gray-600"
							@click="refreshPage">
							<span>Refresh</span>
							<RefreshIcon classes="size-6" />
						</button>
					</div>

					<IncidentsDoughnutChart
						v-else
						:labels="raIncidentsDoughnutData.legends"
						:colors="raIncidentsDoughnutData.colors"
						:data="raIncidentsDoughnutData.data"
						:total="totalIncidents" />
				</div>
				<div
					class="tablet:h-full laptop:h-1/2 tablet:w-1/2 laptop:w-full flex h-[28rem] w-full flex-col rounded-md border bg-white px-5 shadow-sm">
					<h1 class="my-4 text-xl font-extrabold">Top Recent Incidents</h1>
					<div
						class="flex h-full items-center justify-center"
						v-if="
							fetchRAIncidentsAnalyticsStatus === 'pending' &&
							!raIncidentsDoughnutData.data.length
						">
						<FormSubmissionLoader class="size-10 animate-spin text-gray-300" />
					</div>
					<div
						class="flex h-full flex-col items-center justify-center"
						v-else-if="
							fetchRAIncidentsAnalyticsStatus === 'success' &&
							!raIncidentsDoughnutData.data.length
						">
						<BirdieNotFoundIcon />
						<h1 class="mb-1 font-semibold text-gray-500">No Data!</h1>
					</div>
					<div
						class="h-full"
						v-else>
						<div
							class="mb-2 flex h-[5.2rem] items-center justify-between py-3"
							v-for="(incident, index) in topRecentPerService"
							:key="index">
							<div>
								<h1 class="text-sm font-bold text-gray-600">
									{{ incident.registration_no }}
								</h1>
								<h2 class="text-xs font-semibold text-gray-400">
									{{ formatServerProvidedDateTime(incident.date_created) }}
								</h2>
							</div>
							<div>
								<h1 class="text-sm font-bold text-gray-600">
									{{ screenFormatRAServiceName(incident.service) }}
								</h1>
							</div>
							<div>
								<button
									id="recentsDropdownLeftButton"
									data-dropdown-toggle="recentsDropdownLeft"
									data-dropdown-placement="left"
									type="button">
									<MenuKebabIcon />
								</button>
								<!-- Dropdown menu -->
								<div
									id="recentsDropdownLeft"
									class="z-10 hidden w-40 divide-y divide-gray-100 rounded-lg border bg-white shadow-md">
									<ul
										class="py-2 text-sm text-gray-500"
										aria-labelledby="recentsDropdownLeftButton">
										<li
											v-if="
												['on-going', 'pending', 'cancelled'].includes(
													incident.service_status,
												)
											">
											<span
												class="block w-full px-4 py-2 text-center hover:bg-gray-100">
												Report N/A
											</span>
										</li>
										<li
											v-if="
												incident.service === 'towing' &&
												incident.service_status === 'completed'
											">
											<NuxtLink
												:to="{
													name: 'ra-expanded-report',
													params: {
														service_type: incident.service,
														id: incident.id,
													},
												}"
												class="block w-full px-4 py-2 text-center hover:bg-gray-100"
												type="button">
												View Report
											</NuxtLink>
										</li>
										<li
											v-if="
												incident.service !== 'towing' &&
												incident.service_status === 'completed'
											">
											<NuxtLink
												:to="{
													name: 'ra-minimized-report',
													params: {
														service_type: incident.service,
														id: incident.id,
													},
												}"
												class="block w-full px-4 py-2 text-center hover:bg-gray-100"
												type="button">
												View Report
											</NuxtLink>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="laptop:ml-10 ml-0 flex h-full laptop:min-h-[55rem] flex-col justify-between">
				<!-- the table itself -->
				<div class="my-4 flex-grow">
					<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
						<table class="w-full text-left text-gray-500">
							<thead class="bg-gray-100 text-sm text-gray-700 uppercase">
								<tr>
									<th
										scope="col"
										class="table-headers ps-3">
										Vehicle
									</th>
									<th
										scope="col"
										class="table-headers">
										Incident
									</th>
									<th
										scope="col"
										class="table-headers tablet:table-cell hidden">
										Client Phone
									</th>
									<th
										scope="col"
										class="table-headers mobile-lg:table-cell hidden">
										Status
									</th>
									<th
										scope="col"
										class="table-headers laptop-lg:table-cell hidden">
										Location
									</th>
									<th
										scope="col"
										class="table-headers"></th>
								</tr>
							</thead>
							<tbody>
								<!-- loading state -->
								<tr
									class="border-b bg-white hover:bg-gray-100"
									v-if="fetchRoadsideIncidentsStatus === 'pending'"
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
											>useremail</span
										>
									</td>
									<td class="tablet:table-cell hidden p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>useremail</span
										>
									</td>
									<td class="mobile-lg:table-cell hidden p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>useremail</span
										>
									</td>
									<td class="laptop-lg:table-cell hidden p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>useremail</span
										>
									</td>
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>usermail</span
										>
									</td>
								</tr>
								<tr
									class="border-b bg-white text-sm hover:bg-gray-100"
									v-else
									v-for="(incident, index) in incidentsListSlice"
									:key="index">
									<td
										scope="row"
										class="py-4 ps-3 font-semibold whitespace-nowrap text-gray-600">
										{{ incident.registration_no }}
									</td>
									<td class="py-4">
										<span>{{
											screenFormatRAServiceName(incident.service)
										}}</span
										><br /><span>{{
											incident.date_created.split('T')[0]
										}}</span>
									</td>
									<td
										class="tablet:table-cell hidden py-4 font-semibold text-pink-600">
										{{ incident.user_phone }}
									</td>
									<td class="mobile-lg:table-cell hidden py-4">
										{{ incident.service_status }}
									</td>
									<td
										class="laptop-lg:table-cell hidden max-w-48 overflow-hidden py-6 text-ellipsis text-blue-600">
										{{ incident.pickup_location }}
									</td>
									<td class="py-4 pr-2">
										<button
											:id="'dropdownLeftButton' + index"
											:data-dropdown-toggle="'dropdownLeft' + index"
											data-dropdown-placement="left"
											type="button">
											<MenuKebabIcon />
										</button>
										<!-- Dropdown menu -->
										<div
											:id="'dropdownLeft' + index"
											class="z-10 hidden w-44 divide-y divide-gray-100 rounded-lg border bg-white shadow-md">
											<ul
												class="py-2 text-gray-500"
												aria-labelledby="dropdownLeftButton">
												<li
													v-if="
														[
															'on-going',
															'pending',
															'cancelled',
														].includes(incident.service_status)
													">
													<span
														class="block w-full px-4 py-2 text-center hover:bg-gray-100">
														Report N/A
													</span>
												</li>
												<li
													v-if="
														incident.service === 'towing' &&
														incident.service_status === 'completed'
													">
													<NuxtLink
														:to="{
															name: 'ra-expanded-report',
															params: {
																service_type: incident.service,
																id: incident.id,
															},
														}"
														class="block w-full px-4 py-2 text-center hover:bg-gray-100"
														type="button">
														View Report
													</NuxtLink>
												</li>
												<li
													v-if="
														incident.service !== 'towing' &&
														incident.service_status === 'completed'
													">
													<NuxtLink
														:to="{
															name: 'ra-minimized-report',
															params: {
																service_type: incident.service,
																id: incident.id,
															},
														}"
														class="block w-full px-4 py-2 text-center hover:bg-gray-100"
														type="button">
														View Report
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

		<!-- div to show when there are incidents -->
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'ra-all-incidents',
		layout: 'console-layout',
	});

	const { getPrincipal } = useAuth();
	const { clientCoordinates } = useClientGeolocation();
	const {
		fetchRAIncidentsAnalyticsStatus,
		computedMostRequested,
		getTotalCompleted,
		raIncidentsDoughnutData,
	} = useRACharts();
	const {
		fetchRoadsideIncidentsStatus,
		incidentsListSlice,
		currentPage: page,
		totalPages,
		totalIncidents,
		ongoingIncidents,
		topRecentPerService,
	} = useRoadsideIncidents();
</script>
