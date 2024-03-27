<template>
	<form @submit.prevent="registerIndividualMember">
		<div
			class="flex flex-col lg:flex-row items-center justify-between space-y-3 lg:space-y-0 space-x-0 lg:space-x-3">
			<!-- Full Name Field -->
			<div class="w-full lg:w-1/3">
				<label
					for="full-name"
					class="block font-medium mb-2 dark:text-white"
					>Full Name</label
				>
				<input
					type="text"
					id="full-name"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="Client Name as On Their National ID"
					required
					v-model="clientFullName" />
			</div>

			<!-- Phone Field -->
			<div class="w-full lg:w-1/3">
				<label
					for="phone"
					class="block font-medium mb-2 dark:text-white"
					>Phone</label
				>
				<input
					type="text"
					id="phone"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="+254704080056"
					required
					v-model="clientPhoneNumber" />
			</div>

			<!-- Email field -->
			<div class="w-full lg:w-1/3">
				<label
					for="email"
					class="block font-medium mb-2 dark:text-white"
					>Email</label
				>
				<input
					type="email"
					id="phone"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="youremail@co.ke"
					required
					v-model="clientEmail" />
			</div>
		</div>
		<p
			class="text-sm text-red-500 font-semibold"
			v-if="formErrorMessage">
			{{ formErrorMessage }}
		</p>

		<h1 class="mt-16 text-2xl antialiased">Register Your Vehicles</h1>
		<!-- Vehicle Details & Payment & Status -->
		<div
			class="mt-7"
			v-for="(vehicle, index) in userVehicles"
			:key="index">
			<!-- this field is hidden. it holds the data for membershipTypeId -->
			<input
				type="text"
				hidden
				v-model="vehicle.membershipTypeId" />

			<div
				class="flex flex-col lg:flex-row items-center justify-between space-x-0 lg:space-x-3 space-y-3 lg:space-y-0">
				<!-- Reg Number -->
				<div class="w-full lg:w-1/3">
					<label
						for="vehicle-registration-number"
						class="block font-medium mb-2 dark:text-white"
						>Vehicle Registration Number</label
					>
					<input
						type="text"
						id="vehicle-registration-number"
						class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
						placeholder="KCD 345G"
						required
						v-model="vehicle.registration" />
				</div>
				<!-- Vehicle Make -->
				<div class="w-full lg:w-1/3">
					<label
						for="vehicle-make"
						class="block font-medium mb-2 dark:text-white"
						>Vehicle Make</label
					>
					<input
						type="text"
						id="vehicle-make"
						class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
						placeholder="e.g Toyota"
						required
						v-model="vehicle.make" />
				</div>

				<!-- Vehicle Model -->
				<div class="w-full lg:w-1/3">
					<label
						for="vehicle-model"
						class="block font-medium mb-2 dark:text-white"
						>Vehicle Model</label
					>
					<input
						type="text"
						id="vehicle-model"
						class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
						placeholder="e.g Corolla"
						required
						v-model="vehicle.model" />
				</div>
			</div>
			<!--Vehicle Color Field -->
			<div class="w-full mt-4">
				<label
					for="full-name"
					class="block font-medium mb-2 dark:text-white"
					>Vehicle Color</label
				>
				<input
					type="text"
					id="full-name"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="e.g Red"
					required
					v-model="vehicle.color" />
			</div>

			<div class="flex items-center justify-between space-x-3 mt-4">
				<!-- Payment Status Field -->
				<div class="w-1/2 md:w-1/3">
					<label
						for="payment-status"
						class="block font-medium mb-2 dark:text-white"
						>Payment Status</label
					>
					<select
						class="py-3 px-4 pe-9 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
						id="payment-status"
						required
						v-model="vehicle.payment_status">
						<option
							v-for="(status, index) in ['Paid', 'Not Paid']"
							:key="index"
							:value="status.toLocaleLowerCase()">
							{{ status }}
						</option>
					</select>
				</div>
				<!-- Payment Status Field -->
				<div class="w-1/2 md:w-2/3">
					<label
						for="membership-status"
						class="block font-medium mb-2 dark:text-white"
						>Membership Status</label
					>
					<select
						class="py-3 px-4 pe-9 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
						id="membership-status"
						required
						v-model="vehicle.membership_status">
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
			<div class="flex items-center justify-between space-x-3 mt-7">
				<!-- Starting date Field -->
				<div class="w-1/2">
					<label
						for="cover-period-starts"
						class="block font-medium mb-2 dark:text-white"
						>Cover Period Starts</label
					>
					<input
						type="date"
						id="cover-period-starts"
						class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
						placeholder="Enter Customer Name as Seen In Their National ID"
						required
						v-model="vehicle.start_date" />
				</div>

				<!-- Ending date Field -->
				<div class="w-1/2">
					<label
						for="cover-period-ends"
						class="block font-medium mb-2 dark:text-white"
						>Cover Period Ends</label
					>
					<input
						type="date"
						id="cover-period-ends"
						class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
						placeholder="Enter Customer Name as Seen In Their National ID"
						required
						v-model="vehicle.end_date" />
				</div>
			</div>
		</div>
		<button
			class="inline-flex items-center space-x-2 my-7 text-blue-600"
			@click="
				() =>
					userVehicles.push({
						membershipTypeId: Number($route.query.membershipTypeId),
						registration: '',
						make: '',
						model: '',
						color: '',
						payment_status: '',
						membership_status: '',
						start_date: '',
						end_date: '',
					})
			">
			<Icon
				name="ic:baseline-add"
				color="white"
				size="38"
				class="bg-blue-600 p-1 rounded-full" />
			<span
				class="underline decoration-2 decoration-inherit underline-offset-2"
				>Add Another Vehicle</span
			>
		</button>
		<div
			class="flex flex-col md:flex-row space-y-3 md:space-y-0 items-center space-x-0 md:space-x-4 mt-4 w-full md:w-1/2">
			<div
				class="border border-blue-600 rounded p-2 h-fit w-full md:w-1/2">
				<h1 class="text-2xl font-semibold tracking-wide text-blue-600">
					Vehicles Added
				</h1>
				<h2 class="text-lg text-gray-500">{{ userVehicles.length }}</h2>
			</div>
			<div
				class="border border-blue-600 rounded p-2 h-fit w-full md:w-1/2">
				<h1 class="text-2xl font-semibold tracking-wide text-blue-600">
					Total Price
				</h1>
				<h2 class="text-lg text-gray-500">
					{{
						Number($route.query.registrationCost) *
						userVehicles.length
					}}
					/ year
				</h2>
			</div>
		</div>
		<button
			type="submit"
			class="py-3 px-4 w-full mt-7 lg:w-1/2 text-lg h-16 items-center gap-x-2 font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
			<span v-if="!formSubmissionLoading">Create Membership</span>
			<div
				v-if="formSubmissionLoading"
				class="animate-spin inline-block size-5 border-[3px] border-white border-current border-t-transparent text-gray-800 rounded-full"
				role="status"
				aria-label="loading" />
		</button>
	</form>
</template>

<script setup lang="ts">
	type vehicleRegistrationDetails = {
		membershipTypeId: number;
		registration: string;
		make: string;
		model: string;
		color: string;
		payment_status: string;
		membership_status: string;
		start_date: string;
		end_date: string;
	};

	const route = useRoute();
	const formSubmissionLoading = ref(false);
	const clientFullName = ref("");
	const clientPhoneNumber = ref("");
	const clientEmail = ref("");
	const { getDetails } = usePrincipal();
	const { openToast } = useToast();
	const runtimeConfig = useRuntimeConfig();
	const formErrorMessage: Ref<null | string> = ref(null);
	const userVehicles: Ref<vehicleRegistrationDetails[]> = ref([
		{
			membershipTypeId: Number(route.query.membershipTypeId),
			registration: "",
			make: "",
			model: "",
			color: "",
			payment_status: "",
			membership_status: "",
			start_date: "",
			end_date: "",
		},
	]);

	async function registerIndividualMember(): Promise<void> {
		formSubmissionLoading.value = true;
		let membershipId = 0;

		try {
			await $fetch(
				`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/memberships`,
				{
					method: "POST",
					body: JSON.stringify({
						full_name: clientFullName.value,
						phone_number: clientPhoneNumber.value,
						userEmail: clientEmail.value,
						corporateId: getDetails.acc_id,
						category: "individual",
						recordedBy: getDetails.username,
					}),

					async onResponse({ response }) {
						console.log(response._data);
						if (response.status === 201) {
							membershipId = response._data.id;
						} else if (response.status === 400) {
							formErrorMessage.value = response._data.message;
							openToast("Please check your data!", "warning");
							formSubmissionLoading.value = false;
						} else {
							throw new Error("Something went wrong");
						}
					},
				}
			).then(async () => {
				await $fetch(
					`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/membershipVehicles`,
					{
						method: "POST",
						body: JSON.stringify({
							membershipId: membershipId,
							vehicles: userVehicles.value,
						}),

						async onResponse({ response }) {
							if (response.status === 201) {
								formSubmissionLoading.value = false;
								openToast(
									"Membership creation successful",
									"success"
								);
							} else {
								throw new Error("Something went wrong");
							}
						},
					}
				);
			});
		} catch (err) {
			console.log("An error occured: ", err);
			formSubmissionLoading.value = false;
			openToast("Request failed. Please try again!", "danger");
		}
	}
</script>
