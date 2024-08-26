<template>
	<div class="flex h-full flex-col">
		<div class="flex h-[6rem] items-center justify-between rounded-lg border p-4 shadow-sm">
			<div class="flex items-center space-x-3">
				<img
					class="h-12 min-h-12 w-12 min-w-12 rounded-full"
					:src="profilePicture"
					alt="Rounded avatar" />
				<div class="h-full flex-col overflow-hidden md:flex">
					<h1 class="inline-flex items-center space-x-3">
						<span class="font-semibold text-blue-600"
							>Hi, {{ getPrincipal.username }}</span
						>
						<HandshakeIcon />
					</h1>
					<h2>You Have {{ totalNumber }} Registered Members.</h2>
				</div>
			</div>
			<NuxtLink
				:to="{ name: 'ava-membership-types' }"
				class="generic-nuxt-link hidden md:flex">
				Onboard Member
			</NuxtLink>
		</div>
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
					<div class="flex h-fit items-center justify-between">
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
					</div>

					<!-- the table itself -->
					<div class="my-4 flex-grow">
						<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
							<table class="w-full text-left text-gray-500">
								<thead class="bg-gray-100 text-sm uppercase text-gray-700">
									<tr>
										<th
											scope="col"
											class="table-headers">
											Membership Number
										</th>
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
											class="table-headers" />
									</tr>
								</thead>
								<tbody>
									<tr
										class="border-b bg-white hover:bg-gray-100"
										v-for="(member, index) in membersList"
										:key="index">
										<td
											scope="row"
											class="whitespace-nowrap p-6 font-medium text-gray-600">
											{{ member.membership_number }}
										</td>
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
												</ul>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<!-- page controls -->
					<div class="flex h-12 items-center justify-between">
						<h1 class="text-sm font-semibold text-gray-500 md:text-base">
							Showing {{ currentPage }} of {{ totalPages }} pages.
						</h1>
						<div class="h-full space-x-2 md:space-x-4">
							<button class="table-page-buttons">Previous</button>
							<button class="table-page-buttons">Next</button>
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
						<h1 class="text-2xl font-extrabold">About</h1>
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
						<div class=""></div>
						<h1 class="text-center text-2xl font-extrabold">Our Services</h1>
						<h2 class="text-center text-lg font-extrabold text-gray-500">
							{{ avaServices[activeDescriptionIndex].name }}
						</h2>
						<p class="mx-4 text-gray-500">
							{{ avaServices[activeDescriptionIndex].description }}
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
					class="xl:max-h-1/2 flex h-[25rem] flex-col rounded-md border shadow-sm xl:h-1/2">
					<div class="flex h-14 min-h-14 w-full items-center justify-between px-3">
						<h1 class="text-2xl font-extrabold">Memberships</h1>
					</div>
					<div
						class="mx-0 flex-grow"
						id="donut-chart"></div>
					<div class="h-14 min-h-14 border-t pl-3"></div>
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
			:member-id="membersList[selectedIndexToEdit].id"
			:member-name="membersList[selectedIndexToEdit].full_name"
			:member-email="membersList[selectedIndexToEdit].userEmail"
			:member-phone="membersList[selectedIndexToEdit].phone_number" />
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
	import { avaServices } from '~/data';
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
	const isGetVehiclesModalOpen: Ref<boolean> = ref(false);
	const selectedIndexToEdit: Ref<any> = ref(-1);
	const isEditMemberDetailsModalOpen: Ref<boolean> = ref(false);
	const {
		currentPage,
		membersList,
		totalNumber,
		totalPages,
		fetchMembershipsStatus,
		fetchMemberVehiclesLoading,
		memberVehicles,
		getMemberVehicles,
		refreshMembers,
	} = useAVAMemberships();

	onMounted(() => (profilePicture.value = getPrincipal.value.profilePicture));
</script>
