<template>
	<form
		action=""
		@submit.prevent="addVehicleToMember">
		<h1 class="font-bold text-gray-800">Select Membership Type</h1>
		<ClientOnly>
			<div class="w-full">
				<select
					class="py-3 px-4 pe-9 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					id="payment-status"
					required
					v-model="userVehicles.membershipTypeId">
					<option
						v-for="(type, i) in membershipTypes"
						:key="i"
						:value="type.id">
						{{ type.membership_name }}
					</option>
				</select>
			</div>
		</ClientOnly>
		<h1 class="mt-2 font-bold text-gray-800">Provide Vehicle Details</h1>
		<div class="mt-2">
			<!-- this field is hidden. it holds the data for membershipTypeId -->
			<input
				type="text"
				hidden
				v-model="userVehicles.membershipTypeId" />
			<div
				class="flex flex-col lg:flex-row items-center justify-between space-x-0 lg:space-x-3 space-y-3 lg:space-y-0 mt-2">
				<!-- Vehicle Make -->
				<div class="w-full lg:w-1/2">
					<label
						for="vehicle-make"
						class="block font-medium dark:text-white"
						>Vehicle Make</label
					>
					<input
						type="text"
						id="vehicle-make"
						class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
						placeholder="e.g Toyota"
						required
						v-model="userVehicles.make" />
				</div>

				<!-- Vehicle Model -->
				<div class="w-full lg:w-1/2">
					<label
						for="vehicle-model"
						class="block font-medium dark:text-white"
						>Vehicle Model</label
					>
					<input
						type="text"
						id="vehicle-model"
						class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
						placeholder="e.g Corolla"
						required
						v-model="userVehicles.model" />
				</div>
			</div>
			<div class="flex items-center justify-between space-x-2 my-2">
				<!--Vehicle Color Field -->
				<div class="w-1/2">
					<label
						for="full-name"
						class="block font-medium dark:text-white"
						>Vehicle Color</label
					>
					<input
						type="text"
						id="full-name"
						class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
						placeholder="e.g Red"
						required
						v-model="userVehicles.color" />
				</div>

				<div class="w-1/2">
					<label
						for="vehicle-registration-number"
						class="block font-medium dark:text-white"
						>Registration Number</label
					>
					<input
						type="text"
						id="vehicle-registration-number"
						class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
						placeholder="KCD 345G"
						required
						v-model="userVehicles.registration" />
				</div>
			</div>

			<div class="flex items-center justify-between mt-2 space-x-2">
				<!-- Payment Status Field -->
				<div class="w-full">
					<label
						for="payment-status"
						class="block font-medium dark:text-white"
						>Payment Status</label
					>
					<select
						class="py-3 px-4 pe-9 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
						id="payment-status"
						required
						v-model="userVehicles.payment_status">
						<option value="">Select a Payment Status</option>
						<option
							v-for="(status, index) in ['Paid', 'Not Paid']"
							:key="index"
							:value="status.toLocaleLowerCase()">
							{{ status }}
						</option>
					</select>
				</div>
				<!-- Payment Status Field -->
				<div class="w-full">
					<label
						for="membership-status"
						class="block font-medium dark:text-white"
						>Membership Status</label
					>
					<select
						class="py-3 px-4 pe-9 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
						id="membership-status"
						required
						v-model="userVehicles.membership_status">
						<option value="">Select a Membership Status</option>
						<option
							v-for="(status, index) in ['Active', 'Inactive']"
							:key="index"
							:value="status.toLocaleLowerCase()">
							{{ status }}
						</option>
					</select>
				</div>
			</div>
			<!-- Cover Period -->
			<div class="flex items-center justify-between space-x-3 mt-3">
				<!-- Starting date Field -->
				<div class="w-1/2">
					<label
						for="cover-period-starts"
						class="block font-medium dark:text-white"
						>Cover Period Starts</label
					>
					<input
						type="date"
						id="cover-period-starts"
						class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
						placeholder="Enter Customer Name as Seen In Their National ID"
						pattern="\d{4}-\d{2}-\d{2}"
						required
						v-model="userVehicles.start_date" />
				</div>

				<!-- Ending date Field -->
				<div class="w-1/2">
					<label
						for="cover-period-ends"
						class="block font-medium dark:text-white"
						>Cover Period Ends</label
					>
					<input
						type="date"
						id="cover-period-ends"
						class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
						placeholder="Enter Customer Name as Seen In Their National ID"
						pattern="\d{4}-\d{2}-\d{2}"
						required
						v-model="userVehicles.end_date" />
				</div>
			</div>
		</div>
		<div class="py-2 flex justify-end">
			<button
				type="submit"
				class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700">
				Add Vehicle
			</button>
		</div>
	</form>
</template>

<script setup lang="ts">
	const membershipTypes: Ref<any[]> = ref([]);
	const runtimeConfig = useRuntimeConfig();
	const { openToast } = useToast();
	const route = useRoute();
	const membershipId: string = route.query.id as string;
	const formSubmissionLoading: Ref<boolean> = ref(false);

	try {
		await $fetch(
			`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/control-unit/membershiptypes`,
			{
				method: "GET",
				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error("Failed to retrieve membership types");
					}
					membershipTypes.value = response._data;
				},
			}
		);
	} catch (error) {
		console.log("An error occured: ", error);
		openToast(
			"Failed to load available memberships. Reload page!",
			"danger"
		);
	}

	const userVehicles = reactive({
		membershipTypeId: 0,
		registration: "",
		make: "",
		model: "",
		color: "",
		payment_status: "",
		membership_status: "",
		start_date: "",
		end_date: "",
	});

	async function addVehicleToMember(): Promise<void> {
		formSubmissionLoading.value = true;

		try {
			await $fetch(
				`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/membershipVehicles`,
				{
					method: "POST",
					body: JSON.stringify({
						membershipId: membershipId,
						vehicles: [userVehicles],
					}),

					async onResponse({ response }) {
						if (response.status === 201) {
							formSubmissionLoading.value = false;
							openToast("Vehicle added successfully", "success");
						} else {
							throw new Error("Something went wrong");
						}
					},
				}
			);
		} catch (err) {
			console.log("An error occured: ", err);
			formSubmissionLoading.value = false;
			openToast("Failed. Please try again!", "danger");
		}
	}
</script>
