<template>
	<Bar
		:data="data"
		:options="{
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				y: {
					beginAtZero: true,
					ticks: {
						stepSize: 1,
					},
					title: {
						display: true,
						text: 'Number of Requests',
					},
				},
				x: {
					title: {
						display: true,
						text: 'Search Type',
					},
				},
			},
			plugins: {
				legend: { display: false },
				datalabels: {
					color: 'rgba(37, 99, 235)',
				},
			},
		}" />
</template>

<script setup lang="ts">
	import { Bar } from 'vue-chartjs';
	const props = defineProps({
		labels: { type: Array<string>, required: true },
		data: { type: Array<number>, required: true },
	});
	const computedData = computed(() => props.data.sort((a, b) => a - b));

	const data = computed(() => {
		return {
			labels: props.labels,
			datasets: [
				{
					// label: 'Data One',
					backgroundColor: generateBarRGBAColor(props.data.length, true),
					borderColor: generateBarRGBAColor(props.data.length, false),
					data: props.data,
					borderWidth: 5,
				},
			],
		};
	});

	function generateBarRGBAColor(totalEntries: number, withAlpha: boolean): string[] {
		const colors: string[] = [];
		for (let e = 0; e < totalEntries; e++) {
			colors.push(`rgba(37, 99, 235, ${withAlpha ? '0.6' : '0.0'})`);
		}

		return colors;
	}
</script>
