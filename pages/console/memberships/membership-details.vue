<template>
	<div class="responsive-view h-fit py-10">
		<div
			class="flex flex-col items-center justify-between space-y-2 rounded-lg border-2 border-gray-200 px-3 py-5 shadow-sm md:flex-row md:space-y-0 md:px-6">
			<div class="flex w-full items-center space-x-2 md:w-fit">
				<img
					class="inline-block size-[60px] rounded-full"
					src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
					alt="User Image" />
				<div class="flex flex-col">
					<span class="font-semibold text-blue-600">{{ clientFullName }} </span>
					<span class="font-semibold text-gray-500"
						>Has {{ numOfVehicles }} Registered Vehicles</span
					>
				</div>
			</div>
			<div class="flex justify-end py-2">
				<ActionTriggeredModal
					modal-title="Add New Vehicle"
					:trigger-button-index="0"
					trigger-button-text="Add Vehicle">
					<template #activeElement>
						<AddNewVehicle />
					</template>
				</ActionTriggeredModal>
			</div>
		</div>

		<!-- start of data table -->
		<div class="mt-5 flex flex-col">
			<div class="-m-1.5 overflow-x-auto">
				<div class="inline-block min-w-full p-1.5 align-middle">
					<div class="overflow-hidden rounded-lg border shadow">
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
									v-for="(record, index) in memberVehiclesList"
									:key="index"
									:membership-id="record.id"
									:vehicle-registration="record.registration"
									:start-date="formatServerProvidedDate(record.start_date)"
									:end-date="formatServerProvidedDate(record.end_date)"
									:vehicle-make="record.make"
									:vehicle-model="record.model"
									:membership-name="
										capitalizeFirstLetterOfEachWord(
											record.membershipType.membership_name,
										)
									"
									:membership-status="
										capitalizeFirstLetter(record.membership_status)
									"
									:payment-status="capitalizeFirstLetter(record.payment_status)"
									:client-name="memberVehiclesList[0].membership.full_name" />
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
		name: 'membership-details',
		layout: 'in-app-layout',
	});
	const clientFullName: Ref<string> = ref('');
	const clientEmail: Ref<string> = ref('');
	const clientPhoneNumber: Ref<string> = ref('');
	const numOfVehicles: Ref<number> = ref(0);
	const runtimeConfig = useRuntimeConfig();
	const { openToast } = useToast();
	const memberVehiclesList: Ref<any[]> = ref([]);
	const route = useRoute();

	useFetch(`/api/v1/membershipVehicles/membership/${route.query.id}`, {
		baseURL: runtimeConfig.public.AVA_BASE_URL,
		method: 'GET',
		server: false,
		lazy: false,
		onResponse({ response }) {
			if (response.status !== 200) {
				throw new Error("Failed to retrieve corporate's members");
			}
			memberVehiclesList.value = response._data;
			clientFullName.value = memberVehiclesList.value[0].membership.full_name;
			clientEmail.value = !memberVehiclesList.value[0].membership.userEmail
				? 'Email not provided'
				: memberVehiclesList.value[0].membership.userEmail;
			clientPhoneNumber.value = memberVehiclesList.value[0].membership.phone_number;
			numOfVehicles.value = memberVehiclesList.value.length;
		},
		onRequestError() {
			openToast('Failed to retrieve member vehicles. Please try again', 'error');
		},
	}) as any;
</script>
