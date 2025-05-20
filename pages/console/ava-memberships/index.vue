<template>
	<div class="console-layout-spacing b grid flex-grow grid-cols-1 lg:grid-cols-[80%,20%]">
		<div
			class="col-span-2 mb-10 flex h-[8rem] items-center justify-between rounded-lg border p-4 shadow-sm">
			<div class="flex items-center space-x-3">
				<img
					class="h-20 w-20 rounded-full"
					:src="profilePicture"
					alt="Rounded avatar" />
				<div class="h-full flex-col overflow-hidden md:flex">
					<h1 class="inline-flex items-center space-x-3">
						<span class="font-semibold text-blue-600"
							>Hi, {{ getPrincipal.username }}</span
						>
						<HandshakeIcon />
					</h1>
					<h2 class="text-gray-500">You Have {{ totalNumber }} Registered Members.</h2>
				</div>
			</div>
			<NuxtLink
				:to="{ name: 'ava-membership-types' }"
				class="generic-nuxt-link hidden text-sm font-normal uppercase md:flex">
				Add a New Member
			</NuxtLink>
		</div>

		<!-- members listing -->

		<!-- div to show when there is a fetch error -->
		<div
			class="flex h-full flex-col items-center justify-center space-y-4 shadow-sm"
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
			class="flex h-full flex-col items-center justify-center space-y-4 shadow-sm"
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
			class="flex h-full flex-col justify-between"
			v-else>
			<!-- search & filter controls -->
			<div class="flex h-fit flex-col space-y-2">
				<div class="flex justify-between">
					<form
						class="relative h-fit w-full md:w-[45%] lg:w-[30%]"
						@submit.prevent="handleSearchTriggered(searchPhrase)">
						<input
							type="text"
							class="generic-input"
							placeholder="Search Client Name"
							v-model="searchPhrase"
							required />
						<button
							type="submit"
							class="absolute right-2 top-0 flex size-14 translate-y-2 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700">
							<SearchIcon />
						</button>
					</form>
				</div>
				<button
					v-if="searchTerm !== ''"
					@click="
						() => {
							searchTerm = '';
							searchPhrase = '';
						}
					"
					class="w-fit rounded-full border border-gray-500 bg-transparent px-2 py-1 text-sm font-semibold text-gray-500 shadow hover:bg-gray-200">
					Clear Filters
				</button>
			</div>

			<!-- the table itself -->
			<div class="my-4 mr-10 flex-grow">
				<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
					<table class="w-full text-left text-gray-500">
						<thead class="bg-gray-100 text-sm uppercase text-gray-700">
							<tr>
								<th
									scope="col"
									class="table-headers">
									Client Name
								</th>
								<th
									scope="col"
									class="table-headers">
									Category
								</th>
								<th
									scope="col"
									class="table-headers">
									Vehicles
								</th>
								<th
									scope="col"
									class="table-headers">
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
									class="whitespace-nowrap p-6 font-medium text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>username</span
									>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>useremail</span
									>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300">one</span>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300"
										>domain role</span
									>
								</td>
								<td class="p-6 text-gray-300">
									<span class="animate-pulse rounded-lg bg-gray-300">button</span>
								</td>
							</tr>
							<tr
								class="border-b bg-white hover:bg-gray-100"
								v-else
								v-for="(member, index) in corporateMemberships"
								:key="index">
								<td
									scope="row"
									class="whitespace-nowrap p-4 font-semibold text-gray-600">
									{{ member.full_name }}
								</td>
								<td class="p-4 text-blue-600">
									{{ stringToTitleCase(member.category) }}
								</td>
								<td class="p-4 font-semibold text-pink-600">
									{{ member.membershipVehicleCount }}
								</td>
								<td class="inline-flex flex-col p-4">
									<span>{{ member.userEmail ?? 'Email N/A' }}</span>
									<span
										class="w-fit rounded-lg bg-pink-200 px-1 text-sm text-pink-600"
										>{{ member.phone_number }}</span
									>
								</td>
								<td class="py-4 pr-2 text-end">
									<button
										:id="'dropdownTopButton' + index"
										:data-dropdown-toggle="'dropdownTop' + index"
										data-dropdown-placement="top"
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
										:id="'dropdownTop' + index"
										class="z-10 hidden w-44 divide-y divide-gray-100 rounded-lg border bg-white shadow-md">
										<ul
											class="py-2 text-sm text-gray-500"
											aria-labelledby="dropdownTopButton">
											<li>
												<button
													class="block w-full px-4 py-2 text-center hover:bg-gray-100"
													type="button"
													@click="
														() => {
															selectedIndexToEdit = index;
															isEditMemberDetailsModalOpen = true;
														}
													">
													Edit Details
												</button>
											</li>
											<li>
												<button
													class="block w-full px-4 py-2 text-center hover:bg-gray-100"
													type="button"
													@click="
														() => {
															getMemberVehicles(member.id);
															isGetVehiclesModalOpen = true;
														}
													">
													View Vehicles
												</button>
											</li>
											<li>
												<button
													class="block w-full px-4 py-2 text-center hover:bg-gray-100"
													type="button"
													@click="
														() => {
															selectedIndexToEdit = index;
															isAddVehiclesModalOpen = true;
														}
													">
													Add Vehicles
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
			<div class="mr-10 mt-5 flex min-h-12 items-center justify-between">
				<h1 class="text-sm font-semibold text-gray-500 md:text-base">
					Showing {{ currentPage + 1 }} of {{ totalPages }} pages.
				</h1>
				<div class="h-full space-x-2 md:space-x-4">
					<button
						class="table-page-buttons"
						@click="currentPage -= 1"
						:disabled="currentPage === 0 || totalPages == 1">
						Previous
					</button>
					<button
						class="table-page-buttons"
						@click="currentPage += 1"
						:disabled="currentPage === totalPages - 1 || totalPages == 1">
						Next
					</button>
				</div>
			</div>
		</div>

		<!-- side-information including chart -->
		<div
			class="xl:grid-cols-0 grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-2 xl:flex xl:flex-col xl:gap-x-0">
			<div
				class="xl:min-h-1/2 flex h-[25rem] min-h-[25rem] flex-col rounded-md border px-5 shadow-sm xl:h-1/2">
				<div class="flex h-14 items-center justify-between">
					<h1 class="text-2xl font-bold">About</h1>
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
						class="z-10 hidden w-44 divide-y divide-gray-100 rounded-lg border bg-white shadow-md">
						<ul
							class="py-2 text-sm text-gray-500"
							aria-labelledby="ava-services-desc">
							<li>
								<button
									class="block w-full px-4 py-2 text-center hover:bg-gray-100"
									type="button"
									@click.prevent="activeDescriptionIndex = 0">
									Roadside Assistance
								</button>
							</li>
							<li>
								<button
									class="block w-full whitespace-nowrap px-4 py-2 text-center hover:bg-gray-100"
									type="button"
									@click.prevent="activeDescriptionIndex = 1">
									Emergency Evacuation
								</button>
							</li>
						</ul>
					</div>
				</div>
				<div class="flex-grow">
					<div class="flex h-fit w-full items-center justify-center">
						<button
							class="inline-flex size-[6rem] items-center justify-center rounded-full bg-pink-500 text-white shadow-sm">
							<MembershipsIcon classes="size-16 text-inherit" />
						</button>
					</div>
					<div class="my-4 w-full text-center">
						<h1 class="text-center text-3xl font-bold">Our Services</h1>
						<h2 class="text-center font-bold text-gray-500">
							{{ regentServices[activeDescriptionIndex].name }}
						</h2>
					</div>

					<p class="text-sm text-gray-500">
						{{ regentServices[activeDescriptionIndex].description }}
					</p>
				</div>
				<div class="flex h-14 items-center border-t pl-3">
					<a
						href="https://ava.ke/"
						target="_blank"
						rel="noopener noreferrer"
						class="text-blue-600 transition-colors duration-300 hover:text-blue-700"
						>Read More</a
					>
				</div>
			</div>
			<div
				class="xl:min-h-1/2 flex h-[25rem] min-h-[25rem] flex-col rounded-md border shadow-sm xl:h-1/2">
				<h1 class="p-5 text-2xl font-bold">Memberships</h1>

				<div
					class="flex h-full items-center justify-center"
					v-if="
						fetchAvaMembersDistributionStatus === 'pending' &&
						!computeActiveInactive.length
					">
					<FormSubmissionLoader classes="size-10 animate-spin text-gray-300" />
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
					:data="computeActiveInactive" />
			</div>
		</div>
	</div>

	<!-- Edit Member details modal -->
	<ParentModal
		v-if="isEditMemberDetailsModalOpen"
		modalId="edit-member-details"
		modalTitle="Edit Member Details"
		@close-modal="
			() => {
				isEditMemberDetailsModalOpen = false;
				selectedIndexToEdit = -1;
			}
		">
		<EditAVAMemberDetails
			:member-id="corporateMemberships[selectedIndexToEdit].id"
			:member-name="corporateMemberships[selectedIndexToEdit].full_name"
			:member-email="corporateMemberships[selectedIndexToEdit].userEmail"
			:member-phone="corporateMemberships[selectedIndexToEdit].phone_number" />
	</ParentModal>

	<!-- Add Vehicles -->
	<ParentModal
		v-if="isAddVehiclesModalOpen"
		modalId="add-member-vehicles"
		modalTitle="Add Vehicles"
		@close-modal="
			() => {
				isAddVehiclesModalOpen = false;
				selectedIndexToEdit = -1;
			}
		">
		<AddMemberVehicle :membership-id="corporateMemberships[selectedIndexToEdit].id" />
	</ParentModal>

	<!-- View Member Vehicles modal -->
	<ParentModal
		v-if="isGetVehiclesModalOpen"
		modalId="member-vehicles"
		modalTitle="Member Vehicles"
		class="relative p-3 py-2 md:p-4"
		@close-modal="
			() => {
				isGetVehiclesModalOpen = false;
				memberVehicles = [];
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
				class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/50 outline-none ring-white group-focus:ring-4">
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
				class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/50 outline-none ring-white group-focus:ring-4">
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
	import { regentServices } from '~/config/regent-services';
	import { useScroll } from '@vueuse/core';

	definePageMeta({
		name: 'ava-memberships-home',
		layout: 'console-layout',
	});

	const scrollEl = ref<HTMLElement | null>(null);
	const { x, arrivedState } = useScroll(scrollEl, {
		behavior: 'smooth',
	});
	const activeDescriptionIndex: Ref<number> = ref(0);
	const profilePicture: Ref<string> = ref('');
	const { getPrincipal } = useAuth();
	const searchPhrase: Ref<string> = ref('');
	const isGetVehiclesModalOpen: Ref<boolean> = ref(false);
	const selectedIndexToEdit: Ref<any> = ref(-1);
	const isEditMemberDetailsModalOpen: Ref<boolean> = ref(false);
	const isAddVehiclesModalOpen: Ref<boolean> = ref(false);
	const {
		currentPage,
		corporateMemberships,
		totalNumber,
		totalPages,
		searchTerm,
		fetchMembershipsStatus,
		fetchMemberVehiclesLoading,
		memberVehicles,
		getMemberVehicles,
		handleSearchTriggered,
	} = useAVAMemberships();

	const { fetchAvaMembersDistributionStatus, computeActiveInactive } = useAVAMembershipsCharts();

	onMounted(() => (profilePicture.value = getPrincipal.value.profilePicture));
</script>
