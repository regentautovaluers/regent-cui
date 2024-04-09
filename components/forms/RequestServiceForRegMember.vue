<template>
	<form
		class="py-12"
		@submit.prevent="handleServiceReqFormSubmission">
		<div class="w-full registration relative">
			<label
				for="registration-number"
				class="block font-medium mb-2 dark:text-white"
				>Provide Vehicle Registration Number</label
			>
			<input
				type="text"
				id="registration-number"
				class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 peer rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
				placeholder="Provide the registration number to search"
				v-model="vehicleRegistration"
				@keypress.enter.prevent="handleRegistrationInputEnterEvent"
				required />
			<div
				v-if="vehicleSearchLoading"
				class="absolute top-[45%] right-4 animate-spin inline-block size-5 border-[2px] border-gray-500 border-current border-t-transparent rounded-full"
				role="status"
				aria-label="loading" />
			<span class="invisible peer-focus:visible text-xs"
				>Press ENTER key when you're done typing</span
			>
		</div>
		<!-- Progress Bar -->
		<div
			class="my-5"
			v-if="
				componentProps.optionalElementsRendered.includes('progressBar')
			">
			<div
				class="flex w-full h-3 bg-gray-200 rounded-full overflow-hidden"
				role="progressbar"
				aria-valuenow="1"
				aria-valuemin="0"
				aria-valuemax="100">
				<div
					class="flex flex-col justify-center rounded-full overflow-hidden bg-pink-600 text-xs text-white text-center whitespace-nowrap transition duration-500"
					:style="{ width: `${currentPercentage}%` }" />
			</div>
			<div
				class="flex items-center justify-between w-full text-end text-gray-500 antialiased mt-3">
				<span> {{ vehicleRegistration }} </span>
				<span>{{ distanceLeftForTowing }} KM FREE TOWING LEFT</span>
			</div>
		</div>
		<!-- End Progress Bar -->

		<!-- Vehicle Make and Model -->
		<div class="w-full flex space-x-4">
			<!-- Vehicle Make -->
			<div class="w-full lg:w-1/2">
				<label
					for="vehicle-make"
					class="block font-medium mb-2 dark:text-white"
					>Vehicle Make</label
				>
				<input
					type="text"
					id="vehicle-make"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-200 disabled:pointer-events-none"
					placeholder="e.g Toyota"
					required
					disabled
					v-model="vehicleMake" />
			</div>

			<!-- Vehicle Model -->
			<div class="w-full lg:w-1/2">
				<label
					for="vehicle-model"
					class="block font-medium mb-2 dark:text-white"
					>Vehicle Model</label
				>
				<input
					type="text"
					id="vehicle-model"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-200 disabled:pointer-events-none"
					placeholder="e.g Corolla"
					required
					disabled
					v-model="vehicleModel" />
			</div>
		</div>
		<!-- tire metadata -->
		<div
			class="flex items-center space-x-4 my-5"
			v-if="
				componentProps.optionalElementsRendered.includes('tyreMetadata')
			">
			<div class="flex flex-col space-x-4 w-full lg:w-1/2">
				<span class="font-medium whitespace-nowrap mb-2"
					>Have Spare Tyre</span
				>
				<div class="flex space-x-4">
					<div class="flex hover:bg-gray-200 rounded-lg items-center">
						<input
							type="radio"
							name="spare-tyre"
							:value="true"
							class="shrink-0 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
							v-model="haveSpareTyre"
							selected />
						<label class="text-gray-500 ms-2 dark:text-gray-400"
							>Yes</label
						>
					</div>
					<div class="flex hover:bg-gray-200 rounded-lg items-center">
						<input
							type="radio"
							name="spare-tyre"
							:value="false"
							class="shrink-0 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
							v-model="haveSpareTyre" />
						<label class="text-gray-500 ms-2 dark:text-gray-400"
							>No</label
						>
					</div>
				</div>
			</div>
			<div class="w-full flex flex-col lg:w-1/2">
				<label
					for="fuel-type"
					class="font-medium whitespace-nowrap mb-2"
					>Tyre Type</label
				>
				<select
					class="py-3 px-4 pe-9 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					id="fuel-type"
					required
					v-model="tyreType">
					<option value="Select a Tyre Type">
						Select a Tyre Type
					</option>
					<option
						v-for="(vType, index) in [
							'tube',
							'tubeless',
							'unknown',
						]"
						:key="index"
						:value="vType">
						{{
							capitalizeFirstLetterOfEachWord(vType) === "Unknown"
								? "I Don't Know"
								: capitalizeFirstLetterOfEachWord(vType)
						}}
					</option>
				</select>
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
					required
					v-model="fuelType">
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
						:value="fuelType.toLowerCase()">
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
			<span v-if="!formSubmissionLoading"
				>Submit {{ componentProps.clientServiceTypeName }} Request</span
			>
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

	const {
		bindToDropOffLocation,
		bindToPickUpLocation,
		pickupPointCoords,
		dropOffPointCoords,
		pickupPointName,
		dropOffPointName,
	} = useLocations();
	const componentProps = defineProps<ComponentProps>();
	const { getDetails } = usePrincipal();
	const runtimeConfig = useRuntimeConfig();
	const vehicleSearchLoading: Ref<boolean> = ref(false);
	const currentPercentage: Ref<number> = ref(0);
	const distanceLeftForTowing: Ref<number> = ref(0);
	const vehicleRegistration: Ref<string> = ref("");
	const vehicleMake: Ref<string> = ref("");
	const vehicleModel: Ref<string> = ref("");
	const userName: Ref<string> = ref("");
	const userPhoneNumber: Ref<string> = ref("");
	const userEmail: Ref<string | null> = ref(null);
	const formSubmissionLoading = ref(false);
	const arrivalDuration: Ref<number> = ref(10);
	const arrivalDistance: Ref<number> = ref(20);
	const serviceCost: Ref<number> = ref(1000);
	const pickupPoint: Ref<string> = ref(pickupPointName);
	const pickupLatitude: Ref<number> = ref(pickupPointCoords.value.lat);
	const pickupLongitude: Ref<number> = ref(pickupPointCoords.value.lng);
	const destinationPoint: Ref<string> = ref(dropOffPointName);
	const destinationLatitude: Ref<number> = ref(dropOffPointCoords.value.lat);
	const destinationLongitude: Ref<number> = ref(dropOffPointCoords.value.lng);
	const requestRemarks: Ref<string | null> = ref(null);
	const vehicleClass: Ref<string | null> = ref(null);
	const fuelType: Ref<string | null> = ref(null);
	const fuelAmount: Ref<number | null> = ref(null);
	const haveSpareTyre: Ref<boolean> = ref(true);
	const tyreType: Ref<string> = ref("tubeless");
	const { openToast } = useToast();
	const { makeServiceRequest, determineEndpointVar } = useServiceRequests();
	const { capitalizeFirstLetterOfEachWord } = useUtils();

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
				fuelAmount.value,
				tyreType.value,
				haveSpareTyre.value
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

	async function handleRegistrationInputEnterEvent(): Promise<void> {
		if (vehicleRegistration.value !== "") {
			vehicleSearchLoading.value = true;
			try {
				await $fetch(
					`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/bookings`,
					{
						method: "GET",
						query: {
							registration: vehicleRegistration.value,
							corporateId: getDetails.company,
						},
						async onResponse({ response }) {
							if (response.status === 404) {
								openToast(
									"Vehicle registration not found. Please search again!",
									"warning"
								);
								vehicleRegistration.value = "";
							} else {
								openToast(
									"Vehicle registration found. Necessary fields autohandled!",
									"success"
								);

								// fill the needed fields
								const registrationDetails = response._data;
								console.log(
									"Response data ENTER key: ",
									registrationDetails
								);
								vehicleRegistration.value =
									registrationDetails.membershipVehicle.registration;
								userName.value =
									registrationDetails.membership.full_name;
								userPhoneNumber.value =
									registrationDetails.membership.phone_number;
								userEmail.value =
									registrationDetails.membership.userEmail;

								vehicleMake.value =
									registrationDetails.membershipVehicle.make;
								vehicleModel.value =
									registrationDetails.membershipVehicle.model;
								currentPercentage.value = calculatePercentage(
									Number(
										registrationDetails.membershipVehicle
											.available_free_distance
									)
								);
								distanceLeftForTowing.value = Number(
									registrationDetails.membershipVehicle
										.available_free_distance
								);
							}
						},
					}
				);
			} catch (error) {
				console.log("An error occured: ", error);
				openToast("Search failed. Please try again!", "danger");
			} finally {
				vehicleSearchLoading.value = false;
			}
		} else {
			openToast("Please provide a registration number!", "warning");
		}
	}

	function calculatePercentage(freeDistance: number): number {
		return (freeDistance * 100) / 20;
	}

	onMounted(async () => {
		await bindToPickUpLocation().then(() => bindToDropOffLocation());
	});
</script>

<style lang="css">
	.progressbar {
		width: v-bind(currentPercentage.value) %;
	}

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
