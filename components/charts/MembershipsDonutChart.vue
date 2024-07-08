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

	const { getPrincipal } = useAuth();
	const runtimeConfig = useRuntimeConfig();
	const totalActive: Ref<number> = ref(0);
	const totalInactive: Ref<number> = ref(0);
	const totalPaid: Ref<number> = ref(0);
	const totalUnpaid: Ref<number> = ref(0);
	const totalMemberships: Ref<number> = ref(0);

	const chartData = computed(() => ({
		labels: ["Paid", "Unpaid", "Active", "Inactive"],
		datasets: [
			{
				backgroundColor: ["#f87979", "#7d669e", "#53bbb4", "#f39c12"],
				data: [
					totalPaid.value || 0,
					totalUnpaid.value || 0,
					totalActive.value || 0,
					totalInactive.value || 0,
				],
				spacing: 5,
				hoverOffset: 15,
				borderRadius: 6,
				clip: false,
				weight: 4,
			},
		],
	}));

	await useFetch("/api/v1/corp/reports/donut-graph-data", {
		baseURL: runtimeConfig.public.AVA_BASE_URL,
		method: "GET",
		query: {
			corporateId: getPrincipal.value.corpId,
		},
		server: false,
		lazy: false,

		async onResponse({ response }) {
			if (response.status !== 200) {
				throw new Error("Failed to retrieve corporate's members");
			}

			totalActive.value = response._data.active;
			totalInactive.value = response._data.inactive;
			totalPaid.value = response._data.paid;
			totalUnpaid.value = response._data.unpaid;
			totalMemberships.value = response._data.total;
		},
	});
</script>
