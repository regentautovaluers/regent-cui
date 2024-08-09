<template>
	<div class="flex size-60 flex-col items-center justify-center rounded-xl border shadow-md">
		<div class="size-28 rounded-full bg-red-500 p-2">
			<!-- <img
				src=""
				alt="Vehicle Image" /> -->
		</div>

		<span class="text-center font-semibold">{{ componentProps.clientName }}</span>
		<span class="text-center font-semibold text-gray-500">{{
			componentProps.vehicleMake
		}}</span>
		<div class="mt-2 flex w-full items-center justify-center space-x-3">
			<span class="font-semibold text-pink-500">{{ componentProps.vehicleRegNo }}</span>
			<NuxtLink
				:to="{
					name: 'valuation-view-report',
					query: {
						registration: componentProps.vehicleRegNo,
						id: componentProps.vehicleId,
					},
				}"
				class="font-semibold text-blue-500 hover:text-blue-600">
				View Report
			</NuxtLink>
		</div>
	</div>
</template>

<script setup lang="ts">
	const componentProps = defineProps<{
		vehicleId: string;
		vehicleRegNo: string;
		clientName: string;
		vehicleMake: string;
		vehicleModel: string;
	}>();
</script>
