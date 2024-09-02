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
						<span class="font-semibold text-blue-600">Hi, John Doe</span>
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
						fill="currentColor"
						d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4" />
				</svg>
				<div>
					<h1 class="font-semibold">Registered Members</h1>
					<h2>{{ totalNumber }}</h2>
					<NuxtLink
						:to="{ name: 'ra-all-incidents' }"
						class="text-blue-600 hover:text-blue-700">
						View Members
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
					<h1 class="font-semibold">Ongoing Requests</h1>
					<h2>Lorem</h2>
					<NuxtLink
						:to="{ name: 'ra-all-incidents' }"
						class="text-blue-600 hover:text-blue-700">
						View Ongoing
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
					<h2>Lorem</h2>
					<NuxtLink
						:to="{ name: 'ra-all-incidents' }"
						class="text-blue-600 hover:text-blue-700">
						View Completed
					</NuxtLink>
				</div>
			</div>
		</div>

		<!-- Requests quick links -->
		<div class="mt-4 flex h-fit items-center justify-between space-x-3 overflow-auto">
			<NuxtLink
				:to="{ name: 'ra-fueldelivery-request' }"
				class="ava-services-quicklinks group">
				<FuelDeliveryServiceIcon
					color="#1c64f2"
					:classes="['size-12']" />
				<span class="text-lg">Fuel Delivery</span></NuxtLink
			>
			<NuxtLink
				:to="{ name: 'ra-jumpstarting-request' }"
				class="ava-services-quicklinks">
				<JumpstartingServiceIcon
					color="#1c64f2"
					:classes="['size-12']" />
				<span class="text-lg">Jumpstarting</span></NuxtLink
			>
			<NuxtLink
				:to="{ name: 'ra-jumpstarting-request' }"
				class="ava-services-quicklinks">
				<TyrechangeServiceIcon
					color="#1c64f2"
					:classes="['size-12']" />
				<span class="text-lg">Tyrechange</span></NuxtLink
			>
			<NuxtLink
				:to="{ name: 'ra-jumpstarting-request' }"
				class="ava-services-quicklinks">
				<TowingServiceIcon
					color="#1c64f2"
					:classes="['size-12']" />
				<span class="text-lg">Towing</span></NuxtLink
			>
		</div>

		<!-- Side information -->
		<div class="mt-4 grid flex-grow grid-cols-1 gap-4 lg:grid-cols-[.2fr,.8fr]">
			<!-- side-information including chart -->
			<div
				class="xl:grid-cols-0 grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2 xl:flex xl:flex-col xl:gap-x-0">
				<div
					class="xl:max-h-1/2 flex h-[25rem] flex-col rounded-md border shadow-sm xl:h-1/2">
					<h1>Hello world</h1>
				</div>
				<div
					class="xl:max-h-1/2 flex h-[25rem] flex-col rounded-md border shadow-sm xl:h-1/2">
					<h1>Hello world again</h1>
				</div>
			</div>
			<!-- members listing -->
			<div>
				<!-- TODO: Find a fix for the abort controller signal error -->
				<!-- div to show when there is a fetch error -->
				<div
					v-if="fetchMembershipsStatus === 'error'"
					class="flex h-full flex-col items-center justify-center space-y-4 rounded-lg border shadow-sm md:min-h-[50.5rem]">
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
					class="flex h-full flex-col items-center justify-center space-y-4 rounded-lg border shadow-sm md:min-h-[50.5rem]"
					v-else-if="
						fetchMembershipsStatus === 'success' && membersListSlice.length === 0
					">
					<BirdieNotFoundIcon />
					<h1 class="font-semibold text-gray-500">
						Oops! Seems like you have no members!
					</h1>
					<NuxtLink
						:to="{ name: 'ava-membership-types' }"
						class="generic-nuxt-link">
						Onboard AVA Member
					</NuxtLink>
				</div>

				<!-- div to show when there are members -->
				<div
					class="flex h-full flex-col justify-between md:min-h-[50.5rem]"
					v-else>
					<!-- search & filter controls -->
					<div class="flex h-fit items-center justify-between">
						<form
							class="relative h-fit w-full md:w-[45%] lg:w-[30%]"
							@submit.prevent="">
							<input
								type="text"
								class="generic-input"
								placeholder="Search Name, Email or Phone"
								disabled />
							<button
								type="submit"
								class="absolute right-0 top-0 flex size-14 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500"
								disabled>
								<SearchIcon />
							</button>
						</form>
					</div>

					<!-- the table itself -->
					<div class="my-4 flex-grow">
						<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
							<table class="w-full text-left text-gray-500">
								<thead class="bg-gray-100 text-xs uppercase text-gray-700">
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
											Client Phone
										</th>
										<th
											scope="col"
											class="table-headers">
											Client Email
										</th>
										<th
											scope="col"
											class="table-headers" />
									</tr>
								</thead>
								<tbody>
									<tr
										class="border-b bg-white hover:bg-gray-100"
										v-for="(member, index) in membersListSlice"
										:key="index">
										<td
											scope="row"
											class="whitespace-nowrap p-6 font-semibold text-gray-600">
											{{ member.full_name }}
										</td>
										<td class="p-6 text-blue-600">
											{{ stringToTitleCase(member.category) }}
										</td>
										<td class="p-6 font-semibold text-pink-600">
											{{ member.membershipVehicleCount }}
										</td>
										<td class="p-6">{{ member.phone_number }}</td>
										<td
											scope="row"
											class="whitespace-nowrap p-6 font-medium text-gray-600">
											{{ member.userEmail ?? 'N/A' }}
										</td>
										<td class="flex items-center justify-end p-6">
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
											<span class="animate-pulse rounded-lg bg-gray-300"
												>one</span
											>
										</td>
										<td class="p-6 text-gray-300">
											<span class="animate-pulse rounded-lg bg-gray-300"
												>domain role</span
											>
										</td>
										<td class="p-6 text-gray-300">
											<span class="animate-pulse rounded-lg bg-gray-300"
												>accactive</span
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
							Showing {{ currentPage + 1 }} of {{ totalPages }} pages.
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
			:member-id="membersListSlice[selectedIndexToEdit].id"
			:member-name="membersListSlice[selectedIndexToEdit].full_name"
			:member-email="membersListSlice[selectedIndexToEdit].userEmail"
			:member-phone="membersListSlice[selectedIndexToEdit].phone_number" />
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
		<AddMemberVehicle :membership-id="membersListSlice[selectedIndexToEdit].id" />
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
	import { useScroll } from '@vueuse/core';
	definePageMeta({
		name: 'ra-home',
		layout: 'console-layout',
	});

	const scrollEl = ref<HTMLElement | null>(null);
	const { x, arrivedState } = useScroll(scrollEl, {
		behavior: 'smooth',
	});

	const profilePicture: Ref<string> = ref('');
	const { getPrincipal } = useAuth();
	const isGetVehiclesModalOpen: Ref<boolean> = ref(false);
	const selectedIndexToEdit: Ref<any> = ref(-1);
	const isEditMemberDetailsModalOpen: Ref<boolean> = ref(false);
	const isAddVehiclesModalOpen: Ref<boolean> = ref(false);
	const {
		currentPage,
		membersListSlice,
		totalNumber,
		totalPages,
		fetchMembershipsStatus,
		fetchMemberVehiclesLoading,
		memberVehicles,
		getMemberVehicles,
	} = useAVAMemberships();

	onMounted(() => (profilePicture.value = getPrincipal.value.profilePicture));
</script>
