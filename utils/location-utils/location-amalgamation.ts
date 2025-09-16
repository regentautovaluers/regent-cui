import { type VehiclePing, type AnalyzedLocation } from '~/types/regent-tracking/device-history';
import { parseISO, differenceInSeconds } from 'date-fns';

const HOUR_IN_MS = 3600000; // 1 hour in milliseconds

export function analyzeVehicleStops(
	coordinates: VehiclePing[],
	maxDistanceM: number,
	minPoints: number,
): AnalyzedLocation[] {
	// Sort the coordinates by time recorded
	coordinates.sort(
		(a, b) => parseTime(a.time_recorded).getTime() - parseTime(b.time_recorded).getTime(),
	);

	// 1. Calculate total time spent (in hours)
	let totalTimeInMs = 0;
	for (let i = 1; i < coordinates.length; i++) {
		const time1 = parseTime(coordinates[i - 1].time_recorded);
		const time2 = parseTime(coordinates[i].time_recorded);
		totalTimeInMs += time2.getTime() - time1.getTime();
	}
	const totalTimeHours = totalTimeInMs / HOUR_IN_MS;

	// 2. Cluster coordinates based on proximity
	const distanceThreshold = 0.1; // 100 meters; adjust based on your data
	const clusters = clusterCoordinates(coordinates, distanceThreshold);

	// 3. Calculate time spent in each location and find representative coordinates
	const analyzedLocations: AnalyzedLocation[] = clusters
		.map((cluster) => {
			if (cluster.length === 0) return null; // Skip empty clusters

			let totalClusterTime = 0;
			let appearanceCount = 0;
			let representativeLat = 0;
			let representativeLng = 0;

			cluster.forEach((coord, index) => {
				const time1 = parseTime(coord.time_recorded);
				const time2 =
					index + 1 < cluster.length
						? parseTime(cluster[index + 1].time_recorded)
						: new Date();
				const timeSpent = calculateTimeDifference(time1, time2);

				totalClusterTime += timeSpent;
				appearanceCount++;
				representativeLat += coord.lat;
				representativeLng += coord.lng;
			});

			// Ensure that we have at least one coordinate to compute representative values
			// The representative is computed as the average of latitudes and longitudes
			if (appearanceCount > 0) {
				representativeLat /= appearanceCount;
				representativeLng /= appearanceCount;
			} else {
				// If the cluster has no valid coordinates, continue (though this should not happen)
				return null;
			}

			// 4. Calculate how much time was spent in each location (in hours)
			const locationTimeHours =
				((totalClusterTime / totalTimeHours) * totalTimeInMs) / HOUR_IN_MS;

			return {
				representative_lat: representativeLat,
				representative_lng: representativeLng,
				total_time_hours: totalTimeHours,
				location_time_hours: locationTimeHours,
				appearances: appearanceCount,
			};
		})
		.filter((location) => location !== null); // Filter out any invalid locations

	// 5. Sort locations by time spent in descending order
	analyzedLocations.sort((a, b) => b.appearances - a.appearances);

	return analyzedLocations;
}

// Group coordinates based on proximity (Clustering)
function clusterCoordinates(coords: VehiclePing[], distanceThreshold: number): VehiclePing[][] {
	const clusters: VehiclePing[][] = [];

	coords.forEach((coord, index) => {
		let addedToCluster = false;
		for (const cluster of clusters) {
			const firstCoord = cluster[0];
			if (
				haversine(coord.lat, coord.lng, firstCoord.lat, firstCoord.lng) < distanceThreshold
			) {
				cluster.push(coord);
				addedToCluster = true;
				break;
			}
		}
		if (!addedToCluster) {
			clusters.push([coord]);
		}
	});

	return clusters;
}

// Haversine formula to calculate distance between two lat/lng points
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
	const R = 6371; // Earth's radius in kilometers
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLng = ((lng2 - lng1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLng / 2) *
			Math.sin(dLng / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c; // Returns distance in kilometers
}

// Convert time recorded to Date object
function parseTime(time_recorded: string): Date {
	return new Date(time_recorded);
}

// Calculate time spent between two consecutive coordinates
function calculateTimeDifference(time1: Date, time2: Date): number {
	return (time2.getTime() - time1.getTime()) / HOUR_IN_MS;
}
