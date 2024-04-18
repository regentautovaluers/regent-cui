<template>
	<Doughnut
		:data="chartData"
		:options="chartOptions" />
</template>

<script setup lang="ts">
	import { Doughnut } from "vue-chartjs";
	const { getDetails } = usePrincipal();
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
			},
		],
	}));
	const chartOptions = ref({
		responsive: true,
		maintainAspectRatio: false,
		cutoutPercentage: 70,
		legend: {
			display: false,
		},
	});
	try {
		await $fetch(
			`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/corp/reports/donut-graph-data`,
			{
				method: "GET",
				query: {
					corporateId: getDetails.company,
				},
				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error(
							"Failed to retrieve corporate's members"
						);
					}

					totalActive.value = response._data.active;
					totalInactive.value = response._data.inactive;
					totalPaid.value = response._data.paid;
					totalUnpaid.value = response._data.unpaid;
					totalMemberships.value = response._data.total;
				},
			}
		);
	} catch (error) {}
</script>
