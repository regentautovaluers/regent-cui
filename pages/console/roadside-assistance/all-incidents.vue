<template>
	<div class="responsive-view h-full py-10">
		<!-- top card with link to add new member -->
		<div
			class="mb-6 flex flex-col items-center justify-between space-y-2 rounded-xl border-2 border-gray-200 px-3 py-5 shadow-sm md:flex-row md:space-y-0 md:px-6">
			<div class="flex w-full items-center space-x-2 md:w-fit">
				<img
					class="size-[60px] rounded-full object-cover"
					:src="profilePicture"
					alt="User Image" />
				<div class="flex flex-col">
					<span class="inline-flex items-center font-semibold text-blue-600"
						>Hi, {{ getPrincipal.username }}
						<img
							src="/icons/misc/hand-wave.svg"
							alt="Hand Wave Icon"
							class="ml-1"
					/></span>
					<span>Welcome to Your Roadside Incidents Dashboard</span>
				</div>
			</div>
			<div class="space-x-6">
				<NuxtLink
					:to="{ name: 'memberships-home' }"
					class="font-semibold text-blue-600 underline underline-offset-2"
					>View All Members</NuxtLink
				>
				<NuxtLink
					:to="{ name: 'new-member' }"
					class="w-full rounded-xl bg-blue-600 p-4 text-center text-sm font-semibold text-white md:w-fit"
					>ADD A NEW MEMBER</NuxtLink
				>
			</div>
		</div>
		<div
			class="mb-6 flex items-center justify-around whitespace-nowrap rounded-xl border-2 border-gray-200 px-6 py-5 shadow-sm">
			<div
				v-for="(info, index) in subLinksInfo"
				:key="index"
				class="flex items-start space-x-2">
				<div>
					<img
						:src="info.icon"
						alt="Sublink Icon"
						class="size-7" />
				</div>
				<div class="flex flex-col space-y-2">
					<span class="font-semibold text-gray-600">{{ info.title }}</span>
					<span class="font-semibold text-gray-500">{{ info.infoText }}</span>
					<NuxtLink
						class="font-semibold text-blue-600"
						:to="{ name: info.link }">
						{{ info.linkText }}
					</NuxtLink>
				</div>
			</div>
		</div>

		<div class="mt-6 flex flex-col md:flex-row md:space-x-6">
			<div class="md:w-[80%]">
				<!-- search & filter controls -->
				<div class="mb-6 flex flex-nowrap items-center justify-between overflow-x-auto">
					<!-- search box -->
					<div class="relative mr-10 max-w-[35%] flex-grow">
						<input
							type="text"
							class="peer h-12 min-w-full rounded-xl border-gray-200 px-4 py-3 ps-11 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
							placeholder="Search Name, Email, Phone or Registration"
							v-model="searchFilterTerm" />
						<div
							class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2 peer-disabled:pointer-events-none peer-disabled:opacity-50">
							<img
								src="/images/topnav/search-icon.svg"
								alt="Search Icon" />
						</div>
					</div>
					<div class="flex items-center space-x-2">
						<div class="flex flex-nowrap items-center space-x-3">
							<!-- filter by Membership type -->
							<div
								class="hs-dropdown relative inline-flex [--placement:bottom-right]">
								<button
									id="hs-dropdown-default"
									type="button"
									class="hs-dropdown-toggle inline-flex h-12 items-center gap-x-2 rounded-xl border border-gray-200 px-4 py-3 font-medium text-gray-800 shadow-sm"
									:class="
										searchServiceType === ''
											? 'bg-white text-black'
											: 'bg-blue-600 text-white'
									">
									{{
										searchServiceType === ''
											? 'Service Type'
											: searchServiceType
									}}
									<svg
										class="size-4 hs-dropdown-open:rotate-180"
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round">
										<path d="m6 9 6 6 6-6" />
									</svg>
								</button>
								<div
									class="hs-dropdown-menu duration z-40 mt-2 hidden min-w-60 space-y-2 rounded-lg bg-white p-2 opacity-0 shadow-md transition-[opacity,margin] before:absolute before:-top-4 before:start-0 before:h-4 before:w-full after:absolute after:-bottom-4 after:start-0 after:h-4 after:w-full hs-dropdown-open:opacity-100"
									aria-labelledby="hs-dropdown-default">
									<div
										class="flex items-center rounded-lg p-2 hover:bg-gray-200"
										v-for="(data, index) in [
											{
												val: 'towing',
												text: 'Towing',
											},
											{
												val: 'fueldelivery',
												text: 'Fuel Delivery',
											},
											{
												val: 'jumpstarting',
												text: 'Jumpstarting',
											},
											{
												val: 'tyre change',
												text: 'Tyre Change',
											},
										]"
										:key="index">
										<input
											type="radio"
											name="membership-category"
											:value="data.val"
											class="mt-0.5 shrink-0 rounded-full border-gray-200 text-blue-600 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
											v-model="searchServiceType" />
										<label class="ms-2 text-gray-500 dark:text-gray-400">{{
											data.text
										}}</label>
									</div>
								</div>
							</div>
						</div>
						<button
							v-if="searchFilterTerm !== '' || searchServiceType !== ''"
							@click="
								() => {
									searchFilterTerm = '';
									searchServiceType = '';
									currentPage = 0;
								}
							"
							title="Clear Filters"
							class="inline-flex size-10 items-center justify-center rounded-full bg-gray-300 p-2">
							<Icon
								name="material-symbols:close"
								class="text-lg" />
						</button>
					</div>
				</div>
				<!-- start of data table -->
				<div class="flex flex-col">
					<div class="-m-1.5 overflow-x-auto">
						<div class="inline-block min-w-full p-1.5 align-middle">
							<div class="overflow-hidden rounded-xl border shadow">
								<table class="min-w-full divide-y">
									<thead>
										<tr>
											<th
												scope="col"
												class="px-6 py-3 text-start font-bold text-gray-500">
												Registration No.
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-start font-bold text-gray-500">
												Date & Time
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-center font-bold text-gray-500">
												Client Name
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-center font-bold text-gray-500">
												Client Phone
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-end font-bold text-gray-500">
												Service Type
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-center font-bold text-gray-500">
												Incident Location
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-end" />
										</tr>
									</thead>
									<tbody class="divide-y divide-gray-200">
										<ErrorOrMissingData v-if="fetchErrorOrEmpty" />
										<IncidentsRecord
											v-for="(data, index) in compiledData"
											:index="index"
											:request-id="data.id"
											:reg-no="data.registration_no"
											:client-name="data.user_name"
											:client-phone="data.user_phone"
											:date-time="
												formatServerProvidedDateTime(data.date_created)
											"
											:serviceType="makeServiceUserFriendly(data.service)"
											:location="data.pickup_location"
											:key="index" />
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<!-- end of data table -->
				<div class="mt-2 flex w-full items-center justify-between rounded-sm py-2">
					<span>Showing Page {{ currentPage + 1 }} of {{ totalPages }}</span>
					<div
						class="space-x-1"
						v-if="totalPages > 1">
						<button
							@click="prevPage"
							class="rounded-md border bg-blue-600 p-2 text-center text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-500"
							:disabled="currentPage === 0">
							Previous
						</button>

						<button
							@click="nextPage"
							class="rounded-md border bg-blue-600 p-2 text-center text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-500"
							:disabled="currentPage === totalPages - 1">
							Next
						</button>
					</div>
				</div>
			</div>
			<!--right analysis graphs -->
			<div class="h-full space-y-6 md:w-[20%]">
				<div class="h-[24rem] rounded-xl border shadow">
					<h1 class="m-4 text-2xl font-semibold">Rescue Trends</h1>
					<div class="flex flex-grow justify-center">
						<IncidentsDonutChart
							:total-fuel-delivery="individualIncidentsCount[0]"
							:total-jumpstarting="individualIncidentsCount[1]"
							:total-towing="individualIncidentsCount[2]"
							:total-tyre-change="individualIncidentsCount[3]" />
					</div>
				</div>
				<div class="min-h-[28rem] rounded-xl border shadow">
					<div class="flex items-center justify-between p-4">
						<h1 class="text-xl font-semibold">Road Rescue Trends</h1>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'ava-all-incidents',
		layout: 'in-app-layout',
	});

	const { getPrincipal } = useAuth();
	const {
		nextPage,
		prevPage,
		determineMostRequestedService,
		individualIncidentsCount,
		compiledData,
		currentPage,
		searchFilterTerm,
		searchServiceType,
		totalPages,
		fetchErrorOrEmpty,
	} = useIncidents();
	const profilePicture: Ref<string> = ref('');

	const subLinksInfo: any[] = [
		{
			icon: '/icons/misc/roadside-mostreq-icon.svg',
			title: 'Most Requested',
			infoText: determineMostRequestedService.value,
			link: 'memberships-home',
			linkText: 'View Members',
		},
		{
			icon: '/icons/misc/roadside-realttracking-icon.svg',
			title: 'Real-Time Tracking',
			infoText: 'Lorem',
			link: 'memberships-home',
			linkText: 'View Live Map',
		},
		{
			icon: '/icons/misc/roadside-complord-icon.svg',
			title: 'Completed Orders',
			infoText: 'Lorem',
			link: 'memberships-home',
			linkText: 'View All',
		},
	];

	onMounted(() => (profilePicture.value = getPrincipal.value.profilePicture));
</script>
