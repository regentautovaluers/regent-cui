import {
	getRAAnalytics,
	getTotalCompleted,
	setTotalCompleted,
	setRAAnalytics,
	cleanRAAnalytics,
} from '~/stores/ra-and-memberships-chart-store';
import { type RoadsideAssistanceAnalytics } from '~/types';

export const useRAIncidentsAnalytics = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();

	const computedAnalytics: ComputedRef<RoadsideAssistanceAnalytics> = computed(
		() => getRAAnalytics.value,
	);

	const computedMostRequested: ComputedRef<string> = computed(() => {
		const analyticsData = computedAnalytics.value;
		let mostRequestedKey = '';
		let mostRequestedValue = 0;
		Object.keys(analyticsData).forEach((key) => {
			if (analyticsData[key] > mostRequestedValue) {
				mostRequestedValue = analyticsData[key];
				mostRequestedKey = key;
			}
		});
		return `${stringToTitleCase(mostRequestedKey)} (${mostRequestedValue})`;
	});

	const { status: fetchRAIncidentsAnalyticsStatus, error: fetchRAIncidentsAnalyticsError } =
		useFetch(() => `/api/v1/corp/reports/corporate-requests/${getPrincipal.value.corpId}`, {
			key: 'ra-incidents-analytics',
			baseURL: runtimeConfig.public.AVA_BASE_URL,
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
			server: false,
			lazy: true,
			onResponse({ response }) {
				if (response.status === 200) {
					const analyticsData = response._data;
					setRAAnalytics({
						towing: analyticsData.towing,
						tyrechange: analyticsData.tyrechange,
						fueldelivery: analyticsData.fueldelivery,
						jumpstarting: analyticsData.jumpstarting,
					});

					setTotalCompleted(analyticsData.totalCompleted);
				}
			},
		});

	return {
		fetchRAIncidentsAnalyticsStatus,
		fetchRAIncidentsAnalyticsError,
		computedAnalytics,
		computedMostRequested,
		getRAAnalytics,
		getTotalCompleted,
	};
};

export const useAVAMembershipsCharts = () => {};
