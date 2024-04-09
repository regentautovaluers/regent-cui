<template>
	<form
		class="py-12"
		@submit.prevent="handleServiceReqFormSubmission">
		<!-- client contacts -->
		<div
			class="flex flex-col lg:flex-row items-center justify-between space-y-3 lg:space-y-0 space-x-0 lg:space-x-3">
			<!-- Full Name Field -->
			<div class="w-full lg:w-1/2">
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
					v-model="userName"
					required />
			</div>

			<!-- Phone Field -->
			<div class="w-full lg:w-1/2">
				<label
					for="phone"
					class="block font-medium mb-2 dark:text-white"
					>Phone</label
				>
				<input
					type="text"
					id="phone"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="e.g. 0704080056"
					v-model="userPhoneNumber"
					required />
			</div>
		</div>

		<!-- Client Email -->
		<div class="w-full mt-3">
			<label
				for="client-email"
				class="block font-medium mb-2 dark:text-white"
				>Client Email</label
			>
			<input
				type="text"
				id="client-email"
				class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
				placeholder="Valid client's email"
				v-model="userEmail"
				required />
		</div>

		<!-- vehicle registration, make, model -->
		<div
			class="flex my-5 flex-col lg:flex-row items-center justify-between space-x-0 lg:space-x-3 space-y-3 lg:space-y-0">
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
					placeholder="e.g.KCD 345G"
					v-model="vehicleRegistration"
					required />
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
					v-model="vehicleMake" />
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
					v-model="vehicleModel" />
			</div>
		</div>

		<!-- vehicle class -->
		<div
			class="flex my-5 flex-col lg:flex-row items-center justify-between space-x-0 lg:space-x-3"
			v-if="
				componentProps.optionalElementsRendered.includes('vehicleClass')
			">
			<div class="w-full">
				<label
					for="fuel-type"
					class="block font-medium mb-2 dark:text-white"
					>Vehicle Class</label
				>
				<select
					class="py-3 px-4 pe-9 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					id="fuel-type"
					required
					v-model="vehicleClass">
					<option
						value="Select a Fuel Type"
						selected>
						Select a Vehicle Class
					</option>
					<option
						v-for="(vClass, index) in [
							'sedan',
							'suv',
							'van',
							'bus',
							'truck',
							'big truck',
						]"
						:key="index"
						:value="vClass">
						{{ capitalizeFirstLetterOfEachWord(vClass) }}
					</option>
				</select>
			</div>
		</div>
		<!-- fuel type and cost -->
		<div
			class="flex my-5 flex-col lg:flex-row items-center justify-between space-x-0 lg:space-x-3 space-y-3 lg:space-y-0"
			v-if="componentProps.optionalElementsRendered.includes('fuelData')">
			<!-- Fuel Type -->
			<div class="w-full lg:w-1/2">
				<label
					for="fuel-type"
					class="block font-medium mb-2 dark:text-white"
					>Fuel Type</label
				>
				<select
					class="py-3 px-4 pe-9 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					id="fuel-type"
					v-model="fuelType"
					required>
					<option
						value="Select a Fuel Type"
						selected>
						Select a Fuel Type
					</option>
					<option
						v-for="(fuelType, index) in [
							'Diesel',
							'Petrol',
							'Kerosene',
						]"
						:key="index"
						:value="fuelType">
						{{ fuelType }}
					</option>
				</select>
			</div>
			<!-- Vehicle Model -->
			<div class="w-full lg:w-1/2">
				<label
					for="fuel-price"
					class="block font-medium mb-2 dark:text-white"
					>Fuel Price</label
				>
				<select
					class="py-3 px-4 pe-9 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					id="fuel-price"
					v-model="fuelAmount"
					required>
					<option
						value="Select Type to See Price"
						selected>
						Select Type to See Price
					</option>
					<option
						v-for="(fuelPrice, index) in [1000, 2000, 3000]"
						:key="index"
						:value="fuelPrice">
						{{ fuelPrice }}
					</option>
				</select>
			</div>
		</div>

		<!-- pickup location -->
		<div class="mt-5">
			<label
				for="pickup-location"
				class="block font-medium mb-2 dark:text-white"
				>Pickup Location</label
			>
			<div class="relative">
				<input
					type="text"
					id="pickup-location"
					class="py-5 ps-10 w-full bg-transparent border-t-transparent border-b-2 border-x-transparent border-b-gray-200 focus:border-t-transparent focus:border-x-transparent focus:border-b-blue-500 focus:ring-0"
					placeholder="Type an address to search"
					required />
				<img
					src="/icons/misc/pick-up-location.svg"
					alt="Pickup Location"
					class="absolute top-[25%]" />
			</div>
		</div>
		<!-- drop off location -->
		<div class="mt-5">
			<label
				for="dropoff-location"
				class="block font-medium mb-2 dark:text-white"
				>Drop Off Location</label
			>
			<div class="relative">
				<input
					type="text"
					id="dropoff-location"
					class="py-5 ps-10 w-full bg-transparent border-t-transparent border-b-2 border-x-transparent border-b-gray-200 focus:border-t-transparent focus:border-x-transparent focus:border-b-blue-500 focus:ring-0"
					placeholder="Type an address to search"
					required />
				<img
					src="/icons/misc/drop-off-location.svg"
					alt="Pickup Location"
					class="absolute top-[25%]" />
			</div>
		</div>
		<!-- comments -->
		<div class="my-5">
			<label
				for="comments-box"
				class="block font-medium mb-2 dark:text-white"
				>Comments</label
			>
			<textarea
				id="comments-box"
				class="py-3 px-4 block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500"
				rows="2"
				placeholder="Provide optional comments for this service request."
				v-model="requestRemarks"></textarea>
		</div>

		<!-- statistics -->
		<div
			class="flex justify-between mt-8 space-x-4"
			v-if="
				componentProps.optionalElementsRendered.includes(
					'bottomStatistics'
				)
			">
			<div
				class="w-1/3 p-4 rounded-md border border-pink-500"
				v-for="a in 3">
				<h1 class="text-lg font-semibold text-pink-500">Distance</h1>
				<h1 class="text-lg font-semibold text-gray-500">50Km</h1>
			</div>
		</div>
		<!-- submit button -->
		<button
			type="submit"
			class="py-3 px-4 w-full mt-7 text-lg h-16 items-center gap-x-2 font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700">
			<span v-if="!formSubmissionLoading">Submit Towing Request</span>
			<div
				v-if="formSubmissionLoading"
				class="animate-spin inline-block size-5 border-[3px] border-white border-current border-t-transparent text-gray-800 rounded-full"
				role="status"
				aria-label="loading" />
		</button>
	</form>
</template>

<script setup lang="ts">
	export interface ComponentProps {
		backendServiceTypeName: string;
		clientServiceTypeName: string;
		optionalElementsRendered: string[];
	}

	const componentProps = defineProps<ComponentProps>();
	const formSubmissionLoading = ref(false);
	const {
		bindToDropOffLocation,
		bindToPickUpLocation,
		pickupPointCoords,
		dropOffPointCoords,
		pickupPointName,
		dropOffPointName,
	} = useLocations();
	const { makeServiceRequest, determineEndpointVar } = useServiceRequests();
	const { capitalizeFirstLetterOfEachWord } = useUtils();
	const vehicleRegistration: Ref<string> = ref("");
	const vehicleMake: Ref<string> = ref("");
	const vehicleModel: Ref<string> = ref("");
	const userName: Ref<string> = ref("");
	const userPhoneNumber: Ref<string> = ref("");
	const userEmail: Ref<string> = ref("");
	const arrivalDuration: Ref<number> = ref(10);
	const arrivalDistance: Ref<number> = ref(20);
	const serviceCost: Ref<number> = ref(1000);
	const pickupPoint: Ref<string> = ref(pickupPointName);
	const pickupLatitude: Ref<number> = ref(pickupPointCoords.lat);
	const pickupLongitude: Ref<number> = ref(pickupPointCoords.lng);
	const destinationPoint: Ref<string> = ref(dropOffPointName);
	const destinationLatitude: Ref<number> = ref(dropOffPointCoords.lat);
	const destinationLongitude: Ref<number> = ref(dropOffPointCoords.lng);
	const requestRemarks: Ref<string | null> = ref(null);
	const vehicleClass: Ref<string | null> = ref(null);
	const fuelType: Ref<string | null> = ref(null);
	const fuelAmount: Ref<number | null> = ref(null);
	const { openToast } = useToast();

	async function handleServiceReqFormSubmission() {
		formSubmissionLoading.value = true;
		try {
			await makeServiceRequest(
				determineEndpointVar(),
				userName.value,
				userPhoneNumber.value,
				userEmail.value,
				componentProps.backendServiceTypeName,
				vehicleRegistration.value,
				vehicleMake.value,
				vehicleModel.value,
				1, // TODO: figure out what this category value here is for
				arrivalDuration.value,
				arrivalDistance.value,
				serviceCost.value,
				pickupPoint.value,
				pickupLatitude.value,
				pickupLongitude.value,
				destinationPoint.value,
				destinationLongitude.value,
				destinationLatitude.value,
				requestRemarks.value,
				vehicleClass.value,
				fuelType.value,
				fuelAmount.value
			).then(() => {
				openToast(
					`${componentProps.clientServiceTypeName} request succesfully went through!`,
					"success"
				);
			});
		} catch (err) {
			console.log("Service request not made. Reason: ", err);
			openToast(
				`${componentProps.clientServiceTypeName} request failed to go thorugh!`,
				"danger"
			);
		} finally {
			formSubmissionLoading.value = false;
		}
	}

	onMounted(async () => {
		await bindToPickUpLocation().then(() => bindToDropOffLocation());
	});
</script>

<style lang="css">
	.pac-container {
		border-radius: 10px;
		margin-top: 2px;
		box-shadow: 10px;
	}

	.pac-item {
		padding-top: 6px;
		padding-bottom: 6px;
		font-size: 12px;
	}
</style>
