<template>
	<form
		class="mt-2"
		@submit.prevent="
			makeServiceRequest(
				['ava-jumpstarting', 'ava-fuel-delivery', 'ava-tyre-change'].includes(
					route.name as string,
				)
					? staticServiceCost
					: computedServiceCost,
				props.backendRAName,
				computedTowingDistance,
			)
		">
		<!-- client contacts -->
		<div
			class="flex flex-col items-center justify-between space-x-0 space-y-3 lg:flex-row lg:space-x-3 lg:space-y-0">
			<!-- Full Name Field -->
			<div class="w-full lg:w-1/2">
				<label
					for="full-name"
					class="generic-input-label after:ml-0.5 after:text-gray-600 after:content-['*']"
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
					class="generic-input-label after:ml-0.5 after:text-gray-600 after:content-['*']"
					>Phone</label
				>
				<input
					type="text"
					id="phone"
					class="generic-input"
					placeholder="e.g. 2547..."
					v-model="userPhoneNumber"
					required />
			</div>
		</div>

		<!-- Client Email -->
		<div class="mt-3 w-full">
			<label
				for="client-email"
				class="generic-input-label"
				>Client Email</label
			>
			<input
				type="text"
				id="client-email"
				class="generic-input"
				placeholder="Valid client's email"
				v-model="userEmail" />
		</div>

		<!-- Vehicle Registration -->
		<div class="mt-3 w-full">
			<label
				for="vehicle-registration-number"
				class="generic-input-label"
				>Vehicle Registration Number</label
			>
			<input
				type="text"
				id="vehicle-registration-number"
				class="generic-input"
				placeholder="e.g.KCD 345G"
				v-model="vehicleRegistration" />
		</div>

		<!-- vehicle registration, make, model -->
		<div
			class="my-5 flex flex-col items-center justify-between space-x-0 space-y-3 lg:flex-row lg:space-x-3 lg:space-y-0">
			<!-- Reg Number -->

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
					v-model="vehicleModel" />
			</div>
		</div>

		<!-- vehicle type as published by Regent -->
		<div
			class="mt-4 w-full space-y-2"
			v-if="renderElementForService('ra-towing-request')">
			<label
				for="vehicle-type"
				class="generic-input-label after:ml-0.5 after:text-gray-600 after:content-['*']"
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
				<div
					class="flex h-14 items-center rounded-lg border border-gray-200 ps-4 hover:bg-gray-200">
					<input
						id="has-spare-tyre"
						type="radio"
						:value="true"
						v-model="haveSpareTyre"
						name="bordered-radio"
						class="size-6 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500" />
					<label
						for="has-spare-tyre"
						class="ms-2 w-full py-4 font-medium text-gray-600"
						>Client Has Spare Tyre</label
					>
				</div>
				<div
					class="flex h-14 items-center rounded-lg border border-gray-200 ps-4 hover:bg-gray-200">
					<input
						checked
						id="has-no-spare-tyre"
						type="radio"
						:value="false"
						v-model="haveSpareTyre"
						name="bordered-radio"
						class="size-6 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500" />
					<label
						for="has-no-spare-tyre"
						class="ms-2 w-full py-4 font-medium text-gray-600"
						>Client Has No Spare Tyre</label
					>
				</div>
			</div>
			<div class="mt-4 flex w-full flex-col">
				<label
					for="fuel-type"
					class="generic-input-label"
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
				class="generic-input-label"
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
				class="w-1/2 rounded-lg border border-pink-500 p-3"
				v-if="renderElementForService('ra-towing-request')">
				<h1 class="text-lg font-semibold text-pink-500">Distance</h1>
				<h1 class="text-lg font-semibold text-gray-500">{{ computedTowingDistance }}Km</h1>
			</div>
			<div
				class="rounded-lg border border-pink-500 p-3"
				:class="renderElementForService('ra-towing-request') ? 'w-1/2' : 'w-full'">
				<h1 class="text-lg font-semibold text-pink-500">Cost</h1>
				<h1 class="text-lg font-semibold text-gray-500">{{ computedServiceCost }}Ksh</h1>
			</div>
		</div>

		<!-- submit button -->
		<button
			type="submit"
			class="generic-form-submit mt-3">
			<FormSubmissionLoader
				classes="mr-2 size-6 animate-spin text-white"
				v-if="makeRequestLoading" />
			{{
				makeRequestLoading
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

	const {
		vehicleRegistration,
		vehicleMake,
		vehicleModel,
		vehicleTypeIndex,
		userName,
		userPhoneNumber,
		userEmail,
		makeRequestLoading,
		loadingVehicleTypes,
		vehicleTypes,
		requestRemarks,
		vehicleClass,
		fuelType,
		haveSpareTyre,
		tyreType,
		staticServiceCost,
		makeServiceRequest,
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
			return staticServiceCost.value;
		}

		const selectedVehicleType = vehicleTypes.value
			? vehicleTypes.value[vehicleTypeIndex.value]
			: null;
		if (computedTowingDistance.value) {
			const towingCost = calculateTowingChargeNonMember(
				selectedVehicleType.towingRate.withinThreshHoldPrice,
				computedTowingDistance.value,
				selectedVehicleType.towingRate.overThreshHoldPriceNonMembers,
			);
			return towingCost || 0;
		} else {
			return 0;
		}
	});

	const computedTowingDistance: ComputedRef<number | undefined> = computed(
		() => props.towingDistance,
	);

	watch(userPhoneNumber, (newNumber) => {
		if (newNumber.startsWith('0') || newNumber.startsWith('+254')) {
			userPhoneNumber.value = newNumber.replace(/^(\+254|0)/, '254');
		}
	});

	onMounted(async () => await Promise.all([bindToDropOffLocation(), bindToPickUpLocation()]));
</script>
