import { type Online } from '~/types/regent-tracking/tracked-vehicles';

export function deriveColor(online_status: Online): string {
	switch (online_status) {
		case 'ack':
			return 'green';
		case 'engine':
			return 'green';
		case 'online':
			return 'green';
		case 'offline':
			return 'yellow';
		case 'expired':
			return 'red';
	}
}
