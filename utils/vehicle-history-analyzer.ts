import {
	type DeviceHistory,
	type VehicleMovement,
	type DayMovement,
	type Item,
} from '~/types/regent-tracking/device-history';

/**
 * Analyzes the GPSWOX vehicle history data to consolidate events into defined trips
 * (Ignition On to Ignition Off) and aggregates all intermediate data.
 *
 * @param data The raw response object from the GPSWOX history API.
 * @returns An array of DayMovement objects, one for each unique day in the data.
 */
export function analyzeVehicleTripHistory(data: DeviceHistory): DayMovement[] {
	if (!data.items || data.items.length === 0) {
		return [];
	}

	const dailyHistory = new Map<string, DayMovement>();

	interface TempTripData {
		startedAt: string;
		startAtLat: number;
		startAtLng: number;
		totalDistanceAcc: number;
		tripRoutePings: { lat: number; lng: number }[];
		isActive: boolean;
	}
	let tempTripData: TempTripData | null = null;

	// --- PASS 1: Identify Trips, Collect Data, and Build Ping History ---
	for (const eventItem of data.items as Item[]) {
		const date = eventItem.show.substring(0, 10);
		const firstPing = eventItem.items[0];

		// Initialize DayMovement for the date
		if (!dailyHistory.has(date)) {
			dailyHistory.set(date, {
				date: date,
				totalTrips: 0,
				cummTotalDistance: 0,
				movement: [],
				pingHistory: [],
			});
		}
		const dayMovement = dailyHistory.get(date)!;

		// Append all raw pings for the full polyline history
		for (const ping of eventItem.items) {
			dayMovement.pingHistory.push({ lat: Number(ping.lat), lng: Number(ping.lng) });
		}

		// Trip Construction Logic
		const isIgnitionEvent = eventItem.status === 5;
		const message = isIgnitionEvent ? eventItem.message : '';

		// PHASE 1A: START TRIP (Ignition on)
		if (!tempTripData?.isActive && isIgnitionEvent && message === 'Ignition on') {
			tempTripData = {
				startedAt: eventItem.show,
				startAtLat: firstPing?.lat ?? 0,
				startAtLng: firstPing?.lng ?? 0,
				totalDistanceAcc: 0,
				tripRoutePings: [],
				isActive: true,
			};
		}

		// PHASE 1B: ACCUMULATE & END TRIP
		if (tempTripData?.isActive) {
			// Accumulate Distance and Pings
			tempTripData.totalDistanceAcc += eventItem.distance;

			for (const ping of eventItem.items) {
				tempTripData.tripRoutePings.push({ lat: Number(ping.lat), lng: Number(ping.lng) });
			}

			// Handle TRIP END: Ignition off
			if (isIgnitionEvent && message === 'Ignition off') {
				const stoppedAtTime = eventItem.show;

				// Driving Duration: Calculated as ELAPSED TIME (StoppedAt - StartedAt)
				const drivingDurationSeconds = calculateTimeDifferenceSeconds(
					stoppedAtTime,
					tempTripData.startedAt,
				);

				const completedTrip: VehicleMovement = {
					startedAt: tempTripData.startedAt,
					startAtLat: Number(tempTripData.startAtLat),
					startAtLng: Number(tempTripData.startAtLng),
					stoppedAt: stoppedAtTime,
					stoppedAtLat: Number(firstPing?.lat) ?? 0,
					stoppedAtLng: Number(firstPing?.lng) ?? 0,
					totalDistance: parseFloat(tempTripData.totalDistanceAcc.toFixed(2)),
					drivingDuration: formatSecondsToDuration(drivingDurationSeconds),
					stopDuration: null, // Will be filled in Pass 2
					tripRoute: tempTripData.tripRoutePings.map((e) => {
						return { lat: Number(e.lat), lng: Number(e.lng) };
					}),
				};

				dayMovement.movement.push(completedTrip);

				// Reset trip state
				tempTripData = null;
			}
		}
	}

	// --- PHASE 2: Calculate Stop Durations and Summary Fields (totalTrips, cummTotalDistance) ---
	for (const dayMovement of dailyHistory.values()) {
		const movement = dayMovement.movement;
		let cumulativeDistance = 0;

		// Iterate through all trips
		for (let i = 0; i < movement.length; i++) {
			const currentTrip = movement[i];

			// A) Calculate Stop Duration (Look Ahead)
			if (i < movement.length - 1) {
				const nextTrip = movement[i + 1];

				// Stop duration is the time between the current trip's 'Ignition off' and the next trip's 'Ignition on'
				const stopDurationSeconds = calculateTimeDifferenceSeconds(
					nextTrip.startedAt,
					currentTrip.stoppedAt,
				);

				// Assign the calculated stop duration to the *current* trip
				currentTrip.stopDuration =
					stopDurationSeconds > 0 ? formatSecondsToDuration(stopDurationSeconds) : null;
			} else {
				// The last trip always has a null stop duration
				currentTrip.stopDuration = null;
			}

			// B) Accumulate Total Distance for summary
			cumulativeDistance += currentTrip.totalDistance;
		}

		// C) Fill in DayMovement Summary Fields
		dayMovement.totalTrips = movement.length;
		dayMovement.cummTotalDistance = parseFloat(cumulativeDistance.toFixed(2));
	}

	return Array.from(dailyHistory.values());
}
