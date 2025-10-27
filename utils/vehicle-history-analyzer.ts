import {
	type DeviceHistory,
	type VehicleMovement,
	type DayMovement,
	type Item,
} from '~/types/regent-tracking/device-history';

// utils/vehicle-movement-history.ts

/**
 * A raw ping data point from the tracker.
 */
interface PingItem {
	time: string;
	lat: number;
	lng: number;
}

// --- HELPER FUNCTIONS FOR DURATION AGGREGATION ---

/**
 * Converts a duration string (e.g., "1h 12min 57s") into total seconds.
 */
function parseDurationToSeconds(duration: string | null): number {
	if (!duration) return 0;
	// Regex to match one or more digits followed by 'h', 'min', or 's'
	const parts = duration.match(/(\d+)(h|min|s)/g);
	let totalSeconds = 0;

	if (parts) {
		for (const part of parts) {
			const value = parseInt(part);
			if (part.includes('h')) {
				totalSeconds += value * 3600;
			} else if (part.includes('min')) {
				totalSeconds += value * 60;
			} else if (part.includes('s')) {
				totalSeconds += value;
			}
		}
	}
	return totalSeconds;
}

/**
 * Formats a total number of seconds back into a clean "HHh MMmin SSs" string.
 */
function formatSecondsToDuration(totalSeconds: number): string {
	if (totalSeconds <= 0) return '0s';

	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	let result = '';
	if (hours > 0) result += `${hours}h `;
	if (minutes > 0 || (hours > 0 && seconds > 0)) result += `${minutes}min `;
	result += `${seconds}s`;

	return result.trim();
}

/**
 * Calculates the time difference in seconds between two ISO-like timestamps.
 */
function calculateTimeDifferenceSeconds(end: string, start: string): number {
	const endTime = new Date(end).getTime();
	const startTime = new Date(start).getTime();
	if (isNaN(endTime) || isNaN(startTime)) return 0;
	return Math.floor((endTime - startTime) / 1000);
}

// --- CORE FUNCTION ---

/**
 * Analyzes the GPSWOX vehicle history data to consolidate events into defined trips
 * (Ignition On to Ignition Off) and aggregates all intermediate data.
 *
 * @param data The raw response object from the GPSWOX history API.
 * @returns An array of DayMovement objects, one for each unique day in the data.
 */
export function analyzeVehicleTripHistory(data: DeviceHistory): DayMovement[] {
	const dailyHistory = new Map<string, DayMovement>();

	// Object to buffer trip-specific accumulation data
	interface TempTripData {
		startedAt: string;
		startAtLat: number;
		startAtLng: number;
		totalDistanceAcc: number;
		durationSecondsAcc: number;
		tripRoutePings: { lat: number; lng: number }[];
		// Storing stopDuration here allows us to pass it to the end event
		stopDuration: string | null;
		isActive: boolean;
	}
	let tempTripData: TempTripData | null = null;
	let previousTripStoppedAt: string | null = null;

	for (const eventItem of data.items as Item[]) {
		const date = eventItem.show.substring(0, 10);
		const firstPing = eventItem.items[0];

		// 1. Initialize DayMovement for the date if it doesn't exist
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

		// 2. Append all raw pings for the full polyline history
		for (const ping of eventItem.items) {
			dayMovement.pingHistory.push({ lat: ping.lat, lng: ping.lng });
		}

		// 3. Trip Construction Logic
		const isIgnitionEvent = eventItem.status === 5;
		const message = isIgnitionEvent ? eventItem.message : '';

		// --- PHASE 1: START TRIP ---
		if (!tempTripData?.isActive && isIgnitionEvent && message === 'Ignition on') {
			const stopDurationSeconds = previousTripStoppedAt
				? calculateTimeDifferenceSeconds(eventItem.show, previousTripStoppedAt)
				: 0;

			// Initialize the buffer for a new trip
			tempTripData = {
				startedAt: eventItem.show,
				startAtLat: firstPing?.lat ?? 0,
				startAtLng: firstPing?.lng ?? 0,
				totalDistanceAcc: 0,
				durationSecondsAcc: 0,
				tripRoutePings: [],
				isActive: true,
				stopDuration:
					stopDurationSeconds > 0 ? formatSecondsToDuration(stopDurationSeconds) : null,
			};

			// NOTE: We do NOT use 'continue' here. The 'Ignition on' event data (distance/time/pings)
			// will be processed immediately in the accumulation block below.
		}

		// --- PHASE 2: ACCUMULATE & END TRIP ---
		if (tempTripData?.isActive) {
			// Accumulate data for the CURRENT event item (including the 'Ignition on' event itself)
			tempTripData.totalDistanceAcc += eventItem.distance;
			tempTripData.durationSecondsAcc += parseDurationToSeconds(eventItem.time);

			// Add all pings from this event to the trip route
			for (const ping of eventItem.items) {
				tempTripData.tripRoutePings.push({ lat: ping.lat, lng: ping.lng });
			}

			// Handle TRIP END: Ignition off
			if (isIgnitionEvent && message === 'Ignition off') {
				const stoppedAtTime = eventItem.show;

				const completedTrip: VehicleMovement = {
					startedAt: tempTripData.startedAt,
					startAtLat: tempTripData.startAtLat,
					startAtLng: tempTripData.startAtLng,
					stoppedAt: stoppedAtTime,
					stoppedAtLat: firstPing?.lat ?? 0,
					stoppedAtLng: firstPing?.lng ?? 0,
					totalDistance: parseFloat(tempTripData.totalDistanceAcc.toFixed(2)),
					drivingDuration: formatSecondsToDuration(tempTripData.durationSecondsAcc),
					stopDuration: tempTripData.stopDuration,
					tripRoute: tempTripData.tripRoutePings,
				};

				// Add the completed trip to the day's movement history
				dayMovement.movement.push(completedTrip);

				// Update the time for calculating the next stop duration
				previousTripStoppedAt = stoppedAtTime;

				// Reset trip state
				tempTripData = null;
			}
		}

		// before moving on, count the total trips for each day
		dayMovement.totalTrips = dayMovement.movement.length;

		// and cummulative total distance
		dayMovement.cummTotalDistance += dayMovement.movement.reduce(
			(acc, m) => acc + m.totalDistance,
			0,
		);
	}

	// Convert the Map values (DayMovement objects) into the final array
	return Array.from(dailyHistory.values());
}
