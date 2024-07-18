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
					class="generic-input"
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
					class="generic-input"
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
				class="generic-input"
				placeholder="Valid client's email"
				v-model="userEmail"
				required />
		</div>

		<!-- Vehicle Registration -->
		<div class="w-full mt-3">
			<label
				for="vehicle-registration-number"
				class="block font-medium mb-2 dark:text-white"
				>Vehicle Registration Number</label
			>
			<input
				type="text"
				id="vehicle-registration-number"
				class="generic-input"
				placeholder="e.g.KCD 345G"
				v-model="vehicleRegistration"
				required />
		</div>

		<!-- vehicle registration, make, model -->
		<div
			class="flex my-5 flex-col lg:flex-row items-center justify-between space-x-0 lg:space-x-3 space-y-3 lg:space-y-0">
			<!-- Reg Number -->

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
					class="generic-input"
					placeholder="e.g Toyota"
					required
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
					class="generic-input"
					placeholder="e.g Corolla"
					required
					v-model="vehicleModel" />
			</div>
		</div>

		<!-- tire metadata -->
		<div
			v-if="
				componentProps.optionalElementsRendered.includes('tyreMetadata')
			">
			<div class="space-y-2 my-4">
				<div>
					<input
						id="button1"
						type="radio"
						name="radio-vertical-group"
						class="hidden peer"
						:value="true"
						v-model="haveSpareTyre"
						selected />
					<label
						for="button1"
						class="radio-inputs">
						Client Has a Spare Tyre
					</label>
				</div>
				<div>
					<input
						id="button2"
						type="radio"
						name="radio-vertical-group"
						class="hidden peer"
						:value="false"
						v-model="haveSpareTyre" />
					<label
						for="button2"
						class="radio-inputs">
						Client Does Not Have a Spare Tyre
					</label>
				</div>
			</div>
			<div class="w-full flex flex-col mt-4">
				<label
					for="fuel-type"
					class="font-medium whitespace-nowrap mb-2"
					>Tyre Type</label
				>
				<select
					class="generic-input"
					id="fuel-type"
					required
					v-model="tyreType">
					<option value="">Select a Tyre Type</option>
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
				<!-- prettier ignore -->
				<select
					class="generic-input"
					id="fuel-type"
					required
					v-model="vehicleClass">
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
					class="generic-input"
					id="fuel-type"
					v-model="fuelType"
					required>
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
				<input
					type="text"
					id="fuel-price"
					class="generic-input"
					placeholder="e.g 1000"
					required
					v-model="fuelAmount" />
			</div>
		</div>

		<!-- pickup location -->
		<div class="mt-5">
			<label
				for="client-location"
				class="block font-medium mb-2 dark:text-white"
				>Client Location</label
			>
			<div class="relative">
				<input
					type="text"
					id="client-location"
					class="py-5 ps-10 w-full bg-transparent border-t-transparent border-b-2 border-x-transparent border-b-gray-200 focus:border-t-transparent focus:border-x-transparent focus:border-b-blue-500 focus:ring-0"
					placeholder="Type an address to search"
					required />
				<img
					src="/icons/misc/pick-up-location.svg"
					alt="Client Location"
					class="absolute top-[25%]" />
			</div>
		</div>
		<!-- drop off location -->
		<div
			class="mt-5"
			v-if="
				componentProps.optionalElementsRendered.includes(
					'dropoffLocation'
				)
			">
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
			<div class="w-1/2 p-3 rounded-lg border border-pink-500">
				<h1 class="text-lg font-semibold text-pink-500">Distance</h1>
				<h1 class="text-lg font-semibold text-gray-500">
					{{ computedTowingDistance }}Km
				</h1>
			</div>
			<div class="w-1/2 p-3 rounded-lg border border-pink-500">
				<h1 class="text-lg font-semibold text-pink-500">Cost</h1>
				<h1 class="text-lg font-semibold text-gray-500">N/A</h1>
			</div>
		</div>
		<!-- submit button -->
		<button
			type="submit"
			class="form-submit relative overflow-clip mt-4 text-lg h-14">
			<LoadingIndicator
				v-if="formSubmissionLoading"
				inject-classes="absolute w-[100%] mt-0 -top-1" />
			<span v-if="formSubmissionLoading">Processing...</span>
			<span v-else
				>Submit {{ componentProps.clientServiceTypeName }} Request</span
			>
		</button>
	</form>
</template>

<script setup lang="ts">
	import { type informativeCoordsMarker } from "~/types/types";

	const componentProps = defineProps<{
		backendServiceTypeName: string;
		clientServiceTypeName: string;
		optionalElementsRendered: string[];
		towingDistance?: number;
	}>();
	const formSubmissionLoading = ref(false);
	const { makeServiceRequest } = useServiceRequests();
	const vehicleRegistration: Ref<string> = ref("");
	const vehicleMake: Ref<string> = ref("");
	const vehicleModel: Ref<string> = ref("");
	const userName: Ref<string> = ref("");
	const userPhoneNumber: Ref<string> = ref("");
	const userEmail: Ref<string> = ref("");
	const arrivalDuration: Ref<number> = ref(10);
	const arrivalDistance: Ref<number> = ref(20);
	const serviceCost: Ref<number> = ref(1000);
	const requestRemarks: Ref<string | null> = ref(null);
	const vehicleClass: Ref<string | null> = ref(null);
	const fuelType: Ref<string | null> = ref(null);
	const fuelAmount: Ref<number | null> = ref(null);
	const haveSpareTyre: Ref<boolean> = ref(true);
	const tyreType: Ref<string> = ref("");
	const componentEmits = defineEmits<{
		appendInfoMarker: [informativeCoordsMarker];
	}>();
	const computedTowingDistance: ComputedRef<number | undefined> = computed(
		() => {
			return componentProps.towingDistance;
		}
	);
	const {
		pickupLatitude,
		pickupLongitude,
		destinationLongitude,
		destinationLatitude,
		pickupPointName,
		dropOffPointName,
	} = useLocationUtils();

	watch([pickupLatitude, pickupLongitude], (newValues) => {
		if (
			newValues[0] !== Number.NEGATIVE_INFINITY &&
			newValues[1] !== Number.NEGATIVE_INFINITY
		) {
			componentEmits("appendInfoMarker", {
				id: 0,
				info: "Client Is Here",
				coords: {
					lat: newValues[0],
					lng: newValues[1],
				},
			});
		}
	});

	watch([destinationLatitude, destinationLongitude], (newValues) => {
		if (
			newValues[0] !== Number.NEGATIVE_INFINITY &&
			newValues[1] !== Number.NEGATIVE_INFINITY
		) {
			componentEmits("appendInfoMarker", {
				id: 1,
				info: "Destination Is Here",
				coords: {
					lat: newValues[0],
					lng: newValues[1],
				},
			});
		}
	});

	async function handleServiceReqFormSubmission() {
		formSubmissionLoading.value = true;
		await makeServiceRequest(
			userName.value,
			userPhoneNumber.value,
			userEmail.value,
			componentProps.backendServiceTypeName,
			vehicleRegistration.value,
			vehicleMake.value,
			vehicleModel.value,
			arrivalDuration.value,
			arrivalDistance.value,
			serviceCost.value,
			pickupPointName.value,
			pickupLatitude.value,
			pickupLongitude.value,
			dropOffPointName.value,
			destinationLongitude.value,
			destinationLatitude.value,
			requestRemarks.value,
			vehicleClass.value,
			fuelType.value,
			fuelAmount.value,
			tyreType.value,
			haveSpareTyre.value
		).then(() => (formSubmissionLoading.value = false));
	}
</script>
