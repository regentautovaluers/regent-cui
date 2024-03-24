<template>
	<!-- <tr
		v-if="fetchErrorOccured"
		class="bg-green-500">
		<td
			colspan="100%"
			class="flex flex-col items-center justify-center h-fit">
			<h1>Fetch error occured</h1>
		</td>
	</tr> -->
	<tr
		class="hover:shadow-lg odd:bg-gray-200/50"
		v-for="(member, i) in membersList"
		:key="i">
		<td class="px-6 py-4 whitespace-nowrap font-semibold text-gray-600">
			{{ member.full_name }}
		</td>
		<td class="px-6 py-4 whitespace-nowrap text-blue-600 font-semibold">
			{{ capitalizeFirstLetter(member.category) }}
		</td>
		<td
			class="px-6 py-4 whitespace-nowrap text-center font-semibold text-pink-500">
			<NuxtLink
				:to="{
					name: 'membership-details',
					query: {
						clientName: member.full_name,
						numberOfVehicles: member.membershipVehicleCount,
						clientPhone: member.phone_number,
						clientEmail: member.userEmail,
						id: member.id,
					},
				}"
				>{{
					member.membershipVehicleCounts.find(
						(data) =>
							data.membership_name ===
							componentProps.defaultFilterFlag
					).vehicleCount
				}}</NuxtLink
			>
		</td>
		<td
			class="px-6 text-center py-4 whitespace-nowrap w-full text-gray-500 font-medium inline-flex flex-col">
			<span class="text-start">{{
				!member.phone_number
					? "Phone Number Not Provided"
					: member.phone_number
			}}</span>
			<span class="text-start">{{
				!member.userEmail ? "Email Not Provided" : member.userEmail
			}}</span>
		</td>
		<td>
			<div class="hs-dropdown relative inline-flex">
				<button
					id="hs-dropdown-hover-event"
					type="button"
					class="hs-dropdown-toggle py-3 px-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1.5em"
						height="2em"
						viewBox="0 0 24 24">
						<path
							fill="none"
							stroke="currentColor"
							stroke-linejoin="round"
							stroke-width="3.75"
							d="M12 12h.01v.01H12zm0-7h.01v.01H12zm0 14h.01v.01H12z" />
					</svg>
				</button>
				<div
					class="hs-dropdown-menu border transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full font-semibold"
					aria-labelledby="hs-dropdown-hover-event">
					<NuxtLink
						:to="{
							name: 'edit-member-details',
							query: {
								memberName: member.full_name,
								memberPhone: member.phone_number,
								memberEmail: member.userEmail,
								memberId: member.id,
							},
						}"
						class="flex items-center gap-x-3.5 p-3 rounded-t-lg text-sm text-blue-700 hover:bg-blue-300 focus:outline-none">
						Edit Details
					</NuxtLink>
					<NuxtLink
						class="flex items-center gap-x-3.5 p-3 rounded-b-lg text-sm text-blue-700 hover:bg-blue-300 focus:outline-none"
						:to="{
							name: 'membership-details',
							query: {
								clientName: member.full_name,
								numberOfVehicles: member.membershipVehicleCount,
								clientPhone: member.phone_number,
								clientEmail: member.userEmail,
								id: member.id,
							},
						}"
						>View Memberships</NuxtLink
					>
				</div>
			</div>
		</td>
	</tr>
</template>

<script setup lang="ts">
	export interface ComponentProps {
		defaultFilterFlag: string;
		activePage: number;
	}

	const componentProps = defineProps<ComponentProps>();
	const { capitalizeFirstLetter } = useUtils();
	const membersList: Ref<object[]> = ref([]);
	const page: Ref<number> = ref(0);
	const size: Ref<number> = ref(10);
	const totalNumber: Ref<number> = ref(0);
	const totalPages: Ref<number> = ref(0);
	const { openToast } = useToast();
	const runtimeConfig = useRuntimeConfig();
	const { getDetails } = usePrincipal();
	const fetchingMoreData: Ref<boolean> = ref(false);
	const fetchErrorOccured: Ref<boolean> = ref(false);
	const emits = defineEmits(["showLoader", "currentPage"]);

	try {
		console.log("Getting list on page load...");
		emits("showLoader", true);
		await $fetch(
			`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/memberships`,
			{
				method: "GET",
				query: {
					corporateId: getDetails.acc_id,
					page: page.value,
					size: size.value,
				},
				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error(
							"Failed to retrieve corporate's members"
						);
					}

					console.log(
						"Received list for page ",
						page.value,
						"on page load..Calling filter"
					);

					totalNumber.value = response._data.totalCount;
					totalPages.value = response._data.totalPages;
					filterMembersRecord(response._data.memberships);

					console.log(
						"On first load: Total number: ",
						totalNumber.value,
						"total Pages: ",
						totalPages.value
					);
				},
			}
		);
	} catch (error) {
		console.log("An error occured: ", error);
		fetchErrorOccured.value = true;
		openToast("Failed to load your members. Reload page!", "danger");
	}

	watch(
		page,
		async (newValue) => {
			console.log("Watcher triggered due to page number change...");
			if (newValue < totalPages.value) {
				console.log(
					"condition for running filter met... will be fetching more data..."
				);
				fetchingMoreData.value = true;
				try {
					await $fetch(
						`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/memberships`,
						{
							method: "GET",
							query: {
								corporateId: getDetails.acc_id,
								page: newValue,
								size: size.value,
							},
							async onResponse({ response }) {
								if (response.status !== 200) {
									throw new Error(
										"Failed to retrieve corporate's members"
									);
								}
								filterMembersRecord(response._data.memberships);
							},
						}
					);
				} catch (error) {
					console.log("An error occured: ", error);
					openToast(
						"Failed to load more members. Reload page!",
						"danger"
					);
				} finally {
					fetchingMoreData.value = false;
				}
			}
		},
		{ immediate: true }
	);

	function filterMembersRecord(records: object[]): void {
		console.log("Filter called and is running...");
		// Filter the memberships array
		const filteredMemberships: object[] = records.filter(
			(membership: any) => {
				return membership.membershipVehicleCounts.some(
					(vehicleCount: any) => {
						return (
							vehicleCount.membership_name ===
							componentProps.defaultFilterFlag
						);
					}
				);
			}
		);

		if (filteredMemberships.length === 0) {
			console.log(
				"After filtering, list is empty.. increasing page size.. watcher should run next..."
			);
			page.value += 1;
			console.log("New page size after increase: ", page.value);
		} else {
			membersList.value = membersList.value.concat(filteredMemberships);
			console.log(
				"After filtering some data was found.. Disabling loader and watcher should not run... Table should have data"
			);
			emits("showLoader", false);
		}
	}
</script>
