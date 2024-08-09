<template>
	<div class="responsive-view h-fit py-10">
		<h1 class="my-5 text-2xl font-semibold antialiased">Emergency Rescue Members</h1>
		<!-- download as PDF section -->
		<div class="mb-6 flex flex-nowrap items-center justify-between overflow-x-auto"></div>
		<!-- start of data table -->
		<div class="flex flex-col">
			<div class="-m-1.5 overflow-x-auto">
				<div class="inline-block min-w-full p-1.5 align-middle">
					<div class="overflow-hidden rounded-lg border shadow">
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
								<FilteredMembersRecord
									v-for="(member, index) in membersList"
									:key="index"
									:client-name="member.full_name"
									:membership-category="member.category"
									:vehicle-count="
										member.membershipVehicleCounts.find(
											(data: any) =>
												data.membership_name === 'Emergency Evacuation',
										).vehicleCount
									"
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
		<div class="mt-2 flex w-full items-center justify-end rounded-sm py-2">
			<button
				v-if="page + 1 < totalPages"
				type="button"
				@click="page += 1"
				class="inline-flex items-center gap-x-2 rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
				<span v-if="!fetchingMoreData">Load More</span>
				<div
					v-if="fetchingMoreData"
					class="inline-block size-5 animate-spin rounded-full border-[3px] border-current border-white border-t-transparent text-gray-800"
					role="status"
					aria-label="loading" />
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'emergency-members',
		layout: 'in-app-layout',
	});

	const { membersList, page, totalPages, fetchingMoreData, fetchErrorOrEmpty } =
		await useFilteredMemberships();
</script>
