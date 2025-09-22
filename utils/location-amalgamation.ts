import { getDistance, getCenter } from 'geolib';
import { type VehiclePing, type AnalyzedLocation } from '~/types/regent-tracking/device-history';

const HOUR_IN_MS = 3600000; // 1 hour in milliseconds

export function analyzeVehicleStops(
	coordinates: VehiclePing[],
	maxDistanceM: number,
	minPoints: number,
): Array<AnalyzedLocation & { location_time_hours_fraction: number }> {
	// Sort the coordinates by time recorded
	coordinates.sort(
		(a, b) => new Date(a.time_recorded).getTime() - new Date(b.time_recorded).getTime(),
	);

	// 1. Calculate total time spent (in hours)
	let totalTimeInMs = 0;
	for (let i = 1; i < coordinates.length; i++) {
		const time1 = new Date(coordinates[i - 1].time_recorded);
		const time2 = new Date(coordinates[i].time_recorded);
		totalTimeInMs += time2.getTime() - time1.getTime();
	}
	const totalTimeHours = totalTimeInMs / HOUR_IN_MS;

	// 2. Cluster coordinates based on proximity
	const clusters = clusterCoordinates(coordinates, maxDistanceM);

	// 3. Calculate time spent and representative coordinates for each cluster
	const analyzedLocations = clusters
		.map((cluster) => {
			if (cluster.length < minPoints) return null;

			// Calculate total time spent in this cluster (in hours)
			let totalClusterTime = 0;
			for (let i = 1; i < cluster.length; i++) {
				const time1 = new Date(cluster[i - 1].time_recorded);
				const time2 = new Date(cluster[i].time_recorded);
				totalClusterTime += (time2.getTime() - time1.getTime()) / HOUR_IN_MS;
			}

			// Round down to the nearest whole hour
			const locationTimeHours = Math.ceil(totalClusterTime);

			// Calculate representative coordinates (center of the cluster)
			const center = getCenter(
				cluster.map((coord) => ({ latitude: coord.lat, longitude: coord.lng })),
			);

			// Calculate the fraction of total time spent in this location
			const locationTimeHoursFraction = (totalClusterTime / totalTimeHours) * 100;

			return {
				representative_lat: center.latitude,
				representative_lng: center.longitude,
				location_time_hours: locationTimeHours,
				location_time_hours_fraction: locationTimeHoursFraction,
				appearances: cluster.length,
			};
		})
		.filter(
			(location): location is AnalyzedLocation & { location_time_hours_fraction: number } =>
				location !== null,
		);

	// 4. Sort locations by time spent in descending order
	analyzedLocations.sort((a, b) => b.location_time_hours - a.location_time_hours);

	return analyzedLocations;
}

// Group coordinates into clusters based on proximity
function clusterCoordinates(coords: VehiclePing[], maxDistanceM: number): VehiclePing[][] {
	const clusters: VehiclePing[][] = [];

	coords.forEach((coord) => {
		const existingCluster = clusters.find((cluster) =>
			cluster.some(
				(c) =>
					getDistance(
						{ latitude: c.lat, longitude: c.lng },
						{ latitude: coord.lat, longitude: coord.lng },
					) <= maxDistanceM,
			),
		);

		if (existingCluster) {
			existingCluster.push(coord);
		} else {
			clusters.push([coord]);
		}
	});

	return clusters;
}
