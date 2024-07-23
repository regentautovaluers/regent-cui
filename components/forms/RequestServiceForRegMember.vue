<template>
	<form
		class="py-12"
		@submit.prevent="
			makeServiceRequest(
				computedServiceCost,
				props.backendServiceTypeName,
				computedTowingDistance
			)
		">
		<div class="w-full registration relative">
			<label
				for="registration-number"
				class="block font-medium mb-2"
				>Provide Vehicle Registration Number</label
			>
			<div class="flex items-center space-x-2">
				<input
					type="text"
					id="registration-number"
					class="generic-input"
					placeholder="Provide the registration number to search"
					v-model="vehicleRegistration"
					required
					maxlength="8" />
				<button
					type="button"
					@click="searchVehicleRegistration"
					class="py-2 w-1/4 text-lg h-[3.2rem] font-semibold rounded-xl hover:bg-blue-700 form-submit relative overflow-clip disabled:bg-gray-300"
					:disabled="vehicleRegistration.length < 8">
					<LoadingIndicator
						v-if="vehicleSearchLoading"
						inject-classes="absolute w-[100%] mt-0 -top-1" />
					<span v-if="vehicleSearchLoading">Processing...</span>
					<span v-else>Search</span>
				</button>
			</div>
		</div>
		<!-- Progress Bar -->
		<div
			class="my-3"
			v-if="props.optionalElementsRendered.includes('progressBar')">
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
				<span>{{ freeDistanceLeftForTowing }} KM FREE TOWING LEFT</span>
			</div>
		</div>
		<!-- End Progress Bar -->

		<!-- client contacts -->
		<div
			class="flex flex-col lg:flex-row items-center justify-between space-y-3 lg:space-y-0 space-x-0 lg:space-x-3">
			<!-- Full Name Field -->
			<div class="w-full lg:w-1/2">
				<label
					for="full-name"
					class="block font-medium mb-2"
					>Full Name</label
				>
				<input
					type="text"
					id="full-name"
					class="generic-input"
					placeholder="Client Name"
					v-model="userName"
					required
					disabled />
			</div>

			<!-- Phone Field -->
			<div class="w-full lg:w-1/2">
				<label
					for="phone"
					class="block font-medium mb-2"
					>Phone</label
				>
				<input
					type="text"
					id="phone"
					class="generic-input"
					placeholder="e.g. 0704080056"
					v-model="userPhoneNumber"
					required
					disabled />
			</div>
		</div>

		<!-- Vehicle Make and Model -->
		<div class="w-full flex space-x-4 mt-4">
			<!-- Vehicle Make -->
			<div class="w-full lg:w-1/2">
				<label
					for="vehicle-make"
					class="block font-medium mb-2"
					>Vehicle Make</label
				>
				<input
					type="text"
					id="vehicle-make"
					class="generic-input"
					placeholder="e.g Toyota"
					required
					disabled
					v-model="vehicleMake" />
			</div>

			<!-- Vehicle Model -->
			<div class="w-full lg:w-1/2">
				<label
					for="vehicle-model"
					class="block font-medium mb-2"
					>Vehicle Model</label
				>
				<input
					type="text"
					id="vehicle-model"
					class="generic-input"
					placeholder="e.g Corolla"
					required
					disabled
					v-model="vehicleModel" />
			</div>
		</div>

		<!-- vehicle type as published by Regent -->
		<div
			class="w-full space-y-2 mt-4"
			v-if="props.clientServiceTypeName === 'Towing'">
			<label
				for="vehicle-type"
				class="block font-medium"
				>Vehicle Type</label
			>
			<select
				class="generic-input"
				:class="loadingVehicleTypes ? 'animate-pulse opactiy-50' : null"
				id="vehicle-type"
				required
				v-model.number="vehicleTypeIndex">
				<option
					v-for="(type, i) in vehicleTypes"
					:key="i"
					:value="i">
					{{ type.description }}
				</option>
			</select>
		</div>

		<!-- tyre metadata -->
		<div v-if="props.optionalElementsRendered.includes('tyreMetadata')">
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
			v-if="props.optionalElementsRendered.includes('vehicleClass')">
			<div class="w-full">
				<label
					for="fuel-type"
					class="block font-medium mb-2"
					>Vehicle Class</label
				>
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
			v-if="props.optionalElementsRendered.includes('fuelData')">
			<!-- Fuel Type -->
			<div class="w-full lg:w-1/2">
				<label
					for="fuel-type"
					class="block font-medium mb-2"
					>Fuel Type</label
				>
				<select
					class="generic-input"
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
					class="block font-medium mb-2"
					>Fuel Price</label
				>
				<select
					class="generic-input"
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
				for="client-location"
				class="block font-medium mb-2"
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
			v-if="props.optionalElementsRendered.includes('dropoffLocation')">
			<label
				for="dropoff-location"
				class="block font-medium mb-2"
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
				class="block font-medium mb-2"
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
		<div class="flex justify-between mt-8 space-x-4">
			<div
				class="w-1/3 p-3 rounded-lg border border-pink-500"
				v-if="props.clientServiceTypeName === 'Towing'">
				<h1 class="text-lg font-semibold text-pink-500">Distance</h1>
				<h1 class="text-lg font-semibold text-gray-500">
					{{ computedTowingDistance }}Km
				</h1>
			</div>
			<div
				class="w-1/3 p-3 rounded-lg border border-pink-500"
				v-if="props.clientServiceTypeName === 'Towing'">
				<h1 class="text-lg font-semibold text-pink-500">Free Tow</h1>
				<h1 class="text-lg font-semibold text-gray-500">
					{{ freeDistanceLeftForTowing }}Km
				</h1>
			</div>
			<div
				class="p-3 rounded-lg border border-pink-500"
				:class="
					props.clientServiceTypeName === 'Towing'
						? 'w-1/3'
						: 'w-full'
				">
				<h1 class="text-lg font-semibold text-pink-500">Cost</h1>
				<h1 class="text-lg font-semibold text-gray-500">
					{{ computedServiceCost }}Ksh
				</h1>
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
			<span v-else>Submit {{ props.clientServiceTypeName }} Request</span>
		</button>
	</form>
</template>

<script setup lang="ts">
	import { type informativeCoordsMarker } from "~/types/types";

	const props = defineProps<{
		backendServiceTypeName: string;
		clientServiceTypeName: string;
		optionalElementsRendered: string[];
		towingDistance?: number;
	}>();
	const emits = defineEmits<{
		appendInfoMarker: [informativeCoordsMarker];
	}>();

	const {
		vehicleRegistration,
		vehicleMake,
		vehicleModel,
		vehicleTypeIndex,
		userName,
		userPhoneNumber,
		formSubmissionLoading,
		vehicleSearchLoading,
		loadingVehicleTypes,
		currentPercentage,
		freeDistanceLeftForTowing,
		vehicleTypes,
		pickupLatitude,
		pickupLongitude,
		destinationLongitude,
		destinationLatitude,
		requestRemarks,
		vehicleClass,
		fuelType,
		fuelAmount,
		haveSpareTyre,
		tyreType,
		makeServiceRequest,
		searchVehicleRegistration,
	} = useServiceRequests();

	const computedServiceCost: ComputedRef<number> = computed(() => {
		const selectedVehicleType = vehicleTypes.value
			? vehicleTypes.value[vehicleTypeIndex.value]
			: null;
		if (computedTowingDistance.value) {
			const towingCost = calculateTowingCharge(
				selectedVehicleType.towingRate.withinThreshHoldPrice,
				computedTowingDistance.value,
				selectedVehicleType.towingRate.overThreshHoldPriceMembers,
				freeDistanceLeftForTowing.value,
				selectedVehicleType.towingRate.threshHoldDistance
			);
			return towingCost;
		} else {
			return 0;
		}
	});

	const computedTowingDistance: ComputedRef<number | undefined> = computed(
		() => {
			return props.towingDistance;
		}
	);

	watch([pickupLatitude, pickupLongitude], (newValues) => {
		if (
			newValues[0] !== Number.NEGATIVE_INFINITY &&
			newValues[1] !== Number.NEGATIVE_INFINITY
		) {
			emits("appendInfoMarker", {
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
			emits("appendInfoMarker", {
				id: 1,
				info: "Destination Is Here",
				coords: {
					lat: newValues[0],
					lng: newValues[1],
				},
			});
		}
	});

	const calculateTowingCharge = (
		basePrice: number,
		distance: number,
		chargePerExtraKm: number,
		freeDistanceBenefit: number,
		thresholdDistance: number
	): number => {
		if (freeDistanceBenefit <= 0) {
			if (distance < thresholdDistance) {
				return basePrice;
			} else {
				return (
					basePrice +
					(distance - thresholdDistance) * chargePerExtraKm
				);
			}
		}

		const distanceAboveBenefit = distance - freeDistanceBenefit;
		if (distanceAboveBenefit >= 0) {
			return 0 + distanceAboveBenefit * chargePerExtraKm;
		} else {
			return 0;
		}
	};
</script>

<style lang="css">
	.progressbar {
		width: v-bind(currentPercentage);
	}
</style>
