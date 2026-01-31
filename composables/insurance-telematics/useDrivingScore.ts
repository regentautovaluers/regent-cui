import { type TrackedVehicles } from '~/types/regent-tracking/tracked-vehicles';
import type { FilterTimelines } from '~/types/regent-tracking/device-history';
import {
	type RiskLevel,
	type DriverRiskScore,
} from '~/types/insurance-telematics/driver-behaviour';
import { fetchEventSource } from '@microsoft/fetch-event-source';

type ComputedVehicles = {
	vehicles: TrackedVehicles[] | null;
	totalPages: number;
};
export function useDrivingScore() {
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
	const computingDriverRiskLevel: Ref<boolean> = ref(false);
	const totalVehicles: ComputedRef<number> = computed(() =>
		!getClientDevices.value ? 0 : getClientDevices.value.length,
	);
	const filterPeriod: Ref<FilterTimelines> = ref('this-week');
	let analysisController = new AbortController();
	const computingFor: Ref<number> = ref(0);
	const totalDone: Ref<number> = ref(0);

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

			const viable =
				newFilterPeriod != oldFilterPeriod
					? getClientDevices.value?.filter(
							(v) => !isDeviceSubscriptionExpired(v as TrackedVehicles),
						)
					: getClientDevices.value?.filter(
							(v) =>
								!isDeviceSubscriptionExpired(v as TrackedVehicles) &&
								!v.driverRiskScore,
						);

			if (viable && viable.length > 0) {
				computingFor.value = viable.length;

				const { startDate: fromDate, endDate: toDate } =
					calculateDateRange(newFilterPeriod);

				computingDriverRiskLevel.value = true;
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
								computingDriverRiskLevel.value = false;
								return;
							}

							try {
								const result: DriverRiskScore = JSON.parse(msg.data);
								setDeviceDriverBehaviour(result);
								totalDone.value += 1;
							} catch (e) {
								console.error('Failed to parse stream segment', e);
							}
						},
						onclose() {
							computingDriverRiskLevel.value = false;
							console.log('Stream connection closed gracefully');
						},
						onerror(err) {
							// Don't throw if it was a manual abort
							if (err.name === 'AbortError') return;
							computingDriverRiskLevel.value = false;
							throw err;
						},
					});
				} catch (err: any) {
					if (err.name !== 'AbortError') {
						console.error('SSE Stream Error:', err);
					}
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

	function setFilterPeriod(period: 'today' | 'this-week' | 'last-30-days' | 'last-3-months') {
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
		computingDriverRiskLevel,
		filterPeriod,
		computingFor,
		totalDone,
		setRiskLevel,
		setFilterPeriod,
	};
}
