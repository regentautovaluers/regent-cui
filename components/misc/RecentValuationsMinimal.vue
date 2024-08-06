<template>
	<div class="size-60 rounded-xl shadow-md border flex flex-col items-center justify-center">
		<div class="rounded-full p-2 size-28 bg-red-500">
			<!-- <img
				src=""
				alt="Vehicle Image" /> -->
		</div>

		<span class="font-semibold text-center">{{ componentProps.clientName }}</span>
		<span class="font-semibold text-gray-500 text-center">{{
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
