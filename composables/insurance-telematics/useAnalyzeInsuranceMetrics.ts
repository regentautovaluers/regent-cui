import { type TrackedVehicles } from '~/types/regent-tracking/tracked-vehicles';
import type { FilterTimelines } from '~/types/regent-tracking/device-history';
import {
	type RiskLevel,
	type DriverRiskScore,
} from '~/types/insurance-telematics/driver-behaviour';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import type { AccidentAnalytics } from '~/types/insurance-telematics/accident-record';
import {
	getComputingAnalyticsFor,
	setComputingAnalyticsFor,
	getTotalAnalyticsDone,
	setTotalAnalyticsDone,
	clearAnalyticsCounter,
	setInsuranceTelematicsTrackingRunning,
	getInsuranceTelematicsTrackingRunning,
	resetInsuranceTelematics,
} from '#imports';

type ComputedVehicles = {
	vehicles: TrackedVehicles[] | null;
	totalPages: number;
};
export default function () {
	const size: Ref<number> = ref(10);
	const page: Ref<number> = ref(0);
	const searchString: Ref<string | null> = ref(null);
	const {
		fetchingClientVehicles,
		errorFetchingClientVehicles,
		getClientDevices,
		isDeviceSubscriptionExpired,
	} = useRegentDeviceTracking();
	const { fromDate, toDate, calculateDateRange } = useRegentTrackingDeviceHistory();
	const activeRiskLevel: Ref<RiskLevel | null> = ref(null);
	const computingInsuranceMetrics: ComputedRef<boolean> = computed(
		() => getInsuranceTelematicsTrackingRunning.value,
	);
	const totalVehicles: ComputedRef<number> = computed(() =>
		!getClientDevices.value ? 0 : getClientDevices.value.length,
	);
	const availablePeriodButtons: { name: string; period: FilterTimelines }[] = [
		{
			name: 'Today',
			period: 'today',
		},
		{
			name: 'This Week',
			period: 'this-week',
		},
		{
			name: 'Last 30 Days',
			period: 'last-30-days',
		},
		{
			name: 'Last 3 Months',
			period: 'last-3-months',
		},
	];
	const filterPeriod: Ref<FilterTimelines> = ref('this-week');
	let analysisController = new AbortController();

	const computedVehicles: ComputedRef<ComputedVehicles> = computed(() => {
		const filtered = getFilteredVehicles();
		const start = page.value * size.value;
		return {
			vehicles: !filtered.length
				? null
				: (filtered.slice(start, start + size.value) as TrackedVehicles[]),
			totalPages: Math.ceil(filtered.length / size.value) || 1,
		};
	});

	watch(
		[() => getClientDevices.value?.map((v) => v.id).join(','), () => filterPeriod.value],
		async ([newIdString, newFilterPeriod], [_oldIdString, oldFilterPeriod]) => {
			// Validation: Ensure we have vehicles and something actually changed
			if (!newIdString || !computedVehicles.value.vehicles) return;

			// Kill any existing stream before starting a new one
			analysisController.abort();
			analysisController = new AbortController();

			// 1. Get all unexpired vehicles first
			const allVehicles = getClientDevices.value || [];
			const unexpired = allVehicles.filter(
				(v) => !isDeviceSubscriptionExpired(v as TrackedVehicles),
			);

			const viable = unexpired.filter((v) => {
				// FORCE RELOAD: If the user actually changed the date range,
				// we must ignore existing data because it's for the wrong time period.
				if (oldFilterPeriod !== undefined && newFilterPeriod !== oldFilterPeriod) {
					return true;
				}

				// DATA CHECK: Only include if it's missing insurance OR accident data.
				// If both fields exist, this returns false and the vehicle is skipped.
				const hasInsurance = !!v.driverRiskScore;
				const hasAccidents = !!v.latestAccident;

				return !(hasInsurance && hasAccidents);
			});

			if (viable && viable.length > 0) {
				// remove existing telematics for all viable vehicles
				viable.forEach((e) => resetInsuranceTelematics(e.id));
				setInsuranceTelematicsTrackingRunning();

				clearAnalyticsCounter();
				setComputingAnalyticsFor(viable.length);

				const { startDate: fromDate, endDate: toDate } =
					calculateDateRange(newFilterPeriod);

				try {
					await fetchEventSource('/api/regent-tracking/insurance-telematics', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						// Provide the abort signal to the fetch call
						signal: analysisController.signal,
						body: JSON.stringify({
							vehicleIds: viable.map((e) => e.id),
							fromDate,
							toDate,
						}),
						onmessage(msg) {
							// If the user aborted, this might still fire once; guard against it
							if (analysisController.signal.aborted) return;

							if (msg.data === '__DONE__') {
								setInsuranceTelematicsTrackingRunning();
								useToast('Done computing for all vehicles!', {
									type: 'success',
									title: 'Computations done!',
								});
								return;
							}

							try {
								const result: {
									driverBehaviour: DriverRiskScore;
									accidentAnalysis: AccidentAnalytics;
								} = JSON.parse(msg.data);
								setDeviceDriverBehaviour(result.driverBehaviour);
								setLastDeviceAccident(result.accidentAnalysis);
								setTotalAnalyticsDone();
							} catch (e) {
								console.error('Failed to parse stream segment', e);
							}
						},
						onclose() {
							setInsuranceTelematicsTrackingRunning();
							console.log('Stream connection closed gracefully');
						},
						onerror(err) {
							// Don't throw if it was a manual abort
							if (err.name === 'AbortError') return;
							setInsuranceTelematicsTrackingRunning();
							throw err;
						},
					});
				} catch (err: any) {
					if (err.name !== 'AbortError') {
						console.error('SSE Stream Error:', err);
					}
				} finally {
					setInsuranceTelematicsTrackingRunning();
				}
			}
		},
		{ immediate: true },
	);

	function getFilteredVehicles() {
		if (!getClientDevices.value) return [];

		const vehicles = getClientDevices.value;
		const search = searchString.value ? searchString.value.toLowerCase() : '';

		return vehicles.filter((v) => {
			// // 1. Watchlist Filter
			// const passesWatchlistFilter = !onlyOnWatchlist.value || v.on_watchlist;

			// 2. Search Filter
			const passesSearchFilter =
				!search ||
				v.name?.toLowerCase().includes(search) ||
				v.driver_data.name?.toLowerCase().includes(search);

			// A vehicle must pass BOTH filters to be included
			return passesSearchFilter;
		});
	}

	function setRiskLevel(newLevel: RiskLevel | null) {
		activeRiskLevel.value = newLevel;
	}

	function setFilterPeriod(period: FilterTimelines) {
		filterPeriod.value = period;
	}

	return {
		page,
		size,
		searchString,
		computedVehicles,
		fetchingClientVehicles,
		activeRiskLevel,
		errorFetchingClientVehicles,
		totalVehicles,
		fromDate,
		toDate,
		computingInsuranceMetrics,
		filterPeriod,
		getComputingAnalyticsFor,
		availablePeriodButtons,
		getTotalAnalyticsDone,
		setRiskLevel,
		setFilterPeriod,
		isDeviceSubscriptionExpired,
	};
}
