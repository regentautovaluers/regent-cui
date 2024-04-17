<template>
	<tr
		class="hover:shadow-lg odd:bg-gray-100"
		v-for="(member, i) in computedPagedList"
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
						id: member.id,
					},
				}"
				>{{ member.membershipVehicleCount }}</NuxtLink
			>
		</td>
		<td
			class="px-6 py-4 whitespace-nowrap w-full text-gray-500 font-medium inline-flex flex-col">
			<span class="text-end">{{
				!member.phone_number
					? "Phone Number Not Provided"
					: `+${member.phone_number}`
			}}</span>
			<span class="text-end">{{
				!member.userEmail ? "Email Not Provided" : member.userEmail
			}}</span>
		</td>
		<td class="text-end px-2">
			<div class="inline-flex rounded-lg shadow-sm">
				<NuxtLink
					v-if="
						getDetails.userlevel === 'admin' ||
						getDetails.userlevel === 'broker'
					"
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
		currentPage: number;
		searchTerm: string | null;
		membershipCategory: any;
	}>();
	const { capitalizeFirstLetter } = useUtils();
	const membersList: Ref<object[]> = ref([]);
	const page: Ref<number> = computed(() => componentProps.currentPage);
	const size: Ref<number> = ref(10);
	const totalNumber: Ref<number> = ref(0);
	const totalPages: Ref<number> = ref(0);
	const { openToast } = useToast();
	const runtimeConfig = useRuntimeConfig();
	const { getDetails } = usePrincipal();
	const fetchErrorOccured: Ref<boolean> = ref(false);
	const emits = defineEmits([
		"provideStatistics",
		"nextPageLoaded",
		"resetStatistics",
		"fetchFailed",
	]);
	const fetchedPages: Ref<number[]> = ref([]);

	// for filtering purposes
	const filterBySearchTerm: ComputedRef<string | null> = computed(
		() => componentProps.searchTerm
	);
	const filterByMembershipCat: ComputedRef<string | null> = computed(
		() => componentProps.membershipCategory
	);

	watch([filterBySearchTerm, filterByMembershipCat], async (newValues) => {
		if (newValues[0] !== null || newValues[1] !== null) {
			// before querying for anything, reset the values set by the inital load or default page loads
			membersList.value = [];
			totalPages.value = 0;
			fetchedPages.value = [];

			// emit even to tell parent to reset the counters it is tracking
			emits("resetStatistics");

			try {
				await $fetch(
					`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/memberships`,
					{
						method: "GET",
						query: {
							corporateId: getDetails.company,
							page: page.value,
							size: size.value,
							...(newValues[0] !== null
								? { searchTerm: newValues[0] }
								: {}),
							...(newValues[1] !== null
								? { category: newValues[1] }
								: {}),
						},
						async onResponse({ response }) {
							if (response.status !== 200) {
								throw new Error(
									"Failed to retrieve filtered corporate's members"
								);
							}
							membersList.value = response._data.memberships;
							totalPages.value = response._data.totalPages;

							// we add page 0 to the list of fetchedPages so that when then user scrolls through the pages,
							// we dont fetch it again
							fetchedPages.value.push(0);

							emits(
								"provideStatistics",
								totalNumber.value,
								totalPages.value
							);
						},
					}
				);
			} catch (error) {
				console.log("An error occured: ", error);
				fetchErrorOccured.value = true;
				openToast(
					"Failed to load filtered members. Reload page!",
					"danger"
				);
			}
		}
	});

	const computedPagedList = computed(() => {
		const start = (page.value + 1 - 1) * size.value;
		const end = start + size.value;

		if (membersList.value?.length !== 0) {
			if (membersList.value?.length < 1) {
				return membersList.value;
			} else {
				return membersList.value?.slice(start, end);
			}
		}
	});

	try {
		await $fetch(
			`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/memberships`,
			{
				method: "GET",
				query: {
					corporateId: getDetails.company,
					page: page.value,
					size: size.value,
				},
				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error(
							"Failed to retrieve corporate's members"
						);
					}
					membersList.value = response._data.memberships;
					totalNumber.value = response._data.totalCount;
					totalPages.value = response._data.totalPages;

					// we add page 0 to the list of fetchedPages so that when then user scrolls through the pages,
					// we dont fetch it again
					fetchedPages.value.push(0);

					emits(
						"provideStatistics",
						totalNumber.value,
						totalPages.value
					);
				},
			}
		);
	} catch (error) {
		console.log("An error occured: ", error);
		fetchErrorOccured.value = true;
		openToast("Failed to load your members. Reload page!", "danger");
		emits("fetchFailed");
	}

	watch(page, async (newValue, oldValue) => {
		if (fetchedPages.value.includes(newValue)) {
			return;
		} else if (
			newValue > oldValue &&
			!fetchedPages.value.includes(newValue)
		) {
			fetchedPages.value.push(newValue);
			try {
				await $fetch(
					`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/memberships`,
					{
						method: "GET",
						query: {
							corporateId: getDetails.company,
							page: newValue,
							size: size.value,
							...(filterBySearchTerm.value !== null
								? { searchTerm: filterBySearchTerm.value }
								: {}),
							...(filterByMembershipCat.value !== null
								? { category: filterByMembershipCat.value }
								: {}),
						},
						async onResponse({ response }) {
							if (response.status !== 200) {
								throw new Error(
									"Failed to retrieve corporate's members"
								);
							}
							membersList.value = membersList?.value?.concat(
								response._data.memberships
							);

							emits("nextPageLoaded");
						},
					}
				);
			} catch (error) {
				console.log("An error occured: ", error);
				openToast(
					"Failed to load more members. Reload page!",
					"danger"
				);
				emits("fetchFailed");
			}
		}
	});
</script>
