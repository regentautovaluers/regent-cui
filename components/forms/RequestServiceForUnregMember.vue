<template>
	<form
		class="py-12"
		@submit.prevent="
			makeServiceRequest(
				['ava-jumpstarting', 'ava-fuel-delivery', 'ava-tyre-change'].includes(
					route.name as string,
				)
					? staticServiceCost
					: computedServiceCost,
				props.backendServiceTypeName,
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
					class="mb-2 block font-medium dark:text-white"
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
					class="mb-2 block font-medium dark:text-white"
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
				class="mb-2 block font-medium dark:text-white"
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
		<div class="mt-3 w-full">
			<label
				for="vehicle-registration-number"
				class="mb-2 block font-medium dark:text-white"
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
			class="my-5 flex flex-col items-center justify-between space-x-0 space-y-3 lg:flex-row lg:space-x-3 lg:space-y-0">
			<!-- Reg Number -->

			<!-- Vehicle Make -->
			<div class="w-full lg:w-1/2">
				<label
					for="vehicle-make"
					class="mb-2 block font-medium dark:text-white"
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
					class="mb-2 block font-medium dark:text-white"
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
			class="mt-4 w-full space-y-2"
			v-if="props.clientServiceTypeName === 'Towing'">
			<label
				for="vehicle-type"
				class="block font-medium dark:text-white"
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

		<!-- tire metadata -->
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
				class="mb-2 block font-medium dark:text-white"
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
				class="mb-2 block font-medium dark:text-white"
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
				class="mb-2 block font-medium dark:text-white"
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
				class="w-1/2 rounded-lg border border-pink-500 p-3"
				v-if="props.clientServiceTypeName === 'Towing'">
				<h1 class="text-lg font-semibold text-pink-500">Distance</h1>
				<h1 class="text-lg font-semibold text-gray-500">{{ computedTowingDistance }}Km</h1>
			</div>
			<div
				class="rounded-lg border border-pink-500 p-3"
				:class="props.clientServiceTypeName === 'Towing' ? 'w-1/2' : 'w-full'">
				<h1 class="text-lg font-semibold text-pink-500">Cost</h1>
				<h1
					class="text-lg font-semibold text-gray-500"
					v-if="
						['ava-jumpstarting', 'ava-fuel-delivery', 'ava-tyre-change'].includes(
							route.name as string,
						)
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
		calculateTowingChargeNonMember,
	} = useServiceRequests();

	const computedServiceCost: ComputedRef<number> = computed(() => {
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

	watch(userPhoneNumber, (newNumber) => {
		if (newNumber.startsWith('0') || newNumber.startsWith('+254')) {
			userPhoneNumber.value = newNumber.replace(/^(\+254|0)/, '254');
		}
	});

	watch(
		[destinationLatitude, destinationLongitude],
		(newValues) => {
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
		},
		{ immediate: false },
	);
</script>
