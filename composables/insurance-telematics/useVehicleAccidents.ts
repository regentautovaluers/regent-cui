import { type TrackedVehicles } from '~/types/regent-tracking/tracked-vehicles';
import {
	type AccidentSeverity,
	type AccidentAnalytics,
	type AccidentLocationCoords,
} from '~/types/insurance-telematics/accident-record';
import { type DeviceHistory } from '~/types/regent-tracking/device-history';

type ComputedVehicles = {
	vehicles: TrackedVehicles[] | null;
	totalPages: number;
};
export function useVehicleAccidents() {
	const G_FORCE_MULTIPLIER = 0.01;
	const size: Ref<number> = ref(10);
	const page: Ref<number> = ref(0);
	const searchString: Ref<string | null> = ref(null);
	const {
		fetchingClientVehicles,
		errorFetchingClientVehicles,
		getClientDevices,
		isDeviceSubscriptionExpired,
	} = useRegentDeviceTracking();
	const { fromDate, toDate, fetchMultipleDeviceHistory } = useRegentTrackingDeviceHistory();
	const activeRiskLevel: Ref<AccidentSeverity | null> = ref(null);
	const computingIncidentAnalyticsMetrics: Ref<boolean> = ref(false);
	const totalVehicles: ComputedRef<number> = computed(() =>
		!getClientDevices.value ? 0 : getClientDevices.value.length,
	);
	const filterPeriod: Ref<
		'today' | 'this-week' | 'last-30-days' | 'last-3-months' | 'last-6-months'
	> = ref('this-week');
	const { gecodeLocation } = useGoogleMaps();

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

	watch(computedVehicles, async (newList) => await deriveDriverBehaviour(newList), {
		immediate: true,
	});

	async function deriveDriverBehaviour(newList: ComputedVehicles): Promise<void> {
		// filter the small list for viable entries
		let viable: TrackedVehicles[] | undefined = newList.vehicles?.filter(
			(v: TrackedVehicles) => !isDeviceSubscriptionExpired(v) && !v.latestAccident,
		);

		if (viable && viable?.length > 0) {
			computingIncidentAnalyticsMetrics.value = true;
			const histories: DeviceHistory[] = await fetchMultipleDeviceHistory(
				viable.map((e) => e.id),
				filterPeriod.value,
			);

			// compute results
			histories.forEach(async (h) => {
				const deviceId: number = h.device.id;
				let analysis: AccidentAnalytics = {
					deviceId,
					coords: null,
					geoCodeLocation: null,
					time: null,
					speedBeforeCrash: null,
					speedUnits: null,
					impactForce: null,
					severity: null,
					harshBrakingBeforeCrash: false,
				};

				coreLoop: for (let v of h.items) {
					// 1. Access the inner Item2 object(s)
					if (v.items && v.items.length > 0) {
						_lookupLoop: for (let x = v.items.length - 1; x >= 0; x--) {
							// Check if the Item2 object and its other_arr exist
							const other_arr = v.items[x].other_arr;
							if (other_arr) {
								// 2. Find the string whose name part is "io247"
								const eventString = other_arr.find((str) => str.includes('io247'));

								if (eventString) {
									analysis.coords = {
										lat: v.items[x].lat,
										lng: v.items[x].lng,
									};
									analysis.geoCodeLocation = await gecodeLocation(
										v.items[x].lat,
										v.items[x].lng,
									);
									analysis.time = v.items[x].device_time as string;
									analysis.speedBeforeCrash = v.items[x].speed ?? null;
									analysis.speedUnits = 'Km/h';

									setLastDeviceAccident(analysis);

									// short circuit the loop
									continue coreLoop;
								}

								// 3. Find the string whose name part is io 254
								const gForceString = other_arr.find((str) => str.includes('io254'));
								if (gForceString) {
									const force: number = gForceString
										.split(':')[1]
										.trim() as unknown as number;
									analysis.impactForce = force * G_FORCE_MULTIPLIER;
								}

								// 4. Check for harsh braking
								const harshBrakingEventString = other_arr.find((str) =>
									str.includes('io253'),
								);
								if (harshBrakingEventString) {
									const value = harshBrakingEventString.split(':')[1]?.trim();
									if (value === '2') {
										analysis.harshBrakingBeforeCrash = true;
									}
								}
							}
						}
					}
				}
			});
		}

		computingIncidentAnalyticsMetrics.value = false;
	}

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
		computingIncidentAnalyticsMetrics,
		filterPeriod,
		setFilterPeriod,
	};
}
