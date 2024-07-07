<template>
	<div class="py-10 h-full responsive-view">
		<!-- top card with link to add new member -->
		<div
			class="flex flex-col md:flex-row items-center justify-between py-5 px-3 md:px-6 border-2 border-gray-200 shadow-sm space-y-2 md:space-y-0 rounded-xl mb-6">
			<div class="flex space-x-2 items-center w-full md:w-fit">
				<img
					class="object-cover size-[60px] rounded-full"
					:src="profilePicture"
					alt="User Image" />
				<div class="flex flex-col">
					<span
						class="text-blue-600 font-semibold inline-flex items-center"
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
					class="text-blue-600 underline underline-offset-2 font-semibold"
					>View All Members</NuxtLink
				>
				<NuxtLink
					:to="{ name: 'new-member' }"
					class="bg-blue-600 text-white font-semibold text-sm p-4 rounded-xl w-full md:w-fit text-center"
					>ADD A NEW MEMBER</NuxtLink
				>
			</div>
		</div>
		<div
			class="flex whitespace-nowrap overflow-x-scroll items-center justify-around py-5 px-6 border-2 border-gray-200 shadow-sm rounded-xl mb-6">
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
					<span class="text-gray-600 font-semibold">{{
						info.title
					}}</span>
					<span class="text-gray-500 font-semibold">Lorem</span>
					<NuxtLink class="text-blue-600 font-semibold">
						{{ info.text }}
					</NuxtLink>
				</div>
			</div>
		</div>

		<div class="mt-6 flex md:space-x-6 flex-col md:flex-row">
			<div class="md:w-[80%]">
				<!-- search & filter controls -->
				<div
					class="flex items-center justify-between mb-6 overflow-x-auto flex-nowrap">
					<!-- search box -->
					<div class="relative flex-grow mr-10 max-w-[35%]">
						<input
							type="text"
							class="peer py-3 h-12 px-4 ps-11 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none min-w-full"
							placeholder="Search Name, Email, Phone or Registration"
							v-model="searchFilterTerm" />
						<div
							class="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-2 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
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
									class="hs-dropdown-toggle py-3 px-4 inline-flex h-12 items-center gap-x-2 font-medium rounded-xl border border-gray-200 text-gray-800 shadow-sm"
									:class="
										searchServiceType === ''
											? 'bg-white text-black'
											: 'bg-blue-600 text-white'
									">
									{{
										searchServiceType === ""
											? "Service Type"
											: searchServiceType
									}}
									<svg
										class="hs-dropdown-open:rotate-180 size-4"
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
									class="hs-dropdown-menu z-40 transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2 mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full space-y-2"
									aria-labelledby="hs-dropdown-default">
									<div
										class="flex hover:bg-gray-200 p-2 rounded-lg items-center"
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
											class="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
											v-model="searchServiceType" />
										<label
											class="text-gray-500 ms-2 dark:text-gray-400"
											>{{ data.text }}</label
										>
									</div>
								</div>
							</div>
						</div>
						<button
							v-if="
								searchFilterTerm !== '' ||
								searchServiceType !== ''
							"
							@click="
								() => {
									searchFilterTerm = '';
									searchServiceType = '';
									currentPage = 0;
								}
							"
							title="Clear Filters"
							class="bg-gray-300 inline-flex items-center justify-center p-2 rounded-full size-10">
							<Icon
								name="material-symbols:close"
								class="text-lg" />
						</button>
					</div>
				</div>
				<!-- start of data table -->
				<div class="flex flex-col">
					<div class="-m-1.5 overflow-x-auto">
						<div class="p-1.5 min-w-full inline-block align-middle">
							<div
								class="border rounded-xl shadow overflow-hidden">
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
										<ErrorOrMissingData
											v-if="fetchErrorOrEmpty" />
										<IncidentsRecord
											v-for="(
												data, index
											) in compiledData"
											:index="index"
											:reg-no="data.registration_no"
											:client-name="data.user_name"
											:client-phone="data.user_phone"
											:date-time="
												formatServerProvidedDateTime(
													data.date_created
												)
											"
											:serviceType="
												makeServiceTypeFriendly(
													data.service
												)
											"
											:location="data.pickup_location"
											:key="index" />
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<!-- end of data table -->
				<div
					class="mt-2 w-full rounded-sm flex justify-between items-center py-2">
					<span
						>Showing Page {{ currentPage + 1 }} of
						{{ totalPages }}</span
					>
					<div
						class="space-x-1"
						v-if="totalPages > 1">
						<button
							@click="prevPage"
							class="p-2 text-center text-sm font-semibold rounded-md border bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-500"
							:disabled="currentPage === 0">
							Previous
						</button>

						<button
							@click="nextPage"
							class="p-2 text-center text-sm font-semibold rounded-md border bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-500"
							:disabled="currentPage === totalPages - 1">
							Next
						</button>
					</div>
				</div>
			</div>
			<!--right analysis graphs -->
			<div class="md:w-[20%] space-y-6 h-full">
				<div class="border shadow min-h-[28rem] rounded-xl">
					<h1 class="text-2xl font-semibold m-4">Data Chart</h1>
					<div class="flex justify-center flex-grow">
						<IncidentsDonutChart
							:total-fuel-delivery="countFuelDelivery"
							:total-jumpstarting="countJumpstarting"
							:total-towing="countTowing"
							:total-tyre-change="countTyreChange" />
					</div>
				</div>
				<div class="border shadow min-h-[28rem] rounded-xl">
					<div class="flex items-center justify-between p-4">
						<h1 class="text-2xl font-semibold">
							Road Rescue Trends
						</h1>
						<NuxtLink :to="{ name: '' }"></NuxtLink>
					</div>
					<div class="flex flex-col justify-center items-center p-2">
						<div
							class="bg-gray-300 p-5 rounded-full flex justify-center items-center">
							<!-- <img
								class="inline-block size-[66px]"
								src="/icons/sidenav/memberships-icon.svg"
								alt="Image Description" /> -->
						</div>
						<h1 class="text-xl font-semibold">Our Membership</h1>
						<h2 class="font-semibold text-gray-600 text-lg">
							Hello world
						</h2>
						<p class="text-sm mt-2 px-4">Hello world</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: "ava-all-incidents",
		layout: "in-app-layout",
	});

	const { getPrincipal } = useAuth();
	const {
		nextPage,
		prevPage,
		determineMostRequestedService,
		countJumpstarting,
		countFuelDelivery,
		countTowing,
		countTyreChange,
		compiledData,
		currentPage,
		searchFilterTerm,
		searchServiceType,
		totalPages,
		fetchErrorOrEmpty,
		makeServiceTypeFriendly,
	} = useIncidents();
	const profilePicture: Ref<string> = ref("");

	const subLinksInfo: any[] = [
		{
			icon: "/icons/misc/roadside-mostreq-icon.svg",
			title: "Most Requested",
			link: "memberships-home",
			text: "View Members",
		},
		{
			icon: "/icons/misc/roadside-realttracking-icon.svg",
			title: "Real-Time Tracking",
			link: "memberships-home",
			text: "View Live Map",
		},
		{
			icon: "/icons/misc/roadside-complord-icon.svg",
			title: "Completed Orders",
			link: "memberships-home",
			text: "View All",
		},
	];

	onMounted(() => (profilePicture.value = getPrincipal.value.profilePicture));
</script>
