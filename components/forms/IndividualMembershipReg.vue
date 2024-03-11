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
					placeholder="Client Name as On Their National ID" />
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
					placeholder="+254704080056" />
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
					placeholder="youremail@co.ke" />
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
					placeholder="Enter Customer Name as Seen In Their National ID" />
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
					placeholder="Enter Customer Name as Seen In Their National ID" />
			</div>
		</div>

		<h1 class="mt-16 text-2xl antialiased">Register Your Vehicles</h1>

		<!-- Vehicle Details & Payment & Status -->
		<div
			class="mt-7"
			v-for="(vehicle, index) in userVehicles"
			:key="index">
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
						v-model="vehicle.registrationNumber" />
				</div>
				<!-- Vehicle Make -->
				<div class="w-full lg:w-1/3">
					<label
						for="vehicle-make"
						class="block font-medium mb-2 dark:text-white"
						>Vehicle Make</label
					>
					<select
						class="py-3 px-4 pe-9 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
						id="vehicle-make"
						v-model="vehicle.vehicleMake">
						<option
							v-for="(make, index) in [
								'Make A',
								'Make B',
								'Make C',
								'Make D',
							]"
							:key="index">
							{{ make }}
						</option>
					</select>
				</div>
				<!-- Vehicle Model -->
				<div class="w-full lg:w-1/3">
					<label
						for="vehicle-model"
						class="block font-medium mb-2 dark:text-white"
						>Vehicle Model</label
					>
					<select
						class="py-3 px-4 pe-9 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
						id="vehicle-model"
						v-model="vehicle.vehicleModel">
						<option
							v-for="(model, index) in [
								'Model A',
								'Model B',
								'Model C',
								'Model D',
							]"
							:key="index">
							{{ model }}
						</option>
					</select>
				</div>
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
						v-model="vehicle.paymentStatus">
						<option
							v-for="(status, index) in ['Paid', 'Not Paid']"
							:key="index">
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
						v-model="vehicle.paymentStatus">
						<option
							v-for="(status, index) in ['Active', 'Not Active']"
							:key="index">
							{{ status }}
						</option>
					</select>
				</div>
			</div>
		</div>
		<button
			class="inline-flex items-center space-x-2 my-7 text-blue-600"
			@click="
				() =>
					userVehicles.push({
						registrationNumber: '',
						vehicleMake: '',
						vehicleModel: '',
						paymentStatus: '',
						membershipStatus: '',
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
		registrationNumber: string;
		vehicleMake: string;
		vehicleModel: string;
		paymentStatus: string;
		membershipStatus: string;
	};

	const formSubmissionLoading = ref(false);
	const userVehicles: Ref<vehicleRegistrationDetails[]> = ref([
		{
			registrationNumber: "",
			vehicleMake: "",
			vehicleModel: "",
			paymentStatus: "",
			membershipStatus: "",
		},
	]);

	function registerIndividualMember(): void {}
</script>
