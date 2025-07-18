import { useGeolocation } from '@vueuse/core';
import { type LocationCoords } from '~/types';

export default defineNuxtPlugin(() => {
	const { coords, error, resume, pause } = useGeolocation();
	return {
		provide: {
			clientLocation: {
				lat: coords.value.latitude,
				lng: coords.value.longitude,
				error: error,
			} as LocationCoords,
		},
	};
});
