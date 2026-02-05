export const useAVAMembershipsCharts = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();

	const { data: avaMembersDistribution, status: fetchAvaMembersDistributionStatus } = useFetch(
		() =>
			`/api/v1/corp/reports/donut-graph-data?corporateId=${getPrincipal()?.corpOrganization.corpId}`,
		{
			key: 'ava-members-distribution',
			baseURL: runtimeConfig.public.AVA_BASE_URL,
			method: 'GET',
			headers: {
				Accept: '',
			},
			server: false,
			lazy: true,
			transform: (res: any) => {
				return res.data;
			},
		},
	);

	const computeActiveInactive: ComputedRef<number[]> = computed(() => {
		if (avaMembersDistribution.value) {
			return [avaMembersDistribution.value.active, avaMembersDistribution.value.inactive];
		}

		return [];
	});

	const computedTotal: ComputedRef<number> = computed(
		() => avaMembersDistribution.value.active + avaMembersDistribution.value.inactive,
	);

	return {
		fetchAvaMembersDistributionStatus,
		computeActiveInactive,
		computedTotal,
	};
};
