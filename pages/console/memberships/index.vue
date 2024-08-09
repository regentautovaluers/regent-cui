<template>
	<div class="responsive-view h-fit py-10">
		<!-- top card with link to add new member -->
		<div
			class="flex flex-col items-center justify-between space-y-2 rounded-xl border-2 border-gray-200 px-3 py-5 shadow-sm md:flex-row md:space-y-0 md:px-6">
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
					<span>You Have {{ totalNumber }} Registered Members</span>
				</div>
			</div>
			<NuxtLink
				:to="{ name: 'new-member' }"
				class="w-full rounded-xl bg-blue-600 p-4 text-center text-sm font-semibold text-white md:w-fit"
				>ADD A NEW MEMBER</NuxtLink
			>
		</div>
		<div class="mt-6 flex flex-col md:flex-row md:space-x-6">
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
							class="size-10 rounded-full bg-gray-300 p-2 text-center">
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
			<!-- right ad and analysis graph -->
			<div class="space-y-6 md:w-[20%]">
				<div class="min-h-96 rounded-xl border shadow">
					<div class="flex items-center justify-between p-4">
						<h1 class="text-2xl font-semibold">About</h1>
						<!-- info switch -->
						<div class="hs-dropdown relative inline-flex [--placement:bottom-right]">
							<button
								id="hs-dropdown-default"
								type="button"
								class="hs-dropdown-toggle">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="30"
									height="30"
									viewBox="0 0 32 32">
									<circle
										cx="16"
										cy="8"
										r="2"
										fill="currentColor" />
									<circle
										cx="16"
										cy="16"
										r="2"
										fill="currentColor" />
									<circle
										cx="16"
										cy="24"
										r="2"
										fill="currentColor" />
								</svg>
							</button>
							<div
								class="hs-dropdown-menu duration mt-2 hidden min-w-60 space-y-2 rounded-lg border bg-white p-2 opacity-0 shadow-md transition-[opacity,margin] before:absolute before:-top-4 before:start-0 before:h-4 before:w-full after:absolute after:-bottom-4 after:start-0 after:h-4 after:w-full hs-dropdown-open:opacity-100 dark:bg-gray-800"
								aria-labelledby="hs-dropdown-default">
								<div class="flex items-center rounded-lg p-2 hover:bg-gray-200">
									<input
										type="radio"
										name="type-blob"
										:value="0"
										class="mt-0.5 shrink-0 rounded-full border-gray-200 text-blue-600 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
										v-model="currentTypeBlob" />
									<label class="ms-2 text-gray-500">Roadside Assitance</label>
								</div>
								<div class="flex items-center rounded-lg p-2 hover:bg-gray-200">
									<input
										type="radio"
										name="type-blob"
										:value="1"
										class="mt-0.5 shrink-0 rounded-full border-gray-200 text-blue-600 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
										v-model="currentTypeBlob" />
									<label class="ms-2 text-gray-500">Emergency (E) Rescue</label>
								</div>
							</div>
						</div>
					</div>
					<div class="flex flex-col items-center justify-center p-2">
						<div class="flex items-center justify-center rounded-full bg-gray-300 p-5">
							<!-- <img
								class="inline-block size-[66px]"
								src="/icons/sidenav/memberships-icon.svg"
								alt="Image Description" /> -->
						</div>
						<h1 class="text-xl font-semibold">Our Membership</h1>
						<h2 class="text-lg font-semibold text-gray-600">
							{{ membershipTypesBlob[currentTypeBlob].name }}
						</h2>
						<p class="mt-2 px-4 text-sm text-gray-600">
							{{ membershipTypesBlob[currentTypeBlob].blobText }}
						</p>
					</div>
					<div class="space-y-4 border-t p-4">
						<a
							:href="membershipTypesBlob[currentTypeBlob].externalLink"
							target="_blank"
							rel="noopener noreferrer"
							class="text-blue-600 hover:text-blue-700 hover:underline hover:underline-offset-2"
							>Read More</a
						>
					</div>
				</div>
				<div class="h-[24rem] rounded-xl border shadow">
					<div class="flex items-center justify-between p-4">
						<h1 class="text-2xl font-semibold">Memberships Glance</h1>
					</div>
					<ClientOnly>
						<div class="flex justify-center">
							<MembershipsDonutChart />
						</div>
					</ClientOnly>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'memberships-home',
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
	const currentTypeBlob: Ref<number> = ref(0);
	const membershipTypesBlob: any[] = [
		{
			name: 'Roadside Assistance',
			blobText:
				'Our 24/7 road rescue service swiftly gets you back on track, whether it’s a flat tire or a breakdown. Trust our highway heroes to ensure a smooth ride, so you can continue your journey with peace of mind! We’re committed to minimizing disruptions and maximizing safety, so you never miss a beat on the road.',
			externalLink: 'https://www.google.com',
		},
		{
			name: 'Emergency Evacuation',
			blobText:
				'Our emergency response service is your lifeline during critical moments. Whether it’s a remote wilderness rescue or a medical evacuation, our team combines the speed of air travel with the stability of ground support. Trust us to swiftly reach you in rugged terrains or bustling urban areas, ensuring your safety when every second counts.',
			externalLink: 'https://www.google.com',
		},
	];

	onMounted(() => (profilePicture.value = getPrincipal.value.profilePicture));
</script>
