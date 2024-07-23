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

		<!-- vehicle type as published by Regent -->
		<div
			class="w-full space-y-2 mt-4"
			v-if="props.clientServiceTypeName === 'Towing'">
			<label
				for="vehicle-type"
				class="block font-medium dark:text-white"
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

		<!-- tire metadata -->
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
			v-if="props.optionalElementsRendered.includes('fuelData')">
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
			v-if="props.optionalElementsRendered.includes('dropoffLocation')">
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
		<div class="flex justify-between mt-8 space-x-4">
			<div
				class="w-1/2 p-3 rounded-lg border border-pink-500"
				v-if="props.clientServiceTypeName === 'Towing'">
				<h1 class="text-lg font-semibold text-pink-500">Distance</h1>
				<h1 class="text-lg font-semibold text-gray-500">
					{{ computedTowingDistance }}Km
				</h1>
			</div>
			<div
				class="p-3 rounded-lg border border-pink-500"
				:class="
					props.clientServiceTypeName === 'Towing'
						? 'w-1/2'
						: 'w-full'
				">
				<h1 class="text-lg font-semibold text-pink-500">Cost</h1>
				<h1
					class="text-lg font-semibold text-gray-500"
					v-if="
						[
							'ava-jumpstarting',
							'ava-fuel-delivery',
							'ava-tyre-change',
						].includes(route.name as string)
					">
					{{ staticServiceCost }}Ksh
				</h1>
				<h1
					class="text-lg font-semibold text-gray-500"
					v-else>
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
	const route = useRoute();

	const {
		vehicleRegistration,
		vehicleMake,
		vehicleModel,
		vehicleTypeIndex,
		userName,
		userPhoneNumber,
		userEmail,
		formSubmissionLoading,
		loadingVehicleTypes,
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
		staticServiceCost,
		makeServiceRequest,
	} = useServiceRequests();

	const computedServiceCost: ComputedRef<number> = computed(() => {
		const selectedVehicleType = vehicleTypes.value
			? vehicleTypes.value[vehicleTypeIndex.value]
			: null;
		if (computedTowingDistance.value) {
			const towingCost = calculateTowingCharge(
				selectedVehicleType.towingRate.withinThreshHoldPrice,
				computedTowingDistance.value,
				selectedVehicleType.towingRate.overThreshHoldPriceNonMembers
			);
			return towingCost || 0;
		} else {
			return 0;
		}
	});

	const computedTowingDistance: ComputedRef<number | undefined> = computed(
		() => props.towingDistance
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

	watch(
		[destinationLatitude, destinationLongitude],
		(newValues) => {
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
		},
		{ immediate: false }
	);

	const calculateTowingCharge = (
		basePrice: number,
		distance: number,
		chargePerExtraKm: number
	): number => {
		if (distance < 10) {
			return basePrice;
		}

		return basePrice + (distance - 10) * chargePerExtraKm;
	};
</script>
