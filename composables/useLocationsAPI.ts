import { Loader } from "@googlemaps/js-api-loader";

export default function () {
	const runtimeConfig = useRuntimeConfig();
	const center = ref({
		lat: 0,
		lng: 0,
	});
	const pickupPointCoords = ref({
		lat: -1.267451,
		lng: 36.808521,
	});
	const pickupPointName = ref("");

	const dropOffPointCoords = ref({
		lat: -1.267451,
		lng: 36.808521,
	});
	const dropOffPointName = ref("");

	async function bindToDropOffLocation() {
		const loader = new Loader({
			apiKey: runtimeConfig.app.GOOGLE_MAPS_APIKEY,
			version: "weekly",
		});

		const Places = await loader.importLibrary("places");
		// the center, defaultbounds are not necessary but are best practices to limit/focus search results

		//this const will be the first arg for the new instance of the Places API

		const input = document.getElementById(
			"dropoff-location"
		) as HTMLInputElement; //binds to our input element

		//this object will be our second arg for the new instance of the Places API
		const options = {
			types: ["establishment"], //optioanl
			componentRestrictions: { country: "ke" }, //limiter for the places api search
			fields: ["address_components", "geometry", "icon", "name"], //allows the api to accept these inputs and return similar ones
			strictBounds: false, //optional
		};

		// per the Google docs create the new instance of the import above. I named it Places.
		const autocomplete = new Places.Autocomplete(input, options);

		//add the place_changed listener to display results when inputs change
		autocomplete.addListener("place_changed", () => {
			const place = autocomplete.getPlace(); //this callback is inherent you will see it if you logged autocomplete
			// console.log("place", place);
			dropOffPointCoords.value.lat = place.geometry?.location?.lat();
			dropOffPointCoords.value.lng = place.geometry?.location?.lng();
			dropOffPointName.value = `${place.address_components[0].short_name} ${place.address_components[1].short_name}, ${place.address_components[2].short_name}`;
		});
	}

	async function bindToPickUpLocation() {
		const loader = new Loader({
			apiKey: runtimeConfig.app.GOOGLE_MAPS_APIKEY,
			version: "weekly",
		});
		const Places = await loader.importLibrary("places");
		const input = document.getElementById(
			"pickup-location"
		) as HTMLInputElement; //binds to our input element
		const options = {
			types: ["establishment"],
			componentRestrictions: { country: "ke" }, //limiter for the places api search
			fields: ["address_components", "geometry", "icon", "name"],
			strictBounds: false, //optional
		};
		const autocomplete = new Places.Autocomplete(input, options);

		autocomplete.addListener("place_changed", () => {
			const place = autocomplete.getPlace();
			pickupPointCoords.value.lat = place.geometry?.location?.lat();
			pickupPointCoords.value.lng = place.geometry?.location?.lng();
			pickupPointName.value = `${place.address_components[0].short_name} ${place.address_components[1].short_name}, ${place.address_components[2].short_name}`;
		});
	}

	onMounted(() => {
		// Check if Geolocation is supported
		if (!navigator.geolocation) {
			alert("Geolocation is not supported by your browser.");
			return;
		}

		// Request the user's current position
		navigator.geolocation.getCurrentPosition(
			// Success callback
			function (position) {
				// Extract latitude and longitude
				const latitude = position.coords.latitude;
				const longitude = position.coords.longitude;

				center.value.lat = latitude;
				center.value.lng = longitude;
			},
			// Error callback
			function (error) {
				// Handle errors
				switch (error.code) {
					case error.PERMISSION_DENIED:
						alert("User denied the request for Geolocation.");
						break;
					case error.POSITION_UNAVAILABLE:
						alert("Location information is unavailable.");
						break;
					case error.TIMEOUT:
						alert("The request to get user location timed out.");
						break;
					default:
						alert("An unknown error occurred.");
						break;
				}
			}
		);
	});

	return {
		center,
		pickupPointCoords,
		dropOffPointCoords,
		pickupPointName,
		dropOffPointName,
		bindToDropOffLocation,
		bindToPickUpLocation,
	};
}
