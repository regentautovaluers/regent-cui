import {
	type DeviceHistory,
	type Item,
	type Item2,
	type VehicleMovement,
	type DayMovement,
	type IdlePeriods,
} from '~/types/regent-tracking/device-history';
import { type StandardSuccessResponse, type StandardErrorResponse } from '~/types/proxy-types';
import { type VehiclePing, type AnalyzedLocation } from '~/types/regent-tracking/device-history';

export async function useRegentTrackingDeviceHistory() {
	const { query } = useRoute();
	const filterPeriod: Ref<'today' | 'this-week' | 'last-30-days ' | 'last-3-months' | 'custom'> =
		ref('this-week');
	const positionOnMap: Ref<{
		lat: number;
		lng: number;
		event: 'start' | 'stop' | 'idle';
		time: string;
	} | null> = ref(null);
	const polylineCoords: Ref<{ lat: number; lng: number }[] | null> = ref(null);

	function setPolylineCoords(input: DayMovement) {
		polylineCoords.value = input.pingHistory;
	}

	function setFilterPeriod(
		period: 'today' | 'this-week' | 'last-30-days ' | 'last-3-months' | 'custom',
	) {
		filterPeriod.value = period;
	}

	function setPositionOnMap(
		position: {
			lat: number;
			lng: number;
			event: 'start' | 'stop' | 'idle';
			time: string;
		} | null,
	) {
		positionOnMap.value = position;
	}

	const {
		data: deviceHistory,
		pending: fetchingDeviceHistory,
		error: errorFetchingDeviceHistory,
	} = await useApiData<DeviceHistory, DeviceHistory>(
		`device-history-${query.device_id}`,
		`/api/regent-tracking/device-history?api_hash=$2y$10$VG5xofVqWW6B1gu2zLDFYezsoLkyUonucCKZyR5tAFqb7XV5Tx2yi&device_id=${query.device_id}&from_date=2025-09-15&from_time=00:00:00&to_date=2025-09-19&to_time=12:00:00`,
		{
			method: 'GET',
			server: false,
			transform: (response) => {
				// Check if the API call was successful
				if (response.success) {
					// The response.data is correctly typed as DeviceHistory here.
					return (response as StandardSuccessResponse<DeviceHistory>).data;
				}

				// If it failed, throw the error
				throw new Error(
					(response as StandardErrorResponse).metadata.message || 'Unknown error',
				);
			},
			lazy: true,
		},
	);

	const nestingAreas: ComputedRef<AnalyzedLocation[]> = computed(() => {
		if (deviceHistory.value) {
			return analyzeVehicleStops(
				deviceHistory.value.items.map((item) => ({
					lat: item.items[0].lat,
					lng: item.items[0].lng,
					time_recorded: item.items[0].time,
				})),
				100,
				2,
			);
		}

		return [];
	});

	const deviceMovement = computed<DayMovement[]>(() => {
		if (!deviceHistory.value || !Array.isArray(deviceHistory.value.items)) {
			return [];
		}

		const movementsByDay: Record<string, DayMovement> = {};
		let currentTrip:
			| (Omit<
					VehicleMovement,
					| 'totalDistance'
					| 'averageSpeed'
					| 'drivingDuration'
					| 'totalIdleDuration'
					| 'idlePeriods'
			  > & { idlePeriods: IdlePeriods[]; totalIdleDuration: number })
			| null = null;
		let currentIdlePeriod: Omit<IdlePeriods, 'durationInMinutes'> | null = null;
		let tripPings: Item2[] = [];

		// Helper: Parse "motion" and "ignition" from other_arr
		const getMotionAndIgnition = (
			otherArr: string[] = [],
		): { motion: boolean; ignition: boolean } => {
			const motion =
				otherArr
					.find((item) => item.startsWith('motion:'))
					?.split(':')[1]
					.trim() === 'true';
			const ignition =
				otherArr
					.find((item) => item.startsWith('ignition:'))
					?.split(':')[1]
					.trim() === 'true';
			return { motion, ignition };
		};

		// Sort the pings by time to ensure correct sequential processing
		const sortedPings = deviceHistory.value.items.sort((a, b) => {
			return (
				new Date(a.items[0].raw_time).getTime() - new Date(b.items[0].raw_time).getTime()
			);
		});

		sortedPings.forEach((item: Item) => {
			const ping = item.items[0];
			if (!ping || !ping.raw_time) return;

			const date = ping.raw_time.split(' ')[0];
			const { motion, ignition } = getMotionAndIgnition(ping.other_arr);

			// Initialize the daily entry if it doesn't exist
			if (!movementsByDay[date]) {
				movementsByDay[date] = {
					date,
					movement: [],
					pingHistory: [],
				};
			}

			// Add to ping history, ensuring valid coordinates
			if (ping.lat != null && ping.lng != null) {
				movementsByDay[date].pingHistory.push({
					lat: Number(ping.lat),
					lng: Number(ping.lng),
				});
			}

			// --- Core Trip Logic ---
			if (motion && ignition) {
				// Start of a trip or continuation of a trip
				if (!currentTrip) {
					currentTrip = {
						startedAt: ping.raw_time,
						startAtLat: Number(ping.lat),
						startAtLng: Number(ping.lng),
						stoppedAt: null,
						stoppedAtLat: null,
						stoppedAtLng: null,
						idlePeriods: [],
						totalIdleDuration: 0,
					};
				}
				// End any current idle period
				if (currentIdlePeriod) {
					currentIdlePeriod.stoppedAt = ping.raw_time;
					const idleDurationMs =
						new Date(currentIdlePeriod.stoppedAt).getTime() -
						new Date(currentIdlePeriod.startedAt).getTime();
					currentTrip.idlePeriods.push({
						...currentIdlePeriod,
						durationInMinutes: idleDurationMs / 60000,
					});
					currentTrip.totalIdleDuration += idleDurationMs;
					currentIdlePeriod = null;
				}
				tripPings.push(ping);
			} else if (!motion && ignition) {
				// Vehicle is idling
				if (currentTrip && !currentIdlePeriod) {
					currentIdlePeriod = {
						startedAt: ping.raw_time,
						stoppedAt: null,
					};
				}
				tripPings.push(ping);
			} else if (currentTrip) {
				// End of a trip (engine turned off)
				// First, end any existing idle period
				if (currentIdlePeriod) {
					currentIdlePeriod.stoppedAt = ping.raw_time;
					const idleDurationMs =
						new Date(currentIdlePeriod.stoppedAt).getTime() -
						new Date(currentIdlePeriod.startedAt).getTime();
					currentTrip.idlePeriods.push({
						...currentIdlePeriod,
						durationInMinutes: idleDurationMs / 60000,
					});
					currentTrip.totalIdleDuration += idleDurationMs;
					currentIdlePeriod = null;
				}

				// Then, close the trip
				currentTrip.stoppedAt = ping.raw_time;
				currentTrip.stoppedAtLat = Number(ping.lat);
				currentTrip.stoppedAtLng = Number(ping.lng);
				tripPings.push(ping); // Include the last ping in the trip calculation

				// Calculate and finalize the trip
				const totalDistance = tripPings.reduce((sum, p) => sum + (p.distance || 0), 0);
				const averageSpeed =
					tripPings.reduce((sum, p) => sum + (p.speed || 0), 0) / tripPings.length;

				const start = new Date(currentTrip.startedAt);
				const end = new Date(currentTrip.stoppedAt);
				const totalTripDurationMs = end.getTime() - start.getTime();

				const drivingDurationMs = totalTripDurationMs - currentTrip.totalIdleDuration;
				const drivingDurationHours = drivingDurationMs / (1000 * 60 * 60);
				const drivingDuration = `${Math.floor(drivingDurationHours)}h ${Math.floor((drivingDurationHours % 1) * 60)}m`;

				const totalIdleDurationHours = currentTrip.totalIdleDuration / (1000 * 60 * 60);
				const totalIdleDuration = `${Math.floor(totalIdleDurationHours)}h ${Math.floor((totalIdleDurationHours % 1) * 60)}m`;

				movementsByDay[date].movement.push({
					...currentTrip,
					totalDistance: Number(totalDistance.toFixed(2)),
					averageSpeed: Number(averageSpeed.toFixed(2)),
					drivingDuration,
					totalIdleDuration,
				});

				// Reset for the next trip
				currentTrip = null;
				tripPings = [];
			}
		});

		// Handle a trip that is still in progress at the end of the data stream
		if (currentTrip && tripPings.length > 0) {
			if (currentIdlePeriod) {
				const lastPing = tripPings[tripPings.length - 1];
				currentIdlePeriod.stoppedAt = lastPing.raw_time;
				const idleDurationMs =
					new Date(currentIdlePeriod.stoppedAt).getTime() -
					new Date(currentIdlePeriod.startedAt).getTime();
				currentTrip.idlePeriods.push({
					...currentIdlePeriod,
					durationInMinutes: idleDurationMs / 60000,
				});
				currentTrip.totalIdleDuration += idleDurationMs;
			}

			const lastPing = tripPings[tripPings.length - 1];
			currentTrip.stoppedAt = lastPing.raw_time;
			currentTrip.stoppedAtLat = Number(lastPing.lat);
			currentTrip.stoppedAtLng = Number(lastPing.lng);

			const totalDistance = tripPings.reduce((sum, p) => sum + (p.distance || 0), 0);
			const averageSpeed =
				tripPings.reduce((sum, p) => sum + (p.speed || 0), 0) / tripPings.length;

			const start = new Date(currentTrip.startedAt);
			const end = new Date(currentTrip.stoppedAt);
			const totalTripDurationMs = end.getTime() - start.getTime();

			const drivingDurationMs = totalTripDurationMs - currentTrip.totalIdleDuration;
			const drivingDurationHours = drivingDurationMs / (1000 * 60 * 60);
			const drivingDuration = `${Math.floor(drivingDurationHours)}h ${Math.floor((drivingDurationHours % 1) * 60)}m`;

			const totalIdleDurationHours = currentTrip.totalIdleDuration / (1000 * 60 * 60);
			const totalIdleDuration = `${Math.floor(totalIdleDurationHours)}h ${Math.floor((totalIdleDurationHours % 1) * 60)}m`;

			movementsByDay[date].movement.push({
				...currentTrip,
				totalDistance: Number(totalDistance.toFixed(2)),
				averageSpeed: Number(averageSpeed.toFixed(2)),
				drivingDuration,
				totalIdleDuration,
			});
		}

		// Sort days by date
		return Object.values(movementsByDay).sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		);
	});

	return {
		filterPeriod,
		deviceHistory,
		fetchingDeviceHistory,
		errorFetchingDeviceHistory,
		nestingAreas,
		deviceMovement,
		positionOnMap,
		polylineCoords,
		setFilterPeriod,
		setPositionOnMap,
		setPolylineCoords,
	};
}
