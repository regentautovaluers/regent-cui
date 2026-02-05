import {
	getRAAnalytics,
	getTotalCompleted,
	setTotalCompleted,
	setRAAnalytics,
	cleanRAAnalytics,
} from '~/stores/roadside-assistance-store';
import { type RoadsideAssistanceAnalytics } from '~/types';

export const useRACharts = () => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const doughnutChartColors: readonly string[] = ['#09bc3c', '#fd5353', '#fdbf20', '#0063FF'];

	const { status: fetchRAIncidentsAnalyticsStatus } = useFetch(
		() => `/api/v1/corp/reports/corporate-requests/${getPrincipal()?.corpOrganization.corpId}`,
		{
			key: 'ra-incidents-analytics',
			baseURL: runtimeConfig.public.AVA_BASE_URL,
			method: 'GET',
			headers: {
				Accept: '',
			},
			server: false,
			lazy: true,
			onResponse({ response }) {
				if (response.ok) {
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
		},
	);

	const raIncidentsDoughnutData: ComputedRef<{
		data: number[];
		legends: string[];
		colors: string[];
	}> = computed(() => {
		const analyticsData: RoadsideAssistanceAnalytics = getRAAnalytics.value;
		const legends: string[] = [];
		const data: number[] = [];

		Object.keys(analyticsData).forEach((key) => {
			if (analyticsData[key] > 0) {
				legends.push(stringToTitleCase(key));
				data.push(analyticsData[key]);
			}
		});

		return {
			data: data,
			legends: legends,
			colors: doughnutChartColors.slice(0, legends.length),
		};
	});

	const computedMostRequested: ComputedRef<string> = computed(() => {
		const analyticsData: RoadsideAssistanceAnalytics = getRAAnalytics.value;
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

	return {
		fetchRAIncidentsAnalyticsStatus,
		computedMostRequested,
		raIncidentsDoughnutData,
		getRAAnalytics,
		getTotalCompleted,
	};
};
