import { Loader } from '@googlemaps/js-api-loader';

export async function gecodeLocation(lat: number, lng: number): string {
	const Geocoding = await loader.importLibrary('geocoding');

	const geocoder = new Geocoding.Geocoder();
	geocoder.geocode({ location: { lat, lng } }, (results, status) => {
		if (status === 'OK' && results) {
			if (results[0]) {
				activeTrackedDeviceLocation.value = results[0].formatted_address;
			} else {
				activeTrackedDeviceLocation.value = 'Geocoding failed!';
			}
		} else {
			activeTrackedDeviceLocation.value = 'Geocoding failed!';
		}
	});
}
