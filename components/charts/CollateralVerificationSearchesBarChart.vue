<template>
	<Bar
		:data="data"
		:options="{
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				y: {
					beginAtZero: true,
				},
			},
			plugins: {
				legend: { display: false },
			},
		}" />
</template>

<script setup lang="ts">
	import { Bar } from 'vue-chartjs';
	const props = defineProps({
		labels: { type: Array<string>, required: true },
		data: { type: Array<number>, required: true },
	});

	const data = computed(() => {
		return {
			labels: props.labels,
			datasets: [
				{
					// label: 'Data One',
					backgroundColor: '#2563EB',
					data: props.data,
					borderRadius: 4,
					borderWidth: 1,
				},
			],
		};
	});

	const options = {
		responsive: true,
		maintainAspectRatio: false,
	};
</script>
