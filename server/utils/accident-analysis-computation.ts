import {
	type AccidentAnalytics,
	type AccidentSeverity,
} from '~/types/insurance-telematics/accident-record';
import { type DeviceHistory } from '~/types/regent-tracking/device-history';

export async function deriveAccidentAnalysis(h: DeviceHistory): Promise<AccidentAnalytics> {
	const G_FORCE_MULTIPLIER = 0.01;
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
						/*
                        TODO: Figure out how to do the geocoding later
                        analysis.geoCodeLocation = await gecodeLocation(
							v.items[x].lat,
							v.items[x].lng,
						);*/
						analysis.time = v.items[x].device_time as string;
						analysis.speedBeforeCrash = v.items[x].speed ?? null;
						analysis.speedUnits = 'Km/h';

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
						analysis.severity = deriveIncidentSeverity(force * G_FORCE_MULTIPLIER);
					}

					// 4. Check for harsh braking
					const harshBrakingEventString = other_arr.find((str) => str.includes('io253'));
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

	return analysis;
}

function deriveIncidentSeverity(gForceValue: number): AccidentSeverity {
	if (gForceValue > 8) {
		return 'Severe';
	} else if (gForceValue >= 4 && gForceValue <= 8) {
		return 'Moderate';
	} else {
		return 'Minor';
	}
}
