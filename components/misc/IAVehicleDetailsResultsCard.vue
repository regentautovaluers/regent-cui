<template>
	<div class="mt-5 space-y-2 text-sm text-gray-500">
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Registration Number</span>
			<span>{{ props.regNo ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Year of Manufacture</span>
			<span>{{ props.yearOfManufacture ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Vehicle Make</span>
			<span>{{ props.vehicleMake ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Vehicle Model</span>
			<span>{{ props.vehicleModel ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Chassis Number</span>
			<span>{{ props.chassisNumber ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Engine Number</span>
			<span>{{ props.engineNumber ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Fuel Type</span>
			<span>{{ props.fuelType ?? 'N/A' }}</span>
		</div>
		<div class="flex items-center justify-between border-b py-2">
			<span class="font-semibold">Passenger Capacity</span>
			<span>{{ props.passengerCapacity ?? 'N/A' }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
	const props = defineProps({
		regNo: {
			type: String,
			required: true,
		},
		yearOfManufacture: {
			type: Number,
			required: true,
		},
		vehicleMake: {
			type: String,
			required: true,
		},
		vehicleModel: {
			type: String,
			required: true,
		},
		chassisNumber: {
			type: String,
			required: true,
		},
		engineNumber: {
			type: String,
			required: true,
		},
		fuelType: {
			type: String,
			required: true,
		},
		passengerCapacity: {
			type: Number,
			required: true,
		},
	});
</script>
