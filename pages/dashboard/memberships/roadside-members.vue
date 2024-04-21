<template>
	<div class="py-10 h-fit responsive-view">
		<h1 class="my-5 text-2xl antialiased font-semibold">
			Roadside Assistance Members
		</h1>
		<!-- download as PDF section -->
		<div
			class="flex items-center justify-between mb-6 overflow-x-auto flex-nowrap"></div>
		<!-- start of data table -->
		<div class="flex flex-col">
			<div class="-m-1.5 overflow-x-auto">
				<div class="p-1.5 min-w-full inline-block align-middle">
					<div class="border rounded-lg shadow overflow-hidden">
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
								<FilteredMembersRecord
									v-for="(member, index) in membersList"
									:key="index"
									:client-name="member.full_name"
									:membership-category="member.category"
									:vehicle-count="
										member.membershipVehicleCounts.find(
											(data: any) =>
												data.membership_name ===
												'Roadside Assistance'
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
		<div class="mt-2 w-full rounded-sm flex justify-end items-center py-2">
			<button
				type="button"
				v-if="page + 1 < totalPages"
				@click="page += 1"
				class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700">
				<span v-if="!fetchingMoreData">Load More</span>
				<div
					v-if="fetchingMoreData"
					class="animate-spin inline-block size-5 border-[3px] border-white border-current border-t-transparent text-gray-800 rounded-full"
					role="status"
					aria-label="loading" />
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: "roadside-members",
		layout: "in-app-layout",
	});

	const { membersList, page, totalPages, fetchingMoreData } =
		await useFilteredMemberships();
</script>
