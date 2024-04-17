<template>
	<h1>chart should be here</h1>
</template>

<script setup lang="ts">
	const { getDetails } = usePrincipal();
	const runtimeConfig = useRuntimeConfig();
	const totalActive: Ref<number | null> = ref(null);
	const totalInactive: Ref<number | null> = ref(null);
	const totalPaid: Ref<number | null> = ref(null);
	const totalUnpaid: Ref<number | null> = ref(null);
	const totalMemberships: Ref<number | null> = ref(null);

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
