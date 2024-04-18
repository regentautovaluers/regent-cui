<template>
	<Doughnut
		:data="chartData"
		:options="chartOptions" />
</template>

<script setup lang="ts">
	import { Doughnut } from "vue-chartjs";

	const componentProps = defineProps<{
		totalFuelDelivery: number;
		totalJumpstarting: number;
		totalTowing: number;
		totalTyreChange: number;
		totalCollective: number;
	}>();
	const countFuelDelivery = computed(() => componentProps.totalFuelDelivery);
	const countJumpstarting = computed(() => componentProps.totalJumpstarting);
	const countTowing = computed(() => componentProps.totalTowing);
	const countTyreChange = computed(() => componentProps.totalTyreChange);
	const countTotalIncidents = computed(() => componentProps.totalCollective);
	const chartData = computed(() => ({
		labels: ["Fuel Delivery", "Jumpstarting", "Towing", "Tyre Change"],
		datasets: [
			{
				backgroundColor: ["#f87979", "#7d669e", "#53bbb4", "#f39c12"],
				data: [
					countFuelDelivery.value || 0,
					countJumpstarting.value || 0,
					countTowing.value || 0,
					countTyreChange.value || 0,
				],
				spacing: 5,
			},
		],
	}));
	const chartOptions = ref({
		responsive: true,
		maintainAspectRatio: false,
		cutoutPercentage: 70,
		legend: {
			display: true,
		},
	});
</script>
