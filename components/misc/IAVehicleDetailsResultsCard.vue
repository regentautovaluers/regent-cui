<template>
	<div class="mt-4 min-h-32 rounded-md bg-white p-8 shadow-md">
		<h1 class="text-2xl font-semibold">
			{{ props.regNo }} - {{ props.yearOfManufacture }} - {{ props.vehicleMake }}
			{{ props.vehicleModel }}
		</h1>
		<div class="flex h-12 items-center space-x-5">
			<div class="flex w-fit items-center space-x-2 text-gray-600">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M2 4h2v16H2zm4 0h1v16H6zm2 0h2v16H8zm3 0h2v16h-2zm3 0h2v16h-2zm3 0h1v16h-1zm2 0h3v16h-3z" />
				</svg>
				<span>Chassis No: {{ props.chassisNumber }}</span>
			</div>
			<div class="flex w-fit items-center space-x-2 text-gray-600">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M7 4v2h3v2H7l-2 2v3H3v-3H1v8h2v-3h2v3h3l2 2h8v-4h2v3h3V9h-3v3h-2V8h-6V6h3V4z" />
				</svg>
				<span class="text-gray-600">Engine No: {{ props.engineNumber }}</span>
			</div>
			<div class="flex w-fit items-center space-x-2 text-gray-600">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M3 2h3c.28 0 .53.11.71.29l2.08 2.09l.8-.79C10 3.2 10.5 3 11 3h6c.5 0 1 .2 1.41.59l1 1C19.8 5 20 5.5 20 6v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8c0-.5.2-1 .59-1.41l.79-.8L5.59 4H3zm8 3v2h6V5zm.41 6l-2-2H8v1.41l2 2v3.18l-2 2V19h1.41l2-2h3.18l2 2H18v-1.41l-2-2v-3.18l2-2V9h-1.41l-2 2zm.59 2h2v2h-2z" />
				</svg>
				<span class="text-gray-600">Fuel Type: {{ props.fuelType }}</span>
			</div>
			<div class="flex w-fit items-center space-x-2 text-gray-600">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M9 19h6v2H9c-2.76 0-5-2.24-5-5V7h2v9c0 1.66 1.34 3 3 3m1.42-13.59c.78-.78.78-2.05 0-2.83s-2.05-.78-2.83 0s-.78 2.05 0 2.83c.78.79 2.04.79 2.83 0M11.5 9c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v6c0 1.66 1.34 3 3 3h5.07l3.5 3.5L20 20.07L14.93 15H11.5z" />
				</svg>
				<span class="text-gray-600">Pasenger Capacity: {{ props.passengerCapacity }}</span>
			</div>
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
