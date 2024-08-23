<template>
	<form @submit.prevent="registerIndividualMember">
		<div
			class="flex flex-col items-center justify-between space-x-0 space-y-3 lg:flex-row lg:space-x-3 lg:space-y-0">
			<!-- Full Name Field -->
			<div class="w-full lg:w-1/3">
				<label
					for="full-name"
					class="generic-input-label"
					>Full Name</label
				>
				<input
					type="text"
					id="full-name"
					class="generic-input"
					placeholder="Client Name as On Their National ID"
					required
					v-model="clientFullName" />
			</div>

			<!-- Phone Field -->
			<div class="w-full lg:w-1/3">
				<label
					for="phone"
					class="generic-input-label"
					>Phone</label
				>
				<input
					type="text"
					id="phone"
					class="generic-input"
					placeholder="254704080056"
					required
					v-model="clientPhoneNumber" />
			</div>

			<!-- Email field -->
			<div class="w-full lg:w-1/3">
				<label
					for="email"
					class="generic-input-label"
					>Email</label
				>
				<input
					type="email"
					id="phone"
					class="generic-input"
					placeholder="youremail@co.ke"
					required
					v-model="clientEmail" />
			</div>
		</div>
		<p
			class="text-sm font-semibold text-red-500"
			v-if="formErrorMessage">
			{{ formErrorMessage }}
		</p>

		<h1 class="mt-8 text-2xl">Register Your Vehicles</h1>
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
				class="flex flex-col items-center justify-between space-x-0 space-y-3 lg:flex-row lg:space-x-3 lg:space-y-0">
				<!-- Reg Number -->
				<div class="w-full lg:w-1/3">
					<label
						for="vehicle-registration-number"
						class="generic-input-label"
						>Vehicle Registration Number</label
					>
					<input
						type="text"
						id="vehicle-registration-number"
						class="generic-input"
						placeholder="KCD 345G"
						required
						v-model="vehicle.registration" />
				</div>
				<!-- Vehicle Make -->
				<div class="w-full lg:w-1/3">
					<label
						for="vehicle-make"
						class="generic-input-label"
						>Vehicle Make</label
					>
					<input
						type="text"
						id="vehicle-make"
						class="generic-input"
						placeholder="e.g Toyota"
						required
						v-model="vehicle.make" />
				</div>

				<!-- Vehicle Model -->
				<div class="w-full lg:w-1/3">
					<label
						for="vehicle-model"
						class="generic-input-label"
						>Vehicle Model</label
					>
					<input
						type="text"
						id="vehicle-model"
						class="generic-input"
						placeholder="e.g Corolla"
						required
						v-model="vehicle.model" />
				</div>
			</div>
			<!--Vehicle Color Field -->
			<div class="mt-4 w-full">
				<label
					for="full-name"
					class="generic-input-label"
					>Vehicle Color</label
				>
				<input
					type="text"
					id="full-name"
					class="generic-input"
					placeholder="e.g Red"
					required
					v-model="vehicle.color" />
			</div>

			<div class="mt-4 flex items-center justify-between space-x-3">
				<!-- Payment Status Field -->
				<div class="w-1/2 md:w-1/3">
					<label
						for="payment-status"
						class="generic-input-label"
						>Payment Status</label
					>
					<select
						class="generic-input"
						id="payment-status"
						required
						v-model="vehicle.payment_status">
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
				<div class="w-1/2 md:w-2/3">
					<label
						for="membership-status"
						class="generic-input-label"
						>Membership Status</label
					>
					<select
						class="generic-input"
						id="membership-status"
						required
						v-model="vehicle.membership_status">
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
			<div class="mt-7 flex items-center justify-between space-x-3">
				<!-- Starting date Field -->
				<div class="w-1/2">
					<label
						for="cover-period-starts"
						class="generic-input-label"
						>Cover Period Starts</label
					>
					<input
						type="date"
						id="cover-period-starts"
						class="generic-input"
						placeholder="Enter Customer Name as Seen In Their National ID"
						pattern="\d{4}-\d{2}-\d{2}"
						required
						v-model="vehicle.start_date" />
				</div>

				<!-- Ending date Field -->
				<div class="w-1/2">
					<label
						for="cover-period-ends"
						class="generic-input-label"
						>Cover Period Ends</label
					>
					<input
						type="date"
						id="cover-period-ends"
						class="generic-input"
						placeholder="Enter Customer Name as Seen In Their National ID"
						pattern="\d{4}-\d{2}-\d{2}"
						required
						v-model="vehicle.end_date" />
				</div>
			</div>
		</div>
		<button
			class="my-7 inline-flex items-center space-x-2 text-blue-600"
			@click="
				() =>
					userVehicles.push({
						corpName: getPrincipal.corpName,
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
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="2em"
				height="2em"
				viewBox="0 0 24 24"
				class="me-1 size-4"
				fill="currentColor"
				aria-hidden="true">
				<path
					d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1" />
			</svg>
			<span class="underline decoration-inherit decoration-2 underline-offset-2"
				>Add Another Vehicle</span
			>
		</button>
		<div
			class="mt-4 flex w-full flex-col items-center space-x-0 space-y-3 md:w-1/2 md:flex-row md:space-x-4 md:space-y-0">
			<div class="h-fit w-full rounded border border-blue-600 p-2 md:w-1/2">
				<h1 class="text-2xl font-semibold tracking-wide text-blue-600">Vehicles Added</h1>
				<h2 class="text-lg text-gray-500">{{ userVehicles.length }}</h2>
			</div>
			<div class="h-fit w-full rounded border border-blue-600 p-2 md:w-1/2">
				<h1 class="text-2xl font-semibold tracking-wide text-blue-600">Total Price</h1>
				<h2 class="text-lg text-gray-500">
					{{ Number($route.query.registrationCost) * userVehicles.length }}
					/ year
				</h2>
			</div>
		</div>
		<button
			type="submit"
			class="mt-7 h-16 w-full items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-lg font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 lg:w-1/2">
			<span v-if="!formSubmissionLoading">Create Membership</span>
			<div
				v-if="formSubmissionLoading"
				class="inline-block size-5 animate-spin rounded-full border-[3px] border-current border-white border-t-transparent text-gray-800"
				role="status"
				aria-label="loading" />
		</button>
	</form>
</template>

<script setup lang="ts">
	type vehicleRegistrationDetails = {
		corpName: string;
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
	const clientFullName = ref('');
	const clientPhoneNumber = ref('');
	const clientEmail = ref('');
	const { getPrincipal } = useAuth();
	// const { openToast } = useToast();
	const runtimeConfig = useRuntimeConfig();
	const formErrorMessage: Ref<null | string> = ref(null);
	const userVehicles: Ref<vehicleRegistrationDetails[]> = ref([
		{
			corpName: getPrincipal.value.corpName,
			membershipTypeId: Number(route.query.membershipTypeId),
			registration: '',
			make: '',
			model: '',
			color: '',
			payment_status: '',
			membership_status: '',
			start_date: '',
			end_date: '',
		},
	]);

	watch(clientPhoneNumber, (newNumber) => {
		if (newNumber.startsWith('0') || newNumber.startsWith('+254')) {
			clientPhoneNumber.value = newNumber.replace(/^(\+254|0)/, '254');
		}
	});

	const registerIndividualMember = async (): Promise<void> => {
		formSubmissionLoading.value = true;
		let membershipId = 0;

		try {
			await $fetch('/api/v1/memberships', {
				baseURL: runtimeConfig.public.AVA_BASE_URL,
				method: 'POST',
				body: JSON.stringify({
					full_name: clientFullName.value,
					phone_number: clientPhoneNumber.value,
					userEmail: clientEmail.value,
					corporateId: getPrincipal.value.corpId,
					category: 'individual',
					recordedBy: getPrincipal.value.userId,
				}),

				async onResponse({ response }) {
					console.log(response._data);
					if (response.status === 201) {
						membershipId = response._data.id;
					} else if (response.status === 400) {
						formErrorMessage.value = response._data.message;
						// openToast('Please check your data!', 'warning');
						formSubmissionLoading.value = false;
					} else {
						throw new Error('Something went wrong');
					}
				},
			}).then(async () => {
				await $fetch('/api/v1/membershipVehicles', {
					baseURL: runtimeConfig.public.AVA_BASE_URL,
					method: 'POST',
					body: JSON.stringify({
						membershipId: membershipId,
						vehicles: userVehicles.value,
					}),

					async onResponse({ response }) {
						if (response.status === 201) {
							formSubmissionLoading.value = false;
							// openToast('Membership creation successful', 'success');
						} else {
							throw new Error('Something went wrong');
						}
					},
				});
			});
		} catch (err) {
			console.log('An error occured: ', err);
			formSubmissionLoading.value = false;
			// openToast('Request failed. Please try again!', 'danger');
		}
	};
</script>
