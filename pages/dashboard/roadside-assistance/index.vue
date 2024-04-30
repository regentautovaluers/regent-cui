<template>
	<div class="py-10 h-full responsive-view">
		<!-- top card with link to add new member -->
		<div
			class="flex flex-col md:flex-row items-center justify-between py-5 px-3 md:px-6 border-2 border-gray-200 shadow-sm space-y-2 md:space-y-0 rounded-lg mb-6">
			<div class="flex space-x-2 items-center w-full md:w-fit">
				<img
					class="inline-block size-[60px] rounded-full"
					src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
					alt="User Image" />
				<div class="flex flex-col">
					<span
						class="text-blue-600 font-semibold inline-flex items-center"
						>Hi, {{ getDetails.username }}
						<img
							src="/icons/misc/hand-wave.svg"
							alt="Hand Wave Icon"
							class="ml-1"
					/></span>
					<span>Welcome to Your Roadside Assistance Dashboard</span>
				</div>
			</div>
			<div class="space-x-6">
				<NuxtLink
					:to="{ name: 'ava-all-incidents' }"
					class="text-blue-600 underline underline-offset-2 font-semibold"
					>View All Incidents</NuxtLink
				>
				<NuxtLink
					:to="{ name: 'new-member' }"
					class="bg-blue-600 text-white font-semibold text-sm p-4 rounded-md w-full md:w-fit text-center"
					>ADD A NEW MEMBER</NuxtLink
				>
			</div>
		</div>
		<div
			class="flex flex-col md:flex-row items-center justify-around py-5 px-3 md:px-6 border-2 border-gray-200 shadow-sm space-y-2 md:space-y-0 rounded-lg mb-6">
			<div
				v-for="(info, index) in subLinksInfo"
				:key="index"
				class="flex items-start space-x-2">
				<div>
					<img
						:src="info.icon"
						alt="Sublink Icon"
						class="size-6" />
				</div>
				<div class="flex flex-col space-y-2">
					<span class="text-gray-600 font-semibold">{{
						info.title
					}}</span>
					<span class="text-gray-500 font-semibold">{{
						info.data
					}}</span>
					<NuxtLink class="text-blue-600 font-semibold">
						{{ info.text }}
					</NuxtLink>
				</div>
			</div>
		</div>
		<div class="flex items-center space-x-6 overflow-x-auto">
			<AngularNavigationCardA
				v-for="(route, index) in applicationRoutes[2].children?.slice(
					0,
					5
				)"
				:key="index"
				:display-name="route.displayName"
				:route-name="route.routeName"
				:icon="route.icon" />
		</div>
		<div class="mt-6 flex md:space-x-6 flex-col md:flex-row">
			<!--left and analysis graph -->
			<div class="md:w-[20%] space-y-6">
				<div class="border shadow min-h-[26.5rem] rounded-lg">
					<div class="flex items-center justify-between p-4">
						<h1 class="text-2xl font-semibold">
							Memberships Glance
						</h1>
					</div>
					<ClientOnly>
						<div class="flex justify-center">
							<MembershipsDonutChart />
						</div>
					</ClientOnly>
				</div>
				<div
					class="border shadow min-h-[28rem] rounded-lg flex flex-col">
					<div class="flex items-center justify-between p-4 h-fit">
						<h1 class="text-xl font-semibold">Recent Incidents</h1>
						<NuxtLink
							:to="{ name: 'ava-all-incidents' }"
							class="text-blue-500 underline underline-offset-2 hover:text-blue-600"
							>View All</NuxtLink
						>
					</div>
					<div class="flex-grow flex flex-col justify-between p-3">
						<div
							v-if="!recentIncidentsCol"
							class="flex-grow flex flex-col justify-center items-center">
							<img
								src="/icons/misc/empty-or-error.svg"
								alt="Data Not Found"
								class="inline-block mb-4" />
							<br />
							<span
								class="text-gray-500 text-lg font-semibold text-center"
								>Nothing to Show</span
							>
							<NuxtLink
								:to="{ name: 'ava-towing' }"
								class="text-blue-500 underline underline-offset-2 hover:text-blue-600"
								>Make a towing request</NuxtLink
							>
						</div>
						<RecentIncidentsMinimal
							v-else
							v-for="(incident, index) in recentIncidentsCol"
							:key="index"
							:reg-no="incident.registration_no"
							:date-time="
								formatServerProvidedDateTime(
									incident.date_created
								)
							"
							:service-type="
								makeServiceTypeFriendly(incident.service)
							" />
					</div>
				</div>
			</div>
			<div class="md:w-[80%]">
				<!-- search & filter controls -->
				<div
					class="flex items-center justify-between mb-6 overflow-x-auto flex-nowrap">
					<!-- search box -->
					<div class="relative flex-grow mr-10 max-w-[35%]">
						<input
							type="text"
							class="peer py-3 h-12 px-4 ps-11 bg-gray-200 border-transparent rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none min-w-full"
							placeholder="Search Name, Email or Phone Number"
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
									class="hs-dropdown-toggle py-3 px-4 inline-flex h-12 items-center gap-x-2 font-medium rounded-lg border border-gray-200 text-gray-800 shadow-sm"
									:class="
										!searchMembershipCategory
											? 'bg-white text-black'
											: 'bg-blue-600 text-white'
									">
									Membership Category
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
									class="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2 mt-2 border after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full space-y-2 z-20"
									aria-labelledby="hs-dropdown-default">
									<div
										v-for="(option, index) in [
											{
												text: 'Corporate Members',
												id: 'corp-cat',
												value: 'corporate',
											},
											{
												text: 'Individual Members',
												id: 'indiv-cat',
												value: 'individual',
											},
										]"
										class="flex hover:bg-gray-200 p-2 rounded-lg items-center">
										<!-- prettier-ignore -->
										<input
											:id="option.id"
											type="radio"
											name="membership-category"
											:value="option.value"
											class="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
											v-model="searchMembershipCategory" />

										<label
											for="corp-cat"
											class="text-gray-500 ms-2 dark:text-gray-400"
											>{{ option.text }}</label
										>
									</div>
								</div>
							</div>
						</div>
						<button
							v-if="
								searchFilterTerm !== '' ||
								searchMembershipCategory !== ''
							"
							@click="
								async () => {
									searchFilterTerm = '';
									searchMembershipCategory = '';
									fetchedPages = [];
									await manualLoadInitialData();
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
								class="border rounded-lg shadow overflow-hidden">
								<table class="min-w-full divide-y">
									<thead>
										<tr>
											<th
												scope="col"
												class="px-6 py-3 text-start font-bold text-gray-500">
												Client Name
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-start font-bold text-gray-500">
												Membership Category
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-center font-bold text-gray-500">
												Vehicles
											</th>

											<th
												scope="col"
												class="px-6 py-3 text-end font-bold text-gray-500">
												Client Phone
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-end font-bold text-gray-500">
												Client Email
											</th>
											<th
												scope="col"
												class="px-6 py-3 text-end" />
										</tr>
									</thead>
									<tbody class="divide-y divide-gray-200">
										<ErrorOrMissingData
											v-if="fetchErrorOrEmpty" />
										<MembersRecord
											v-else
											v-for="(
												member, index
											) in computedPagedList"
											:key="index"
											:clientName="member.full_name"
											:membership-category="
												member.category
											"
											:vehicle-count="
												member.membershipVehicleCount
											"
											:member-id="member.id"
											:client-phone="member.phone_number"
											:client-email="member.userEmail" />
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
						>Showing {{ page + 1 }} of {{ totalPages }} pages.</span
					>
					<div class="space-x-1 flex items-center">
						<button
							v-for="(page, index) in fetchedPages"
							:key="index"
							@click="reducePage(page)"
							type="button"
							class="p-2 size-10 text-center text-sm font-semibold rounded-md border bg-blue-600 text-white hover:bg-blue-700">
							{{ page + 1 }}
						</button>
						<button
							v-if="fetchedPages.length < totalPages"
							@click="
								() => {
									if (page + 1 < totalPages) {
										page++;
									}
								}
							"
							type="button"
							class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700">
							<span v-if="!fetchingMoreData">Next Page</span>
							<div
								v-if="fetchingMoreData"
								class="animate-spin inline-block size-5 border-[3px] border-white border-current border-t-transparent text-gray-800 rounded-full"
								role="status"
								aria-label="loading" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import applicationRoutes from "~/types/routes";

	definePageMeta({
		name: "ava-home",
		layout: "in-app-layout",
	});
	const { getDetails } = usePrincipal();
	const {
		computedPagedList,
		searchFilterTerm,
		searchMembershipCategory,
		totalPages,
		fetchErrorOrEmpty,
		fetchingMoreData,
		page,
		reducePage,
		manualLoadInitialData,
		fetchedPages,
		totalNumber,
	} = useGeneralMemberships();
	const { recentIncidentsCol, makeServiceTypeFriendly } = useIncidents();
	const { formatServerProvidedDateTime } = useUtils();

	const subLinksInfo: any[] = [
		{
			icon: "/icons/misc/roadside-registeredmems-icon.svg",
			title: "Registered Members",
			data: totalNumber.value,
			link: "memberships-home",
			text: "View Members",
		},
		{
			icon: "/icons/misc/roadside-realttracking-icon.svg",
			title: "Real-Time Tracking",
			data: "Lorem",
			link: "memberships-home",
			text: "View Live Map",
		},
		{
			icon: "/icons/misc/roadside-complord-icon.svg",
			title: "Completed Orders",
			data: "Lorem",
			link: "memberships-home",
			text: "View All",
		},
		{
			icon: "/icons/misc/roadside-comms-icon.svg",
			title: "Communications",
			data: "Lorem",
			link: "memberships-home",
			text: "View Chats",
		},
	];
</script>
