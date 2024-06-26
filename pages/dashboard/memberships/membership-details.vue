<template>
	<div class="py-10 h-fit responsive-view">
		<div
			class="flex flex-col md:flex-row items-center justify-between py-5 px-3 md:px-6 border-2 border-gray-200 shadow-sm space-y-2 md:space-y-0 rounded-lg">
			<div class="flex space-x-2 items-center w-full md:w-fit">
				<img
					class="inline-block size-[60px] rounded-full"
					src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
					alt="User Image" />
				<div class="flex flex-col">
					<span class="text-blue-600 font-semibold"
						>{{ clientFullName }}
					</span>
					<span class="font-semibold text-gray-500"
						>Has {{ numOfVehicles }} Registered Vehicles</span
					>
				</div>
			</div>
			<div class="py-2 flex justify-end">
				<ActionTriggeredModal trigger-button-name="Add Vehicle">
					<template #activeElement>
						<AddNewVehicle />
					</template>
				</ActionTriggeredModal>
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
			`/api/v1/membershipVehicles/membership/${route.query.id}`,
			{
				baseURL: runtimeConfig.public.VALUATION_BASE_URL,
				method: "GET",
				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error(
							"Failed to retrieve corporate's members"
						);
					}
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
