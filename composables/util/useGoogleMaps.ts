export default function useGoogleMaps() {
	const apiKey: string = 'AIzaSyAfiZC3ThO1RVxsag0Dn2XzYu9oEux7VDI';

	async function gecodeLocation(lat: number, lng: number): Promise<string> {
		return new Promise<string>((resolve) => {
			// Check if the Google Maps API is loaded and available
			if (typeof window.google === 'undefined' || typeof window.google.maps === 'undefined') {
				resolve('Google Maps API is not loaded.');
				return;
			}

			const geocoder = new window.google.maps.Geocoder();
			geocoder.geocode({ location: { lat, lng } }, (results, status) => {
				if (status === 'OK' && results && results[0]) {
					resolve(results[0].formatted_address);
				} else {
					resolve('Geocoding failed!');
				}
			});
		});
	}

	return {
		googleMapsApiKey: apiKey,
		gecodeLocation,
	};
}
