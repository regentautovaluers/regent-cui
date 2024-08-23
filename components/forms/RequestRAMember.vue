<template>
	<form
		class="mt-2"
		@submit.prevent="
			makeServiceRequest(
				computedServiceCost,
				props.backendRAName,
				computedTowingDistance,
			)
		">
		<div class="registration relative w-full">
			<div class="flex items-center space-x-2">
				<input
					type="text"
					id="registration-number"
					class="generic-input"
					placeholder="Search Vehicle Registration"
					v-model="vehicleRegistration"
					required
					maxlength="8" />

				<button
					type="button"
					class="generic-form-submit mb-0 w-1/4"
					:disabled="vehicleRegistration.length < 8"
					@click.prevent="searchVehicleRegistration">
					<FormSubmissionLoader
						classes="mr-2 size-6 animate-spin text-white"
						v-if="vehicleSearchLoading" />
					{{ vehicleSearchLoading ? $t('request_processing') : 'Search' }}
				</button>
			</div>
		</div>
		<!-- Progress Bar -->
		<div
			class="my-3"
			v-if="renderElementForService('ra-towing-request')">
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

		<!-- Client Name Field -->
		<div class="mt-4">
			<label
				for="client-name"
				class="generic-input-label"
				>Client Name</label
			>
			<input
				type="text"
				id="client-name"
				class="generic-input"
				placeholder="e.g Client Name"
				v-model="userName"
				required
				disabled />
		</div>

		<!-- Vehicle Make and Model -->
		<div class="mt-4 flex w-full space-x-4">
			<!-- Vehicle Make -->
			<div class="w-full lg:w-1/2">
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
					disabled
					v-model="vehicleMake" />
			</div>

			<!-- Vehicle Model -->
			<div class="w-full lg:w-1/2">
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
					disabled
					v-model="vehicleModel" />
			</div>
		</div>

		<!-- vehicle type as published by Regent -->
		<div
			class="mt-4 w-full space-y-2"
			v-if="renderElementForService('ra-towing-request')">
			<label
				for="vehicle-type"
				class="generic-input-label"
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
		<div v-if="renderElementForService('ra-tyrechange-request')">
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
							stringToSentenceCase(vType) === 'Unknown'
								? "I Don't Know"
								: stringToSentenceCase(vType)
						}}
					</option>
				</select>
			</div>
		</div>

		<!-- vehicle class as published by Regent -->
		<div
			class="mt-4 w-full space-y-2"
			v-if="renderElementForService('ra-jumpstarting-request')">
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
			v-if="renderElementForService('ra-fueldelivery-request')">
			<label
				for="fuel-type"
				class="generic-input-label"
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
				class="generic-input-label"
				>Client Location</label
			>
			<div class="relative">
				<input
					type="text"
					id="client-location"
					class="generic-input-modified peer"
					placeholder="Type an address to search"
					required />
				<PickupLocationIcon
					classes="flex-shrink-0 size-9 transition duration-75 text-gray-500 group-hover:text-blue-600 absolute left-0 top-1/3 -translate-y-1 peer-focus:text-blue-600" />
			</div>
		</div>

		<!-- drop off location -->
		<div
			class="mt-5"
			v-if="renderElementForService('ra-towing-request')">
			<label
				for="dropoff-location"
				class="generic-input-label"
				>Drop Off Location</label
			>
			<div class="relative">
				<input
					type="text"
					id="dropoff-location"
					class="generic-input-modified peer"
					placeholder="Type an address to search"
					required />
				<DropOffLocationIcon
					classes="flex-shrink-0 size-7 transition duration-75 text-gray-500 group-hover:text-blue-600 absolute left-0 top-1/3 -translate-y-1 peer-focus:text-blue-600" />
			</div>
		</div>

		<!-- comments -->
		<div class="my-5">
			<label
				for="comments-box"
				class="generic-input-label"
				>Comments</label
			>
			<textarea
				id="comments-box"
				class="block w-full rounded-lg border-gray-200 px-4 py-3 text-gray-600 focus:border-blue-500 focus:ring-blue-500"
				rows="4"
				placeholder="Provide optional details for this request."
				v-model="requestRemarks"></textarea>
		</div>

		<!-- statistics -->
		<div class="mt-8 flex justify-between space-x-4">
			<div
				class="w-1/3 rounded-lg border border-pink-500 p-3"
				v-if="renderElementForService('ra-towing-request')">
				<h1 class="text-lg font-semibold text-pink-500">Distance</h1>
				<h2 class="text-lg font-semibold text-gray-500">{{ computedTowingDistance }} Km</h2>
			</div>
			<div
				class="w-1/3 rounded-lg border border-pink-500 p-3"
				v-if="renderElementForService('ra-towing-request')">
				<h1 class="text-lg font-semibold text-pink-500">Free Tow</h1>
				<h2 class="text-lg font-semibold text-gray-500">
					{{ freeDistanceLeftForTowing }}Km
				</h2>
			</div>
			<div
				class="rounded-lg border border-pink-500 p-3"
				:class="renderElementForService('ra-towing-request') ? 'w-1/3' : 'w-full'">
				<h1 class="text-lg font-semibold text-pink-500">Cost</h1>
				<h2 class="text-lg font-semibold text-gray-500">{{ computedServiceCost }} Ksh</h2>
			</div>
		</div>

		<!-- submit button -->
		<button
			type="submit"
			class="generic-form-submit mt-3">
			<FormSubmissionLoader
				classes="mr-2 size-6 animate-spin text-white"
				v-if="formSubmissionLoading" />
			{{
				formSubmissionLoading
					? $t('request_processing')
					: `Make ${props.roadsideAssistanceName} Request`
			}}
		</button>
	</form>
</template>

<script setup lang="ts">
	import { type MapCoordsMarker } from '~/types';

	const props = defineProps({
		backendRAName: { required: true, type: String },
		roadsideAssistanceName: { required: true, type: String },
		towingDistance: { required: false, type: Number },
	});

	const route = useRoute();
	const emits = defineEmits(['populate-map-pin']);
	const populatePin = (coordinatesMarker: MapCoordsMarker) => {
		emits('populate-map-pin', coordinatesMarker);
	};

	const computedTowingDistance: ComputedRef<number | undefined> = computed(() => {
		return props.towingDistance ?? 0;
	});

	const {
		vehicleRegistration,
		vehicleMake,
		vehicleModel,
		vehicleTypeIndex,
		userName,
		formSubmissionLoading,
		vehicleSearchLoading,
		loadingVehicleTypes,
		currentPercentage,
		freeDistanceLeftForTowing,
		isMemberUnderEA,
		vehicleTypes,
		requestRemarks,
		vehicleClass,
		fuelType,
		haveSpareTyre,
		tyreType,
		makeServiceRequest,
		searchVehicleRegistration,
		calculateTowingChargeMember,
		calculateTowingChargeNonMember,
		renderElementForService,
		bindToDropOffLocation,
		bindToPickUpLocation,
	} = useRoadsideAssistanceRequests(populatePin);

	const computedServiceCost: ComputedRef<number> = computed(() => {
		if (
			[
				'ra-jumpstarting-request',
				'ra-fueldelivery-request',
				'ra-tyrechange-request',
			].includes(route.name as string)
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

	onMounted(async () => await Promise.all([bindToDropOffLocation(), bindToPickUpLocation()]));
</script>

<style lang="css">
	.progressbar {
		width: v-bind(currentPercentage);
	}
</style>
