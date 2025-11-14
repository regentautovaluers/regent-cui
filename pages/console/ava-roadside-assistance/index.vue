<template>
	<div class="console-layout-spacing flex flex-1 flex-col">
		<div
			class="mb-10 flex h-28 items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
			<div class="flex items-center space-x-3">
				<UserAvatar />
				<div class="mobile-lg:text-sm h-full flex-col overflow-hidden text-xs md:flex">
					<h1 class="inline-flex items-center space-x-3">
						<span class="font-semibold text-blue-600"
							>Hi, {{ getPrincipal?.username }}</span
						>
						<HandshakeIcon />
					</h1>
					<h2 class="text-gray-500">You Have {{ totalNumber }} Registered Members.</h2>
				</div>
			</div>
			<NuxtLink
				:to="{ name: 'ava-membership-types' }"
				class="generic-nuxt-link mobile-md:flex mobile-lg:text-sm hidden text-xs font-normal whitespace-nowrap uppercase">
				Add Member
			</NuxtLink>
		</div>

		<!-- members listing -->
		<!-- div to show when there is a fetch error -->
		<div
			class="flex h-full flex-1 flex-col items-center justify-center space-y-4 rounded-lg border bg-white text-sm shadow-sm"
			v-if="fetchMembershipsStatus === 'error'">
			<BirdieNotFoundIcon />
			<h1 class="font-semibold text-gray-500">Oops! Fetch Failed!</h1>
			<button
				class="inline-flex items-center space-x-2 rounded-lg border bg-transparent px-2 py-1 text-gray-500 hover:text-gray-600"
				@click="refreshPage">
				<span>Refresh</span>
				<RefreshIcon classes="size-6" />
			</button>
		</div>

		<!-- div to show when there are no members -->
		<div
			class="flex h-full flex-1 flex-col items-center justify-center space-y-4 rounded-lg border bg-white text-sm shadow-sm"
			v-else-if="fetchMembershipsStatus === 'success' && corporateMemberships.length === 0">
			<BirdieNotFoundIcon />
			<h1 class="font-semibold text-gray-500">Oops! Seems like you have no members!</h1>
			<NuxtLink
				:to="{ name: 'ava-membership-types' }"
				class="generic-nuxt-link">
				Onboard AVA Member
			</NuxtLink>
		</div>

		<!-- div to show when there are members -->
		<div
			v-else
			class="laptop:grid-cols-[80%_20%] grid flex-1 grid-cols-1 gap-y-4">
			<div class="laptop:mr-10 mr-0 flex h-full flex-col justify-between">
				<!-- search & filter controls -->
				<div class="flex h-fit flex-col space-y-2">
					<div class="flex justify-between space-x-2">
						<form
							class="tablet:mt-0 tablet:w-[50%] laptop-lg:w-[35%] relative mt-2 flex w-full items-center justify-between"
							@submit.prevent="executeFetchMemberships()">
							<input
								type="text"
								class="generic-input h-[50px]"
								placeholder="Search Client Name"
								v-model="searchTerm"
								required />
							<button
								type="submit"
								class="generic-search-submit-button">
								<SearchIcon />
							</button>
						</form>
						<button
							title="Open Filters"
							@click="() => (areFiltersOpen = !areFiltersOpen)"
							class="group inline-flex h-[50px] w-14 cursor-pointer items-center justify-center rounded-lg border border-gray-400 p-1 outline-none hover:bg-gray-100">
							<span
								class="icon-[material-symbols-light--filter-alt-sharp] size-7 text-gray-400"></span>
						</button>
					</div>
					<Transition name="fade-slide">
						<div
							class="laptop:p-4 min-h-20 rounded-lg bg-white p-2 shadow-sm outline-none"
							v-show="areFiltersOpen">
							<div
								class="tablet:flex-row mb-2 flex flex-col justify-between space-y-2">
								<h1 class="text-sm font-semibold text-gray-500">Filter Results</h1>
								<form
									class="space-x-2"
									v-if="searchTerm != '' || membershipType != null"
									@submit.prevent="executeFetchMemberships()">
									<button
										@click="
											() => {
												searchTerm = '';
												membershipType = null;
												areFiltersOpen = false;
												executeFetchMemberships();
											}
										"
										type="button"
										class="w-fit rounded-full border border-gray-500 bg-transparent px-2 py-1 text-sm font-semibold text-gray-500 shadow hover:bg-gray-200">
										Clear Filters
									</button>
									<button
										type="submit"
										class="w-fit rounded-full border border-gray-500 bg-transparent px-2 py-1 text-sm font-semibold text-gray-500 shadow hover:bg-gray-200">
										Apply Filters
									</button>
								</form>
							</div>
							<ul
								class="tablet:flex-row tablet:space-y-0 tablet:space-x-2 flex w-full flex-col space-y-2">
								<li class="w-full">
									<input
										type="radio"
										id="roadside-assistance"
										name="hosting"
										value="roadside-assistance"
										class="peer hidden"
										required
										v-model="membershipType" />
									<label
										for="roadside-assistance"
										class="inline-flex w-full flex-1 cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-5 text-sm text-gray-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:bg-gray-100 hover:text-gray-600">
										<div class="block">
											<div class="w-full font-semibold">
												Roadside Assistance
											</div>
											<div class="w-full">
												Show only roadside assistance members
											</div>
										</div>
									</label>
								</li>
								<li class="w-full">
									<input
										type="radio"
										id="emergency-evacuation"
										name="hosting"
										value="emergency-evacuation"
										class="peer hidden"
										required
										v-model="membershipType" />
									<label
										for="emergency-evacuation"
										class="inline-flex w-full flex-1 cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-5 text-sm text-gray-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:bg-gray-100 hover:text-gray-600">
										<div class="block">
											<div class="w-full font-semibold">
												Emergency Evactuation
											</div>
											<div class="w-full">
												Show only emergency evacuation members.
											</div>
										</div>
									</label>
								</li>
							</ul>
						</div>
					</Transition>
				</div>

				<!-- the table itself -->
				<div class="my-4 flex-grow">
					<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
						<table class="w-full text-left text-gray-500">
							<thead class="bg-gray-100 text-sm text-gray-700 uppercase">
								<tr>
									<th
										scope="col"
										class="table-headers ps-3">
										Client Name
									</th>
									<th
										scope="col"
										class="table-headers tablet:table-cell hidden">
										Category
									</th>
									<th
										scope="col"
										class="table-headers">
										Vehicles
									</th>
									<th
										scope="col"
										class="table-headers tablet:table-cell hidden">
										Client Contacts
									</th>
									<th
										scope="col"
										class="table-headers" />
								</tr>
							</thead>
							<tbody>
								<!-- loading state -->
								<tr
									class="border-b bg-white hover:bg-gray-100"
									v-if="fetchMembershipsStatus === 'pending'"
									v-for="a in 10"
									:key="a">
									<td
										scope="row"
										class="p-6 font-medium whitespace-nowrap text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>username</span
										>
									</td>
									<td class="tablet:table-cell hidden p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>useremail</span
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
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>usermail</span
										>
									</td>
								</tr>
								<tr
									class="border-b bg-white text-sm hover:bg-gray-100"
									v-else
									v-for="(member, index) in corporateMemberships"
									:key="index">
									<td
										scope="row"
										class="py-4 ps-3 whitespace-nowrap text-gray-600">
										{{ member.full_name }}
									</td>
									<td class="tablet:table-cell hidden py-4 text-blue-600">
										{{ stringToTitleCase(member.category) }}
									</td>
									<td class="py-4 font-semibold text-pink-600">
										{{ member.membershipVehicleCount }}
									</td>
									<td class="tablet:table-cell hidden flex-col py-4">
										<span>{{ member.userEmail ?? 'Email N/A' }}</span>
										<br />
										<span
											class="w-fit rounded-lg bg-pink-200 px-1 text-sm text-pink-600"
											>{{ member.phone_number }}</span
										>
									</td>
									<td class="py-4 pr-2 text-end">
										<button
											:id="'dropdownLeftButton' + index"
											:data-dropdown-toggle="'dropdownTop' + index"
											data-dropdown-placement="left"
											type="button">
											<MenuKebabIcon />
										</button>
										<!-- Dropdown menu -->
										<div
											:id="'dropdownTop' + index"
											class="z-10 hidden w-44 rounded-lg border bg-white shadow-md">
											<ul
												class="py-2 text-sm text-gray-500"
												aria-labelledby="dropdownLeftButton">
												<li>
													<button
														class="block w-full px-4 py-2 text-center hover:bg-gray-100"
														type="button"
														@click="
															() => {
																selectedIndexToEdit = index;
															}
														"
														data-modal-target="edit-member-details-modal"
														data-modal-toggle="edit-member-details-modal">
														Edit Details
													</button>
												</li>
												<li>
													<button
														v-if="member.membershipVehicleCount > 0"
														class="block w-full px-4 py-2 text-center hover:bg-gray-100"
														type="button"
														@click="
															() => {
																selectedIndexToEdit = index;
																getMemberVehicles(member.id);
															}
														"
														data-modal-target="view-member-vehicles-modal"
														data-modal-toggle="view-member-vehicles-modal">
														View Vehicles
													</button>
												</li>
												<li>
													<button
														class="block w-full px-4 py-2 text-center hover:bg-gray-100"
														type="button"
														data-modal-target="add-member-vehicles-modal"
														data-modal-toggle="add-member-vehicles-modal"
														@click="
															() => {
																selectedIndexToEdit = index;
															}
														">
														Add Vehicle
													</button>
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

			<!-- side-information including chart -->
			<div class="tablet:flex-row tablet:space-x-5 laptop:flex-col flex flex-col space-y-5">
				<!-- descriptions box -->
				<div
					class="tablet:h-full laptop:h-1/2 tablet:w-1/2 laptop:w-full flex h-[28rem] w-full flex-col rounded-md border bg-white px-5 shadow-sm">
					<div class="flex h-14 items-center justify-between">
						<h1 class="text-xl font-bold">About</h1>
						<button
							id="ava-services-desc"
							data-dropdown-toggle="ava-services-desc"
							data-dropdown-placement="left"
							type="button">
							<MenuKebabIcon />
						</button>
						<!-- Dropdown menu -->
						<div
							id="ava-services-desc"
							class="z-10 hidden w-44 rounded-lg border bg-white shadow-md">
							<ul
								class="py-2 text-sm text-gray-500"
								aria-labelledby="ava-services-desc">
								<li>
									<button
										class="block w-full px-4 py-2 text-center hover:bg-gray-100"
										type="button"
										@click.prevent="activeDescriptionIndex = 1">
										Roadside Assistance
									</button>
								</li>
								<li>
									<button
										class="block w-full px-4 py-2 text-center whitespace-nowrap hover:bg-gray-100"
										type="button"
										@click.prevent="activeDescriptionIndex = 6">
										Emergency Evacuation
									</button>
								</li>
							</ul>
						</div>
					</div>
					<div class="flex-grow">
						<div class="flex h-fit w-full items-center justify-center">
							<button
								class="inline-flex size-16 items-center justify-center rounded-full bg-pink-500 text-white shadow-sm">
								<MembershipsIcon classes="size-8 text-inherit" />
							</button>
						</div>
						<div class="my-2 w-full text-center">
							<h1 class="text-center text-xl font-bold">Our Services</h1>
							<h2 class="text-center font-bold text-gray-500">
								{{ navigationRoutes[activeDescriptionIndex].screenName ?? '' }}
							</h2>
						</div>

						<p class="text-sm text-gray-500">
							{{ navigationRoutes[activeDescriptionIndex].description ?? '' }}
						</p>
					</div>
					<a
						href="https://ava.ke/"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex h-14 items-center border-t pl-3 text-sm text-blue-600 transition-colors duration-300 hover:text-blue-700"
						>Read More</a
					>
				</div>

				<!-- chart -->
				<div
					class="tablet:h-full laptop:h-1/2 tablet:w-1/2 laptop:w-full flex h-[28rem] w-full flex-col rounded-md border bg-white px-5 shadow-sm">
					<h1 class="p-5 text-xl font-bold">Memberships</h1>

					<div
						class="flex h-full items-center justify-center"
						v-if="fetchAvaMembersDistributionStatus === 'pending'">
						<FormSubmissionLoader class="size-10 animate-spin text-gray-300" />
					</div>
					<div
						class="flex h-full flex-col items-center justify-center"
						v-else-if="
							fetchAvaMembersDistributionStatus === 'success' &&
							!computeActiveInactive.length
						">
						<BirdieNotFoundIcon />
						<h1 class="mb-1 font-semibold text-gray-500">No Data!</h1>
					</div>
					<div
						class="flex h-full flex-col items-center justify-center"
						v-else-if="fetchAvaMembersDistributionStatus === 'error'">
						<BirdieNotFoundIcon />
						<h1 class="mb-1 font-semibold text-gray-500">Oops! Fetch Failed!</h1>
						<button
							class="inline-flex items-center space-x-2 rounded-lg border bg-transparent px-2 py-1 text-gray-500 hover:text-gray-600"
							@click="refreshPage">
							<span>Refresh</span>
							<RefreshIcon classes="size-6" />
						</button>
					</div>

					<ActiveStatusAVAMembersDoughnutChart
						v-else
						:labels="['Active', 'Inactive']"
						:colors="['#09bc3c', '#fd5353']"
						:data="computeActiveInactive"
						:total="computedTotal" />
				</div>
			</div>
		</div>
	</div>

	<!-- Edit Member details modal -->
	<ParentModal
		modalId="edit-member-details-modal"
		modalTitle="Edit Member Details"
		modalPlacement="center-center"
		@close-modal="
			() => {
				selectedIndexToEdit = -1;
			}
		">
		<EditAVAMemberDetails
			v-if="corporateMemberships && selectedIndexToEdit > -1"
			:member-id="corporateMemberships[selectedIndexToEdit].id"
			:member-name="corporateMemberships[selectedIndexToEdit].full_name"
			:member-email="corporateMemberships[selectedIndexToEdit].userEmail"
			:member-phone="corporateMemberships[selectedIndexToEdit].phone_number" />
	</ParentModal>

	<!-- Add Vehicles -->
	<ParentModal
		modalId="add-member-vehicles-modal"
		modalTitle="Add Vehicles"
		modalPlacement="center-center"
		@close-modal="
			() => {
				selectedIndexToEdit = -1;
			}
		">
		<AddMemberVehicle
			v-if="corporateMemberships && selectedIndexToEdit > -1"
			:membership-id="corporateMemberships[selectedIndexToEdit].id" />
	</ParentModal>

	<!-- View Member Vehicles modal -->
	<ParentModal
		modalId="view-member-vehicles-modal"
		modalPlacement="center-center"
		modalTitle="Member Vehicles"
		class="relative p-3 py-2 md:p-4"
		@close-modal="
			() => {
				memberVehicles = [];
				selectedIndexToEdit = -1;
			}
		">
		<div
			class="flex h-fit space-x-3 overflow-x-auto"
			ref="scrollEl"
			style="
				::-webkit-scrollbar-thumb {
					border-radius: 10px;
				}

				/* Hide scrollbar for Chrome, Safari and Opera */
				::-webkit-scrollbar {
					display: none;
				}

				/* Hide scrollbar for IE, Edge and Firefox */
				.no-scrollbar {
					-ms-overflow-style: none; /* IE and Edge */
					scrollbar-width: none; /* Firefox */
				}
			">
			<MemberVehiclesLoader
				v-if="fetchMemberVehiclesLoading"
				v-for="a in 2"
				:key="a" />
			<MemberVehiclesCard
				v-else
				v-for="(vehicle, index) in memberVehicles"
				:key="index"
				:membership-id="vehicle.id"
				:reg-no="vehicle.registration"
				:membership-type="stringToSentenceCase(vehicle.membershipType.membership_name)"
				:date-registered="formatServerProvidedDate(vehicle.start_date)"
				:expiration-date="formatServerProvidedDate(vehicle.end_date)"
				:membership-status="stringToTitleCase(vehicle.membership_status)" />
		</div>
		<!-- left button -->
		<button
			type="button"
			class="group absolute start-0 top-0 z-30 h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
			@click="x -= 352"
			:class="arrivedState.left ? 'disabled' : null"
			v-if="memberVehicles.length > 1">
			<span
				class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/50 ring-white outline-none group-focus:ring-4">
				<svg
					class="h-4 w-4 text-white rtl:rotate-180"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 6 10">
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 1 1 5l4 4" />
				</svg>
				<span class="sr-only">Scroll Left</span>
			</span>
		</button>

		<!-- right button -->
		<button
			type="button"
			class="group absolute end-0 top-0 z-30 h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
			:class="arrivedState.right ? 'disabled' : null"
			@click="x += 352"
			v-if="memberVehicles.length > 1">
			<span
				class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/50 ring-white outline-none group-focus:ring-4">
				<svg
					class="h-4 w-4 text-white rtl:rotate-180"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 6 10">
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="m1 9 4-4-4-4" />
				</svg>
				<span class="sr-only">Scroll Right</span>
			</span>
		</button>
	</ParentModal>
</template>

<script setup lang="ts">
	import { useScroll } from '@vueuse/core';

	definePageMeta({
		name: 'ava-memberships-home',
		layout: 'console-layout',
	});
	const { navigationRoutes } = useNavigationRoutes();
	const scrollEl = ref<HTMLElement | null>(null);
	const { x, arrivedState } = useScroll(scrollEl, {
		behavior: 'smooth',
	});
	const activeDescriptionIndex: Ref<number> = ref(1);
	const { getPrincipal } = useAuth();
	const selectedIndexToEdit: Ref<any> = ref(-1);
	const {
		currentPage: page,
		corporateMemberships,
		totalNumber,
		totalPages,
		searchTerm,
		membershipType,
		fetchMembershipsStatus,
		fetchMemberVehiclesLoading,
		memberVehicles,
		getMemberVehicles,
		executeFetchMemberships,
	} = useAVAMemberships();
	const areFiltersOpen: Ref<boolean> = ref(false);

	const { fetchAvaMembersDistributionStatus, computeActiveInactive, computedTotal } =
		useAVAMembershipsCharts();
</script>
