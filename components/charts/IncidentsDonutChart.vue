<template>
	<Doughnut
		:data="chartData"
		:options="{
			responsive: true,
			// maintainAspectRatio: true,
			// aspectRatio: 1,
			plugins: {
				legend: {
					display: true,
					position: 'bottom',
					reverse: true,
					align: 'center',
					fullSize: true,
					labels: {
						boxWidth: 18,
						boxHeight: 18,
						borderRadius: 10,
						useBorderRadius: true,
						textAlign: 'center',
						usePointStyle: true,
						pointStyle: 'circle',
						font: {
							size: 14,
							weight: 'bold',
						},
					},
				},
			},
		}" />
</template>

<script setup lang="ts">
	import { Doughnut } from "vue-chartjs";

	const componentProps = defineProps<{
		totalFuelDelivery: number | undefined;
		totalJumpstarting: number | undefined;
		totalTowing: number | undefined;
		totalTyreChange: number | undefined;
	}>();
	const countFuelDelivery = computed(() => componentProps.totalFuelDelivery);
	const countJumpstarting = computed(() => componentProps.totalJumpstarting);
	const countTowing = computed(() => componentProps.totalTowing);
	const countTyreChange = computed(() => componentProps.totalTyreChange);
	const countTotalIncidents = computed(
		componentProps.totalFuelDelivery +
			componentProps.totalJumpstarting +
			componentProps.totalTowing +
			componentProps.totalTyreChange
	);
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
				hoverOffset: 15,
				borderRadius: 6,
				clip: false,
				weight: 4,
				datalabels: {
					display: true,
					color: "white",
					font: {
						size: 18,
						weight: "bold",
					},
					formatter: (value, ctx) => {
						if (value === 0) return "";
						const datapoints = ctx.chart.data.datasets[0].data;
						const total = datapoints.reduce(
							(total, datapoint) => total + datapoint,
							0
						);
						const percentage = (value / total) * 100;
						return percentage.toFixed(0) + "%";
					},
				},
			},
		],
	}));
</script>
