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
					<span>Welcome to Your Roadside Assistance Dashboard</span>
				</div>
			</div>
			<div class="space-x-6">
				<NuxtLink
					:to="{ name: 'ava-all-incidents' }"
					class="font-semibold text-blue-600 underline underline-offset-2"
					>View All Incidents</NuxtLink
				>
				<NuxtLink
					:to="{ name: 'new-member' }"
					class="w-full rounded-xl bg-blue-600 p-4 text-center text-sm font-semibold text-white md:w-fit"
					>ADD A NEW MEMBER</NuxtLink
				>
			</div>
		</div>
		<div
			class="mb-6 flex flex-col items-center justify-around space-y-2 rounded-xl border-2 border-gray-200 px-3 py-5 shadow-sm md:flex-row md:space-y-0 md:px-6">
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
					<span class="font-semibold text-gray-600">{{ info.title }}</span>
					<span class="font-semibold text-gray-500">{{ info.data }}</span>
					<NuxtLink class="font-semibold text-blue-600">
						{{ info.text }}
					</NuxtLink>
				</div>
			</div>
		</div>
		<div class="flex items-center justify-between space-x-6 overflow-x-auto">
			<NuxtLink
				v-for="(route, index) in applicationRoutes[2].children?.slice(0, 4)"
				:key="index"
				:to="{ name: route.routeName }"
				class="flex h-20 w-1/4 items-center space-x-3 rounded-xl border-2 border-gray-200 bg-white px-4 shadow-sm hover:border-blue-500">
				<img
					:src="route.icon"
					alt="Service Icon"
					class="size-10" />
				<span class="text-lg tracking-wide text-gray-500">{{ route.displayName }}</span>
			</NuxtLink>
		</div>
		<div class="mt-6 flex flex-col md:flex-row md:space-x-6">
			<!--left and analysis graph -->
			<div class="space-y-6 md:w-[20%]">
				<div class="min-h-[24rem] rounded-xl border shadow">
					<div class="flex items-center justify-between p-4">
						<h1 class="text-2xl font-semibold">Memberships Glance</h1>
					</div>
					<ClientOnly>
						<div class="flex justify-center">
							<MembershipsDonutChart />
						</div>
					</ClientOnly>
				</div>
				<div class="flex min-h-[25rem] flex-col rounded-xl border shadow">
					<div class="flex h-fit items-center justify-between p-4">
						<h1 class="text-xl font-semibold">Recent Incidents</h1>
						<NuxtLink
							:to="{ name: 'ava-all-incidents' }"
							class="text-blue-500 underline underline-offset-2 hover:text-blue-600"
							>View All</NuxtLink
						>
					</div>
					<div class="flex flex-grow flex-col p-3">
						<div
							v-if="recentIncidentsCol.length === 0"
							class="flex flex-grow flex-col items-center justify-center">
							<img
								src="/icons/misc/empty-or-error.svg"
								alt="Data Not Found"
								class="mb-4 inline-block" />
							<br />
							<span class="text-center text-lg font-semibold text-gray-500"
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
							:date-time="formatServerProvidedDateTime(incident.date_created)"
							:service-type="makeServiceUserFriendly(incident.service)" />
					</div>
				</div>
			</div>
			<div class="md:w-[80%]">
				<!-- search & filter controls -->
				<div class="mb-6 flex flex-nowrap items-center justify-between overflow-x-auto">
					<!-- search box -->
					<div class="relative mr-10 max-w-[35%] flex-grow">
						<input
							type="text"
							class="generic-input"
							placeholder="Search Name, Email or Phone Number"
							v-model.lazy="searchFilterTerm" />
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
										!searchMembershipCategory
											? 'bg-white text-black'
											: 'bg-blue-600 text-white'
									">
									Membership Category
									<HsChevron />
								</button>
								<div
									class="hs-dropdown-menu duration z-20 mt-2 hidden min-w-60 space-y-2 rounded-lg border bg-white p-2 opacity-0 shadow-md transition-[opacity,margin] before:absolute before:-top-4 before:start-0 before:h-4 before:w-full after:absolute after:-bottom-4 after:start-0 after:h-4 after:w-full hs-dropdown-open:opacity-100"
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
										:key="index"
										class="flex items-center rounded-lg p-2 hover:bg-gray-200">
										<!-- prettier-ignore -->
										<input
											:id="option.id"
											type="radio"
											name="membership-category"
											:value="option.value"
											class="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
											v-model="searchMembershipCategory" />

										<label
											for="corp-cat"
											class="ms-2 text-gray-500"
											>{{ option.text }}</label
										>
									</div>
								</div>
							</div>
						</div>
						<button
							v-if="searchFilterTerm !== '' || searchMembershipCategory !== ''"
							@click="clearFiltering"
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
										<ErrorOrMissingData v-if="fetchErrorOrEmpty" />
										<MembersRecord
											v-else
											v-for="(member, index) in membersList"
											:key="index"
											:clientName="member.full_name"
											:membership-category="member.category"
											:vehicle-count="member.membershipVehicleCount"
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
				<div class="mt-2 flex w-full items-center justify-between rounded-sm py-2">
					<span>Showing {{ page + 1 }} of {{ totalPages }} pages.</span>
					<div class="flex items-center space-x-1">
						<button
							@click="loadPreviousPage"
							v-if="page > 0"
							type="button"
							class="inline-flex items-center gap-x-2 rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
							<span v-if="!fetchingMoreData">Previous Page</span>
							<div
								v-if="fetchingMoreData"
								class="inline-block size-5 animate-spin rounded-full border-[3px] border-current border-white border-t-transparent text-gray-800"
								role="status"
								aria-label="loading" />
						</button>
						<button
							@click="loadNextPage"
							v-if="page < totalPages - 1"
							type="button"
							class="inline-flex items-center gap-x-2 rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
							<span v-if="!fetchingMoreData">Next Page</span>
							<div
								v-if="fetchingMoreData"
								class="inline-block size-5 animate-spin rounded-full border-[3px] border-current border-white border-t-transparent text-gray-800"
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
	import applicationRoutes from '~/types/routes';

	definePageMeta({
		name: 'ava-home',
		layout: 'in-app-layout',
	});
	const { getPrincipal } = useAuth();
	const profilePicture: Ref<string> = ref('');
	const {
		membersList,
		searchFilterTerm,
		searchMembershipCategory,
		totalNumber,
		totalPages,
		fetchErrorOrEmpty,
		fetchingMoreData,
		page,
		clearFiltering,
		loadNextPage,
		loadPreviousPage,
	} = useGeneralMemberships();
	const { recentIncidentsCol } = useIncidents();

	const subLinksInfo: any[] = [
		{
			icon: '/icons/misc/roadside-registeredmems-icon.svg',
			title: 'Registered Members',
			data: totalNumber,
			link: 'memberships-home',
			text: 'View Members',
		},
		{
			icon: '/icons/misc/roadside-realttracking-icon.svg',
			title: 'Real-Time Tracking',
			data: 'Lorem',
			link: 'memberships-home',
			text: 'View Live Map',
		},
		{
			icon: '/icons/misc/roadside-complord-icon.svg',
			title: 'Completed Orders',
			data: 'Lorem',
			link: 'memberships-home',
			text: 'View All',
		},
	];

	onMounted(() => (profilePicture.value = getPrincipal.value.profilePicture));
</script>
