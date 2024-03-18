<template>
	<div class="py-10 h-fit responsive-view">
		<h1 class="my-5 text-2xl antialiased font-semibold">
			Roadside Assistance Members
		</h1>
		<!-- start of data table -->
		<div class="flex flex-col">
			<div class="-m-1.5 overflow-x-auto">
				<div class="p-1.5 min-w-full inline-block align-middle">
					<div class="border rounded-sm shadow overflow-hidden">
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
										Type
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-center font-bold text-gray-500">
										Vehicles
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-start font-bold text-gray-500">
										Contacts
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-end" />
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200">
								<MembersTableLoader v-if="displayLoader" />
								<MembersRecord
									v-else-if="
										!displayLoader &&
										filteredList?.length > 1
									"
									v-for="(member, index) in filteredList"
									:key="index"
									:member-name="member.full_name"
									:membership-category="member.category"
									:id="member.id"
									:number-of-vehicles="
										member.membershipVehicleCount
									"
									:member-email="
										!member.userEmail
											? 'Email not provided'
											: member.userEmail
									"
									:member-phone="
										!member.phone_number
											? 'Phone number not provided'
											: member.phone_number
									" />
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		<!-- end of data table -->
		<div class="mt-2 w-full rounded-sm flex justify-between py-2">
			<span>Showing from {{ totalNumber }} possible members.</span>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: "roadside-members",
		layout: "in-app-layout",
	});
	const runtimeConfig = useRuntimeConfig();
	const page: Ref<number> = ref(0);
	const size: Ref<number> = ref(100);
	const { getDetails } = usePrincipal();
	const membersList: Ref<object[] | null> = ref(null);
	const totalNumber: Ref<number> = ref(0);
	const { openToast } = useToast();
	const displayLoader: Ref<boolean> = ref(false);

	try {
		displayLoader.value = true;
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
					membersList.value = response._data.memberships;
					totalNumber.value = response._data.totalCount;

					// disable loader
					displayLoader.value = false;
				},
			}
		);
	} catch (error) {
		console.log("An error occured: ", error);
		openToast("Failed to load your members. Reload page!", "danger");
	}

	const filteredList = computed(() => {
		// Check if the data object has a memberships array
		if (!membersList.value) {
			return [];
		}

		// Filter the memberships array
		const filteredMemberships = membersList.value.filter(
			(membership: any) => {
				// Use the some method to check if any object in the membershipVehicleCounts array
				// has the membership_name field equal to "Roadside Assistance"
				return membership.membershipVehicleCounts.some(
					(vehicleCount: any) => {
						return (
							vehicleCount.membership_name ===
							"Roadside Assistance"
						);
					}
				);
			}
		);

		return filteredMemberships;
	});
</script>
