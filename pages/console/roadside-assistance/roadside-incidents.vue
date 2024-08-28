<template>
	<div class="flex h-full flex-col">
		<!-- top information column -->
		<div class="flex h-[6rem] items-center justify-between rounded-t-lg border p-4">
			<div class="flex w-full items-center space-x-3 md:w-fit">
				<img
					class="h-12 min-h-12 w-12 min-w-12 rounded-full"
					:src="profilePicture"
					alt="Rounded avatar" />
				<div class="h-full flex-col overflow-hidden">
					<h1 class="inline-flex items-center space-x-3">
						<span class="font-semibold text-blue-600"
							>Hi, {{ getPrincipal.username }}</span
						>
						<HandshakeIcon />
					</h1>
					<h2>Welcome to Your Roadside Assistance Dashboard.</h2>
				</div>
			</div>
			<div class="hidden space-x-3 md:flex md:items-center">
				<NuxtLink
					:to="{ name: 'ra-all-incidents' }"
					class="text-blue-600 underline underline-offset-2 hover:text-blue-700">
					All Incidents
				</NuxtLink>
				<NuxtLink
					:to="{ name: 'ava-membership-types' }"
					class="generic-nuxt-link">
					Onboard Member
				</NuxtLink>
			</div>
		</div>

		<!-- statistics strip -->
		<div class="flex h-[7rem] overflow-x-auto rounded-b-lg border border-t-0 p-3 shadow-sm">
			<div
				class="flex min-w-64 items-start justify-start space-x-3 whitespace-nowrap text-gray-500 md:w-1/3 md:justify-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="1em"
					height="1em"
					viewBox="0 0 24 24"
					class="size-7">
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
				class="flex min-w-64 items-start justify-start space-x-3 whitespace-nowrap text-gray-500 md:w-1/3 md:justify-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="1em"
					height="1em"
					viewBox="0 0 24 24"
					class="size-7">
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
					<h1 class="font-semibold">Incidents On Map</h1>
					<h2>{{ totalIncidents + ' Total Incidents' }}</h2>
					<NuxtLink
						:to="{ name: 'ra-visual-informer' }"
						class="text-blue-600 hover:text-blue-700">
						View Map
					</NuxtLink>
				</div>
			</div>
			<div
				class="flex min-w-64 items-start justify-start space-x-3 whitespace-nowrap text-gray-500 md:w-1/3 md:justify-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="1em"
					height="1em"
					viewBox="0 0 24 24"
					class="size-7">
					<path
						fill="currentColor"
						d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z" />
				</svg>
				<div>
					<h1 class="font-semibold">Completed Requests</h1>
					<h2>{{ getTotalCompleted }}</h2>
					<NuxtLink
						:to="{ name: 'ra-all-incidents' }"
						class="text-blue-600 hover:text-blue-700">
						View Completed
					</NuxtLink>
				</div>
			</div>
		</div>

		<!-- Side information -->
		<div class="mt-4 grid flex-grow grid-cols-1 gap-4 lg:grid-cols-[.8fr,.2fr]">
			<!-- members listing -->
			<div>
				<!-- div to show when there are no members -->
				<!-- <div
					class="flex h-full flex-col items-center justify-center rounded-lg border shadow-sm space-y-4">
					<BirdieNotFoundIcon />
					<h1 class="font-semibold text-gray-500">Oops! Seems like you have no members!</h1>
					<NuxtLink
						:to="{ name: 'ava-membership-types' }"
						class="generic-nuxt-link">
						Onboard AVA Member
					</NuxtLink>
				</div> -->

				<!-- div to show when there are members -->
				<div class="flex h-full flex-col justify-between">
					<!-- search & filter controls -->
					<!-- <div class="flex h-fit items-center justify-between">
						<form class="relative h-fit w-full md:w-[45%] lg:w-[30%]">
							<input
								type="text"
								class="generic-input"
								placeholder="Search Name, Email or Phone" />
							<button
								type="submit"
								class="absolute right-0 top-0 flex size-14 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700">
								<SearchIcon />
							</button>
						</form>
					</div> -->

					<!-- the table itself -->
					<div class="mb-4 flex-grow">
						<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
							<table class="w-full text-left text-gray-500">
								<thead class="bg-gray-100 text-sm uppercase text-gray-700">
									<tr>
										<th
											scope="col"
											class="table-headers">
											Vehicle
										</th>
										<th
											scope="col"
											class="table-headers">
											Date & Time
										</th>
										<th
											scope="col"
											class="table-headers">
											Client Phone
										</th>
										<th
											scope="col"
											class="table-headers">
											Type
										</th>
										<th
											scope="col"
											class="table-headers">
											Status
										</th>
										<th
											scope="col"
											class="table-headers max-w-48">
											Incident Location
										</th>
										<th
											scope="col"
											class="table-headers" />
									</tr>
								</thead>
								<tbody>
									<tr
										class="border-b bg-white hover:bg-gray-100"
										v-for="(incident, index) in incidentsListSlice"
										:key="index">
										<td
											scope="row"
											class="whitespace-nowrap p-6 font-semibold text-gray-600">
											{{ incident.registration_no }}
										</td>
										<td class="p-6">
											{{
												formatServerProvidedDateTime(incident.date_created)
											}}
										</td>
										<td class="p-6 font-semibold text-pink-600">
											{{ incident.user_phone }}
										</td>
										<td class="p-6 font-semibold text-blue-600">
											{{ screenFormatRAServiceName(incident.service) }}
										</td>
										<td class="p-6">{{ incident.service_status }}</td>
										<td
											class="max-w-48 overflow-hidden text-ellipsis py-6 text-blue-600">
											{{ incident.pickup_location }}
										</td>
										<td class="flex items-center justify-end p-6">
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
													class="py-2 text-gray-500"
													aria-labelledby="dropdownLeftButton">
													<li>
														<NuxtLink
															class="block w-full px-4 py-2 text-center hover:bg-gray-100"
															type="button">
															View Report
														</NuxtLink>
													</li>
												</ul>
											</div>
										</td>
									</tr>

									<!-- loading state -->
									<tr
										class="border-b bg-white hover:bg-gray-100"
										v-if="fetchRoadsideIncidentsStatus === 'pending'"
										v-for="a in 10">
										<td
											scope="row"
											class="whitespace-nowrap p-6 text-gray-300">
											<span class="animate-pulse rounded-lg bg-gray-300"
												>demoreg</span
											>
										</td>
										<td class="p-6 text-gray-300">
											<span class="animate-pulse rounded-lg bg-gray-300"
												>demodatetime</span
											>
										</td>
										<td class="p-6 text-gray-300">
											<span class="animate-pulse rounded-lg bg-gray-300"
												>demophone</span
											>
										</td>
										<td class="p-6 text-gray-300">
											<span class="animate-pulse rounded-lg bg-gray-300"
												>demoservice</span
											>
										</td>
										<td class="p-6 text-gray-300">
											<span class="animate-pulse rounded-lg bg-gray-300"
												>demostatus</span
											>
										</td>
										<td class="max-w-48 py-6 text-gray-300">
											<span class="animate-pulse rounded-lg bg-gray-300"
												>demolocation</span
											>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<!-- page controls -->
					<div class="flex h-12 items-center justify-between">
						<h1 class="text-sm font-semibold text-gray-500 md:text-base">
							Showing {{ currentPage + 1 }} of Y pages.
						</h1>
						<div class="h-full space-x-2 md:space-x-4">
							<button
								class="table-page-buttons"
								@click="currentPage -= 1">
								Previous
							</button>
							<button
								class="table-page-buttons"
								@click="currentPage += 1">
								Next
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- side-information including chart -->
			<div
				class="xl:grid-cols-0 grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2 xl:flex xl:flex-col xl:gap-x-0">
				<div
					class="xl:max-h-1/2 flex h-[25rem] flex-col rounded-md border shadow-sm xl:h-1/2">
					<div class="flex h-14 items-center justify-between px-3">
						<h1 class="text-2xl font-extrabold">Distribution</h1>
						<div>
							<!-- <Doughnut id="incidents-distribution" /> -->
						</div>
					</div>
				</div>
				<div
					class="xl:max-h-1/2 flex h-[25rem] flex-col rounded-md border shadow-sm xl:h-1/2">
					<h1>Hello world again</h1>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { Doughnut } from 'vue-chartjs';
	definePageMeta({
		name: 'ra-all-incidents',
		layout: 'console-layout',
	});

	const { getPrincipal } = useAuth();
	const profilePicture: Ref<string> = ref('');
	const {
		fetchRAIncidentsAnalyticsStatus,
		fetchRAIncidentsAnalyticsError,
		computedAnalytics,
		computedMostRequested,
		getRAAnalytics,
		getTotalCompleted,
	} = useRAIncidentsAnalytics();
	const { fetchRoadsideIncidentsStatus, incidentsListSlice, currentPage, totalIncidents } =
		useRoadsideIncidents();

	onMounted(() => (profilePicture.value = getPrincipal.value.profilePicture));
</script>
