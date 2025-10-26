import {
	type DeviceHistory,
	type AnalyzedLocation,
	type Item2,
} from '~/types/regent-tracking/device-history';

/**
 * This utility provides functions to analyze vehicle tracking data
 * to find "nesting areas" (clusters of frequent stops).
 */

/**
 * Internal interface for a processed stop event before clustering.
 */
interface ProcessedStop {
	id: number;
	lat: number;
	lng: number;
	durationMs: number;
}

// 2. --- CONSTANTS ---

/**
 * The status ID that represents a "Stop" event in the data.
 */
const STOP_STATUS_ID = 2;

/**
 * The radius in meters to group stops into a single cluster.
 */
const CLUSTER_RADIUS_METERS = 30;

// 3. --- HELPER FUNCTIONS ---

/**
 * Parses a timestamp string (e.g., "2016-04-25 18:53:39") to milliseconds.
 * @param timeStr The timestamp string.
 * @returns Time in milliseconds since epoch.
 */
function parseTimestampToMs(timeStr: string | null): number {
	if (!timeStr) return 0;
	// Date constructor handles the 'YYYY-MM-DD HH:mm:ss' format
	return new Date(timeStr.trim()).getTime();
}

/**
 * Parses a complex summary duration string into milliseconds.
 * @param timeStr The duration string (e.g., "114h 51min 0s").
 * @returns Duration in milliseconds.
 */
function parseSummaryDurationToMs(timeStr: string | null): number {
	if (!timeStr) return 0;

	const timeUnits: Record<string, number> = {
		h: 3600000, // hours to ms
		min: 60000, // minutes to ms
		s: 1000, // seconds to ms
	};

	let totalMs = 0;

	// Match patterns like "13h", "26min", "6s"
	const regex = /(\d+)(h|min|s)/g;
	let match;

	while ((match = regex.exec(timeStr)) !== null) {
		const value = parseInt(match[1], 10);
		const unit = match[2];
		totalMs += value * timeUnits[unit];
	}

	return totalMs;
}

/**
 * Calculates the Haversine distance between two points on Earth.
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in meters.
 */
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
	const R = 6371e3; // Earth radius in meters
	const φ1 = (lat1 * Math.PI) / 180;
	const φ2 = (lat2 * Math.PI) / 180;
	const Δφ = ((lat2 - lat1) * Math.PI) / 180;
	const Δλ = ((lon2 - lon1) * Math.PI) / 180;

	const a =
		Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c; // in meters
}

/**
 * Calculates the duration of a single stop group by taking the time difference
 * between the first and last ping in the group's item array.
 * @param pings Array of pings in the stop group.
 * @returns Duration in milliseconds.
 */
function calculateStopDurationMs(pings: Item2[]): number {
	if (pings.length < 1) {
		return 0;
	}

	// The duration is the difference between the timestamp of the last ping
	// and the timestamp of the first ping in the group.
	const startTimeMs = parseTimestampToMs(pings[0].time);
	const endTimeMs = parseTimestampToMs(pings[pings.length - 1].time);

	// If the stop consists of only one ping, the duration is effectively 0 based on this calculation.
	// However, if the duration between the start and end of the stop group is significant,
	// this captures the time spent in that status.
	return Math.max(0, endTimeMs - startTimeMs);
}

// 4. --- MAIN ANALYSIS FUNCTION ---

/**
 * Analyzes vehicle tracking data to find nesting areas (clusters of stops).
 * * @param data The raw vehicle data object from the API.
 * @returns An array of AnalyzedLocation objects, sorted by duration descending.
 */
export function analyzeNestingAreas(data: DeviceHistory): AnalyzedLocation[] {
	// 1. Filter for "Stop" events and extract relevant data
	const allStops: ProcessedStop[] = [];
	data.items.forEach((group) => {
		// We now check if the group is a STOP (status 2) and has at least one ping for location.
		if (group.status === STOP_STATUS_ID && group.items.length > 0) {
			// Calculate duration by time difference between pings in the group
			const durationMs = calculateStopDurationMs(group.items);

			// Only consider stops that have a calculated duration greater than 0
			if (durationMs > 0) {
				allStops.push({
					id: group.items[0].id, // Use first ping ID as unique stop ID
					lat: group.items[0].lat,
					lng: group.items[0].lng,
					durationMs: durationMs,
				});
			}
		}
	});

	// 2. Get total stop duration from the summary.
	// This is the denominator for the "location_time_hours_fraction".
	const totalStopDurationMs = parseSummaryDurationToMs(data.stop_duration);

	// Fallback: If summary duration is missing, calculate from all stops.
	const calculatedTotalStopMs = allStops.reduce((sum, stop) => sum + stop.durationMs, 0);
	const totalDurationForFraction =
		totalStopDurationMs > 0 ? totalStopDurationMs : calculatedTotalStopMs;

	if (totalDurationForFraction === 0) {
		console.warn('Total stop duration is zero. Cannot calculate fractions.');
		return [];
	}

	// 3. Cluster stops
	const clusters: ProcessedStop[][] = [];
	const clusteredStopIds = new Set<number>();

	for (const stopA of allStops) {
		if (clusteredStopIds.has(stopA.id)) {
			continue; // This stop is already in a cluster
		}

		const newClusterStops: ProcessedStop[] = [stopA];
		clusteredStopIds.add(stopA.id);

		// Find all other stops within the radius of stopA
		for (const stopB of allStops) {
			if (stopA.id === stopB.id || clusteredStopIds.has(stopB.id)) {
				continue;
			}

			const dist = haversineDistance(stopA.lat, stopA.lng, stopB.lat, stopB.lng);

			if (dist <= CLUSTER_RADIUS_METERS) {
				newClusterStops.push(stopB);
				clusteredStopIds.add(stopB.id);
			}
		}
		clusters.push(newClusterStops);
	}

	// 4. Analyze clusters and format the output
	let analyzedLocations: AnalyzedLocation[] = clusters.map((stopCluster) => {
		const appearances = stopCluster.length;

		// Calculate representative location (centroid of the cluster)
		const representative_lat = stopCluster.reduce((sum, s) => sum + s.lat, 0) / appearances;
		const representative_lng = stopCluster.reduce((sum, s) => sum + s.lng, 0) / appearances;

		// Sum up the time spent in this cluster
		const location_time_ms = stopCluster.reduce((sum, s) => sum + s.durationMs, 0);
		const location_time_hours = location_time_ms / (1000 * 60 * 60);

		return {
			representative_lat,
			representative_lng,
			location_time_hours,
			location_time_hours_fraction: 0,
			appearances,
		};
	});

	// Sort by most time spent so the most significant nesting areas are first
	return analyzedLocations.sort((a, b) => b.location_time_hours - a.location_time_hours);
}

export function calculateLocationTimeFractions(locations: AnalyzedLocation[]): AnalyzedLocation[] {
	// Calculate total hours across all locations
	const totalHours =
		Math.floor(locations.reduce((sum, loc) => sum + loc.location_time_hours, 0) * 100) / 100;
	console.log(totalHours);

	// Avoid division by zero
	if (totalHours === 0) {
		return locations.map((loc) => ({ ...loc, location_time_hours_fraction: 0 }));
	}

	// Update each location with its fraction
	return locations.map((loc) => ({
		...loc,
		location_time_hours_fraction: Math.floor((loc.location_time_hours / totalHours) * 100),
	}));
}
