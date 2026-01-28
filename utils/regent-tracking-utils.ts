import {
	type Online,
	type TrackerStatusMetaWrapper,
} from '~/types/regent-tracking/tracked-vehicles';

export function deriveProperTrackerStatus(
	online_status: Online,
	expiration_date: Date | null,
): TrackerStatusMetaWrapper {
	if (['ack', 'engine', 'online'].includes(online_status)) {
		return {
			proper_status: 'Online',
			prefered_color: 'green',
		};
	}

	if (online_status == 'offline') {
		// for an expired vehicle the logic is different - we rely on the device's expiration date
		if (expiration_date && isDateInThePast(expiration_date.toString())) {
			return {
				proper_status: 'Expired',
				prefered_color: 'red',
			};
		}

		// we fall back to the online_status for offline vehicles
		return {
			proper_status: 'Offline',
			prefered_color: 'yellow',
		};
	} else
		return {
			proper_status: 'Expired',
			prefered_color: 'red',
		};
}
