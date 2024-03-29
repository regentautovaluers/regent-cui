<template>
	<div class="py-10 h-fit responsive-view">
		<div
			class="flex flex-col lg:flex-row space-x-0 lg:space-x-4 space-y-3 lg:space-y-0">
			<div
				class="w-full lg:w-1/2 md:flex-row rounded-md items-center justify-between p-3 md:px-6 border-2 border-gray-200 shadow-sm space-y-2 md:space-y-0">
				<h1 class="text-2xl antialiased font-semibold">
					{{ clientFullName }}
				</h1>
				<div class="w-fit text-gray-500">
					<h2>
						{{ clientEmail }}
					</h2>
					<h2>+{{ clientPhoneNumber }}</h2>
				</div>
			</div>
			<div
				class="w-full lg:w-1/2 md:flex-row rounded-md items-center justify-between p-3 md:px-6 border-2 border-gray-200 shadow-sm space-y-2 md:space-y-0">
				<h1 class="text-2xl antialiased font-semibold">
					Number of Vehicles
				</h1>
				<h2 class="text-xl text-gray-500">
					{{ numOfVehicles }}
				</h2>
				<div class="py-2 flex justify-end">
					<ActionTriggeredModal trigger-button-name="Add Vehicle">
						<template #activeElement>
							<AddNewVehicle />
						</template>
					</ActionTriggeredModal>
				</div>
			</div>
		</div>

		<!-- start of data table -->
		<div class="flex flex-col mt-5">
			<div class="-m-1.5 overflow-x-auto">
				<div class="p-1.5 min-w-full inline-block align-middle">
					<div class="border rounded-lg shadow overflow-hidden">
						<table class="min-w-full divide-y">
							<thead>
								<tr>
									<th
										scope="col"
										class="px-6 py-3 text-start font-bold text-gray-500">
										Vehicle Registration
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-start font-bold text-gray-500">
										Start Date
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-start font-bold text-gray-500">
										End Date
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-start font-bold text-gray-500">
										Make & Model
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-center font-bold text-gray-500">
										Membership Type
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-start font-bold text-gray-500">
										Membership Status
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-start font-bold text-gray-500">
										Payment Status
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-end" />
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200">
								<Suspense>
									<template #default>
										<MembershipRecord
											@provide-client-details="((fullName: string, email: string, phoneNumber: string, numberOfVehicles: number) => {
												clientFullName = fullName;
												clientPhoneNumber = phoneNumber;
												numOfVehicles = numberOfVehicles;
												clientEmail = email;
										})" />
									</template>
									<template #fallback>
										<MembershipTableLoader
											v-for="a in 5"
											:key="a" />
									</template>
								</Suspense>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		<!-- end of data table -->
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: "membership-details",
		layout: "in-app-layout",
	});
	const clientFullName: Ref<string> = ref("");
	const clientEmail: Ref<string> = ref("");
	const clientPhoneNumber: Ref<string> = ref("");
	const numOfVehicles: Ref<number> = ref(0);
</script>
