<template>
	<div class="py-10 h-fit responsive-view">
		<div
			class="flex flex-col lg:flex-row space-x-0 lg:space-x-4 space-y-3 lg:space-y-0">
			<div
				class="w-full lg:w-1/2 md:flex-row rounded-md items-center justify-between py-3 px-3 md:px-6 border-2 border-gray-200 shadow-sm space-y-2 md:space-y-0">
				<h1 class="text-2xl antialiased font-semibold">
					{{ $route.query.clientName }}
				</h1>
				<div class="w-fit text-gray-500">
					<h2>{{ $route.query.clientEmail }}</h2>
					<h2>{{ $route.query.clientPhone }}</h2>
				</div>
			</div>
			<div
				class="w-full lg:w-1/2 md:flex-row rounded-md items-center justify-between py-3 px-3 md:px-6 border-2 border-gray-200 shadow-sm space-y-2 md:space-y-0">
				<h1 class="text-2xl antialiased font-semibold">
					Number of Vehicles
				</h1>
				<h2 class="text-xl text-gray-500">
					{{ $route.query.numberOfVehicles }}
				</h2>
			</div>
		</div>

		<!-- start of data table -->
		<div class="flex flex-col mt-5">
			<div class="-m-1.5 overflow-x-auto">
				<div class="p-1.5 min-w-full inline-block align-middle">
					<div class="border rounded-sm shadow overflow-hidden">
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
								<MembershipRecord
									v-for="(
										record, index
									) in memberVehiclesList"
									:key="index"
									:client-name="$route.query.clientName as string"
									:membership-id="record.id"
									:membership-type="
										record.membershipType.membership_name
									"
									:payment-status="record.payment_status"
									:membership-status="
										record.membership_status
									"
									:vehicle-model="record.model"
									:vehicle-make="record.make"
									:membership-end-date="record.end_date"
									:membership-start-date="record.start_date"
									:vehicle-registration="
										record.registration
									" />
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

	const { openToast } = useToast();
	const route = useRoute();
	const memberVehiclesList: Ref<object[] | null> = ref(null);
	const runtimeConfig = useRuntimeConfig();

	onMounted(async () => {
		try {
			await $fetch(
				`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/membershipVehicles/membership/${route.query.id}`,
				{
					method: "GET",
					async onResponse({ response }) {
						if (response.status !== 200) {
							throw new Error(
								"Failed to retrieve corporate's members"
							);
						}
						memberVehiclesList.value = response._data;
					},
				}
			);
		} catch (error) {
			console.log("An error occured: ", error);
			openToast("Failed to load your members. Reload page!", "danger");
		}
	});
</script>
