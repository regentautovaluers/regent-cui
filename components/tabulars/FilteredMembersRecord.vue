<template>
	<tr
		class="hover:shadow-lg odd:bg-gray-100"
		v-for="(member, i) in membersList"
		:key="i">
		<td class="px-6 py-4 whitespace-nowrap font-semibold text-gray-600">
			{{ i + 1 }}
		</td>
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
			<span class="text-end">{{
				!member.phone_number
					? "Phone Number Not Provided"
					: member.phone_number
			}}</span>
			<span class="text-end">{{
				!member.userEmail ? "Email Not Provided" : member.userEmail
			}}</span>
		</td>
		<td class="text-end px-2">
			<div class="inline-flex rounded-lg shadow-sm">
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
					class="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-full first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 whitespace-nowrap overflow-hidden text-overflow-ellipsis">
					Edit Details
				</NuxtLink>
				<NuxtLink
					:to="{
						name: 'membership-details',
						query: {
							id: member.id,
						},
					}"
					class="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-full first:ms-0 last:rounded-e-full text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 whitespace-nowrap overflow-hidden text-overflow-ellipsis">
					View Vehicles
				</NuxtLink>
			</div>
		</td>
	</tr>
</template>

<script setup lang="ts">
	const componentProps = defineProps<{
		defaultFilterFlag: string;
		activePage: number;
	}>();
	const { capitalizeFirstLetter } = useUtils();
	const membersList: Ref<object[]> = ref([]);
	const page = computed(() => componentProps.activePage);
	const size: Ref<number> = ref(10);
	const totalNumber: Ref<number> = ref(0);
	const totalPages: Ref<number> = ref(0);
	const { openToast } = useToast();
	const runtimeConfig = useRuntimeConfig();
	const { getDetails } = usePrincipal();
	const fetchingMoreData: Ref<boolean> = ref(false);
	const fetchErrorOccured: Ref<boolean> = ref(false);
	const fetchedPages: Ref<number[]> = ref([]);
	const emits = defineEmits([
		"showLoader",
		"provideStatistics",
		"updateCurrentPage",
	]);

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

					// we add page 0 to the list of fetchedPages so that we dont fetch it again
					fetchedPages.value.push(0);

					emits("provideStatistics", totalPages.value);
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
			emits("updateCurrentPage", newValue);
			console.log("Watcher triggered due to page number change...");
			if (
				!fetchedPages.value.includes(newValue) &&
				newValue < totalPages.value
			) {
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
			// page.value += 1;
			emits("updateCurrentPage");
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
