import { useGeolocation } from '@vueuse/core';
import { type LocationCoords } from '~/types';

export function useClientLocation() {
	const { coords, error } = useGeolocation();
	return {
		clientLocation: {
			lat: coords.value.latitude,
			lng: coords.value.longitude,
		} as LocationCoords,
		error: error,
	};
}
