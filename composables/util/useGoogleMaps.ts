import { Loader } from '@googlemaps/js-api-loader';

export default async function useGoogleMaps() {
	const apiKey: string = 'AIzaSyDMGtdKrUaAiV_xXpNv4Ktshpe-NbDUpjY';
	const loader: Loader = new Loader({
		apiKey: apiKey,
		version: 'weekly',
	});
	// const Geocoding = await loader.importLibrary('geocoding');

	function gecodeLocation(lat: number, lng: number): string {
		let location = 'Geocoding...';

		// const geocoder = new Geocoding.Geocoder();
		// geocoder.geocode({ location: { lat, lng } }, (results, status) => {
		// 	if (status === 'OK' && results) {
		// 		if (results[0]) {
		// 			location = results[0].formatted_address;
		// 		} else {
		// 			location = 'Geocoding failed!';
		// 		}
		// 	} else {
		// 		location = 'Geocoding failed!';
		// 	}
		// });

		return location;
	}

	return {
		googleMapsApiKey: apiKey,
		gecodeLocation,
	};
}
