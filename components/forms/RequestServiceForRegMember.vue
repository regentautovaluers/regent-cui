<template>
	<form
		class="py-12"
		@submit.prevent="
			makeServiceRequest(
				['ava-jumpstarting', 'ava-fuel-delivery', 'ava-tyre-change'].includes(
					route.name as string,
				)
					? 0
					: computedServiceCost,
				props.backendServiceTypeName,
				computedTowingDistance,
			)
		">
		<div class="registration relative w-full">
			<label
				for="registration-number"
				class="mb-2 block font-medium"
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
					class="form-submit relative h-[3.2rem] w-1/4 overflow-clip rounded-xl py-2 text-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300"
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
				class="flex h-3 w-full overflow-hidden rounded-full bg-gray-200"
				role="progressbar"
				aria-valuenow="1"
				aria-valuemin="0"
				aria-valuemax="100">
				<div
					class="flex flex-col justify-center overflow-hidden whitespace-nowrap rounded-full bg-pink-600 text-center text-xs text-white transition duration-500"
					:style="{ width: `${currentPercentage}%` }" />
			</div>
			<div
				class="mt-3 flex w-full items-center justify-between text-end text-gray-500 antialiased">
				<span> {{ vehicleRegistration }} </span>
				<span>{{ freeDistanceLeftForTowing }} KM FREE TOWING LEFT</span>
			</div>
		</div>
		<!-- End Progress Bar -->

		<!-- client contacts -->

		<!-- Client Name Field -->
		<div class="mt-4">
			<label
				for="client-name"
				class="mb-2 block font-medium"
				>Client Name</label
			>
			<input
				type="text"
				id="client-name"
				class="generic-input"
				placeholder="Client Name"
				v-model="userName"
				required
				disabled />
		</div>

		<!-- Phone Field -->
		<div class="mt-4">
			<label
				for="phone"
				class="mb-2 block font-medium"
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

		<!-- Vehicle Make and Model -->
		<div class="mt-4 flex w-full space-x-4">
			<!-- Vehicle Make -->
			<div class="w-full lg:w-1/2">
				<label
					for="vehicle-make"
					class="mb-2 block font-medium"
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
					class="mb-2 block font-medium"
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
			class="mt-4 w-full space-y-2"
			v-if="props.clientServiceTypeName === 'Towing'">
			<label
				for="vehicle-type"
				class="block font-medium"
				>Vehicle Type</label
			>
			<select
				class="generic-input"
				:class="loadingVehicleTypes ? 'opactiy-50 animate-pulse' : null"
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
			<div class="my-4 space-y-2">
				<div>
					<input
						id="button1"
						type="radio"
						name="radio-vertical-group"
						class="peer hidden"
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
						class="peer hidden"
						:value="false"
						v-model="haveSpareTyre" />
					<label
						for="button2"
						class="radio-inputs">
						Client Does Not Have a Spare Tyre
					</label>
				</div>
			</div>
			<div class="mt-4 flex w-full flex-col">
				<label
					for="fuel-type"
					class="mb-2 whitespace-nowrap font-medium"
					>Tyre Type</label
				>
				<select
					class="generic-input"
					id="fuel-type"
					required
					v-model="tyreType">
					<option value="">Select a Tyre Type</option>
					<option
						v-for="(vType, index) in ['tube', 'tubeless', 'unknown']"
						:key="index"
						:value="vType">
						{{
							capitalizeFirstLetterOfEachWord(vType) === 'Unknown'
								? "I Don't Know"
								: capitalizeFirstLetterOfEachWord(vType)
						}}
					</option>
				</select>
			</div>
		</div>

		<!-- vehicle class as published by Regent -->
		<div
			class="mt-4 w-full space-y-2"
			v-if="props.optionalElementsRendered.includes('vehicleClass')">
			<label
				for="vehicle-type"
				class="block font-medium"
				>Vehicle Class (Type)</label
			>
			<select
				class="generic-input"
				:class="loadingVehicleTypes ? 'opactiy-50 animate-pulse' : null"
				id="vehicle-type"
				required
				v-model.number="vehicleClass">
				<option
					v-for="(type, i) in vehicleTypes"
					:key="i"
					:value="type.id">
					{{ type.description }}
				</option>
			</select>
		</div>

		<!-- fuel type and cost -->

		<div
			class="my-5 flex flex-col justify-between space-x-0"
			v-if="props.optionalElementsRendered.includes('fuelData')">
			<label
				for="fuel-type"
				class="mb-2 block font-medium dark:text-white"
				>Fuel Type</label
			>
			<select
				class="generic-input"
				id="fuel-type"
				v-model="fuelType"
				required>
				<option
					v-for="(fuelType, index) in ['Diesel', 'Petrol']"
					:key="index"
					:value="fuelType">
					{{ fuelType }}
				</option>
			</select>
		</div>

		<!-- pickup location -->
		<div class="mt-5">
			<label
				for="client-location"
				class="mb-2 block font-medium"
				>Client Location</label
			>
			<div class="relative">
				<input
					type="text"
					id="client-location"
					class="w-full border-b-2 border-x-transparent border-b-gray-200 border-t-transparent bg-transparent py-5 ps-10 focus:border-x-transparent focus:border-b-blue-500 focus:border-t-transparent focus:ring-0"
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
				class="mb-2 block font-medium"
				>Drop Off Location</label
			>
			<div class="relative">
				<input
					type="text"
					id="dropoff-location"
					class="w-full border-b-2 border-x-transparent border-b-gray-200 border-t-transparent bg-transparent py-5 ps-10 focus:border-x-transparent focus:border-b-blue-500 focus:border-t-transparent focus:ring-0"
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
				class="mb-2 block font-medium"
				>Comments</label
			>
			<textarea
				id="comments-box"
				class="block w-full rounded-lg border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
				rows="6"
				placeholder="Provide optional comments for this request."
				v-model="requestRemarks"></textarea>
		</div>

		<!-- statistics -->
		<div class="mt-8 flex justify-between space-x-4">
			<div
				class="w-1/3 rounded-lg border border-pink-500 p-3"
				v-if="props.clientServiceTypeName === 'Towing'">
				<h1 class="text-lg font-semibold text-pink-500">Distance</h1>
				<h1 class="text-lg font-semibold text-gray-500">{{ computedTowingDistance }}Km</h1>
			</div>
			<div
				class="w-1/3 rounded-lg border border-pink-500 p-3"
				v-if="props.clientServiceTypeName === 'Towing'">
				<h1 class="text-lg font-semibold text-pink-500">Free Tow</h1>
				<h1 class="text-lg font-semibold text-gray-500">
					{{ freeDistanceLeftForTowing }}Km
				</h1>
			</div>
			<div
				class="rounded-lg border border-pink-500 p-3"
				:class="props.clientServiceTypeName === 'Towing' ? 'w-1/3' : 'w-full'">
				<h1 class="text-lg font-semibold text-pink-500">Cost</h1>
				<h1
					class="text-lg font-semibold text-gray-500"
					v-if="
						['ava-jumpstarting', 'ava-fuel-delivery', 'ava-tyre-change'].includes(
							route.name as string,
						)
					">
					0Ksh
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
			class="form-submit relative mt-4 h-14 overflow-clip text-lg">
			<LoadingIndicator
				v-if="formSubmissionLoading"
				inject-classes="absolute w-[100%] mt-0 -top-1" />
			<span v-if="formSubmissionLoading">Processing...</span>
			<span v-else>Submit {{ props.clientServiceTypeName }} Request</span>
		</button>
	</form>
</template>

<script setup lang="ts">
	import { type informativeCoordsMarker } from '~/types/types';

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
		formSubmissionLoading,
		vehicleSearchLoading,
		loadingVehicleTypes,
		currentPercentage,
		freeDistanceLeftForTowing,
		isMemberUnderEA,
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
		calculateTowingChargeMember,
		calculateTowingChargeNonMember,
	} = useServiceRequests();

	const computedServiceCost: ComputedRef<number> = computed(() => {
		if (
			['ava-jumpstarting', 'ava-fuel-delivery', 'ava-tyre-change'].includes(
				route.name as string,
			)
		) {
			return 0;
		}

		const selectedVehicleType = vehicleTypes.value
			? vehicleTypes.value[vehicleTypeIndex.value]
			: null;
		if (
			computedTowingDistance.value &&
			selectedVehicleType &&
			isMemberUnderEA.value === false
		) {
			const towingCost = calculateTowingChargeMember(
				selectedVehicleType.towingRate.withinThreshHoldPrice,
				computedTowingDistance.value,
				selectedVehicleType.towingRate.overThreshHoldPriceMembers,
				freeDistanceLeftForTowing.value,
				selectedVehicleType.towingRate.threshHoldDistance,
			);
			return towingCost;
		} else if (
			computedTowingDistance.value &&
			selectedVehicleType &&
			isMemberUnderEA.value === true
		) {
			const towingCost = calculateTowingChargeNonMember(
				selectedVehicleType.towingRate.withinThreshHoldPrice,
				computedTowingDistance.value,
				selectedVehicleType.towingRate.overThreshHoldPriceNonMembers,
			);

			return towingCost;
		} else {
			return 0;
		}
	});

	const computedTowingDistance: ComputedRef<number | undefined> = computed(() => {
		return props.towingDistance;
	});

	watch([pickupLatitude, pickupLongitude], (newValues) => {
		if (
			newValues[0] !== Number.NEGATIVE_INFINITY &&
			newValues[1] !== Number.NEGATIVE_INFINITY
		) {
			emits('appendInfoMarker', {
				id: 0,
				info: 'Client Is Here',
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
			emits('appendInfoMarker', {
				id: 1,
				info: 'Destination Is Here',
				coords: {
					lat: newValues[0],
					lng: newValues[1],
				},
			});
		}
	});
</script>

<style lang="css">
	.progressbar {
		width: v-bind(currentPercentage);
	}
</style>
