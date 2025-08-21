<template>
	<div>
		<Doughnut
			id="incidents-distribution"
			:options="{
				responsive: true,
				maintainAspectRatio: false,
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
					annotation: {
						annotations: {
							label1: {
								type: 'label',
								xValue: 2.5,
								content: [`${props.total}`, 'Vehicles'],
								font: [
									{
										size: 40,
										weight: 'bold',
									},
									{
										size: 18,
									},
								],
							},
						},
					},
				},
			}"
			:data="chartData" />
	</div>
</template>

<script setup lang="ts">
	import { Doughnut } from 'vue-chartjs';

	const props = defineProps({
		colors: { type: Array<string>, required: true },
		labels: { type: Array<string>, required: true },
		data: { type: Array<number>, required: true },
		total: { type: Number, required: true },
	});

	const colors = computed(() => props.colors);
	const data = computed(() => props.data);

	const chartData = reactive({
		labels: [...props.labels],
		datasets: [
			{
				backgroundColor: [...colors.value],
				data: [...data.value],
				spacing: 0,
				hoverOffset: 8,
				borderRadius: 0,
				clip: false,
				weight: 4,
				datalabels: {
					display: true,
					color: 'white',
					font: {
						size: 18,
						weight: 'bold',
					},
					formatter: (value: number, ctx) => {
						if (value === 0) return '';
						const datapoints = ctx.chart.data.datasets[0].data;
						const total = datapoints.reduce((total, datapoint) => total + datapoint, 0);
						const percentage = (value / total) * 100;
						return percentage.toFixed(0) + '%';
					},
				},
			},
		],
	});
</script>
