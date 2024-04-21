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
										class="px-6 py-3 text-center font-bold text-gray-500">
										Make
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-center font-bold text-gray-500">
										Model
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
									:membership-id="record.id"
									:vehicle-registration="record.registration"
									:start-date="
										formatServerProvidedDate(
											record.start_date
										)
									"
									:end-date="
										formatServerProvidedDate(
											record.end_date
										)
									"
									:vehicle-make="record.make"
									:vehicle-model="record.model"
									:membership-name="
										capitalizeFirstLetterOfEachWord(
											record.membershipType
												.membership_name
										)
									"
									:membership-status="
										capitalizeFirstLetter(
											record.membership_status
										)
									"
									:payment-status="
										capitalizeFirstLetter(
											record.payment_status
										)
									"
									:client-name="
										memberVehiclesList[0].membership
											.full_name
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
	const clientFullName: Ref<string> = ref("");
	const clientEmail: Ref<string> = ref("");
	const clientPhoneNumber: Ref<string> = ref("");
	const numOfVehicles: Ref<number> = ref(0);
	const runtimeConfig = useRuntimeConfig();
	const { openToast } = useToast();
	const {
		capitalizeFirstLetterOfEachWord,
		capitalizeFirstLetter,
		formatServerProvidedDate,
	} = useUtils();
	const memberVehiclesList: Ref<any[]> = ref([]);
	const route = useRoute();

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
					console.log(
						"Retrieved data: ",
						JSON.stringify(response._data, null, 2)
					);
					memberVehiclesList.value = response._data;
					clientFullName.value =
						memberVehiclesList.value[0].membership.full_name;
					clientEmail.value = !memberVehiclesList.value[0].membership
						.userEmail
						? "Email not provided"
						: memberVehiclesList.value[0].membership.userEmail;
					clientPhoneNumber.value =
						memberVehiclesList.value[0].membership.phone_number;
					numOfVehicles.value = memberVehiclesList.value.length;
				},
			}
		);
	} catch (error) {
		console.log("An error occured: ", error);
		openToast("Failed to load your members. Reload page!", "danger");
	}
</script>
