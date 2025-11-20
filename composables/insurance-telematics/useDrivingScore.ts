import { type TrackedVehicles } from '~/types/regent-tracking/tracked-vehicles';
import {
	type RiskLevel,
	type DriverRiskScore,
} from '~/types/insurance-telematics/driver-behaviour';
import { type DeviceHistory, type Item2 } from '~/types/regent-tracking/device-history';

export type driverBehaviour = '' | '' | '';
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
	const { fromDate, toDate, fetchMultipleDeviceHistory } = useRegentTrackingDeviceHistory();
	const activeRiskLevel: Ref<RiskLevel | null> = ref(null);
	const computingDriverRiskLevel: Ref<boolean> = ref(false);

	const totalVehicles: ComputedRef<number> = computed(() =>
		!getClientDevices.value ? 0 : getClientDevices.value.length,
	);

	const computedVehicles: ComputedRef<{
		vehicles: TrackedVehicles[] | null;
		totalPages: number;
	}> = computed(() => {
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
		computedVehicles,
		async (newList) => {
			// filter the small list for viable entries
			let viable: TrackedVehicles[] | undefined = newList.vehicles?.filter(
				(v: TrackedVehicles) => !isDeviceSubscriptionExpired(v) && !v.driverRiskScore,
			);

			if (viable && viable?.length > 0) {
				computingDriverRiskLevel.value = true;
				const histories: DeviceHistory[] = await fetchMultipleDeviceHistory(
					viable.map((e) => e.id),
				);

				// compute results
				histories.forEach((h) => {
					const deviceId: number = h.device.id;
					const totalDistanceTraveled = Number(h.distance_sum.split(' ')[0]);
					let analysis: DriverRiskScore | null = {
						deviceId,
						totalDistanceTraveled,
						harshAccelerationScore: null,
						brakingScore: null,
						overspeedScore: null,
						averageScore: 0,
					};

					const appearanceMetrics: {
						harshAccelerationAppearances: number;
						harshBrakingAppearances: number;
					} = {
						harshAccelerationAppearances: 0,
						harshBrakingAppearances: 0,
					};
					for (let v of h.items) {
						// 1. Access the inner Item2 object(s)
						if (v.items && v.items.length > 0) {
							for (let v2 of v.items) {
								// Check if the Item2 object and its other_arr exist
								if (v2.other_arr) {
									// 2. Find the string whose name part is "io253"
									const eventString = v2.other_arr.find((str) =>
										str.includes('io253'),
									);

									if (eventString) {
										// Extract the value part (after the colon)
										const value = eventString.split(':')[1]?.trim();

										// 3. Update appearances based on the value
										if (value === '1') {
											appearanceMetrics.harshAccelerationAppearances += 1;
										} else if (value === '2') {
											appearanceMetrics.harshBrakingAppearances += 1;
										}
									}
								}
							}
						}
					}

					// for the braking score
					const brakingPercentageScore = calculateBrakingScore(
						appearanceMetrics.harshBrakingAppearances,
						totalDistanceTraveled,
					);
					analysis.brakingScore = {
						rawScore: appearanceMetrics.harshBrakingAppearances,
						riskLevel: calculateRiskLevel(brakingPercentageScore),
						percentageScore: brakingPercentageScore,
					};

					// for the harsh acceleration
					const harshAcclerationPercentageScore = calculateHarshAccelerationScore(
						appearanceMetrics.harshAccelerationAppearances,
						totalDistanceTraveled,
					);
					analysis.harshAccelerationScore = {
						rawScore: appearanceMetrics.harshAccelerationAppearances,
						riskLevel: calculateRiskLevel(harshAcclerationPercentageScore),
						percentageScore: harshAcclerationPercentageScore,
					};
					analysis.averageScore = calculateAverageRiskScore(
						harshAcclerationPercentageScore,
						brakingPercentageScore,
						0,
					);

					console.log('appearance metrics:', appearanceMetrics, 'analysis:', analysis);
					setDeviceDriverBehaviour(analysis);
				});
			}

			computingDriverRiskLevel.value = false;
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

	// calculator functions
	function calculateHarshAccelerationScore(
		accelerationCount: number,
		distanceDriven: number,
	): number {
		return Number(((accelerationCount / distanceDriven) * 100).toFixed(2));
	}

	function calculateBrakingScore(breakingCount: number, distanceDriven: number): number {
		return Number(((breakingCount / distanceDriven) * 100).toFixed(2));
	}

	function calculateOverspeedScore(overspeedDuration: number, distanceDriven: number): number {
		return (overspeedDuration / 10 / distanceDriven) * 100;
	}

	function calculateRiskLevel(percentageScore: number): RiskLevel {
		if (percentageScore >= 80) {
			return 'high';
		} else if (percentageScore >= 60 && percentageScore <= 79) {
			return 'medium';
		} else {
			return 'low';
		}
	}

	function calculateAverageRiskScore(
		harshAccelerationScore: number,
		brakingScore: number,
		overspeedScore: number,
	): number {
		return Number(((harshAccelerationScore + brakingScore + overspeedScore) / 3).toFixed(2));
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
		setRiskLevel,
	};
}
