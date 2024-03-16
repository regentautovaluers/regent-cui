import { Loader } from "@googlemaps/js-api-loader";

export default function () {
	const runtimeConfig = useRuntimeConfig();
	const center = reactive({
		lat: 0,
		lng: 0,
	});
	const pickupPoint = reactive({
		lat: 0,
		lng: 0,
	});
	const dropOffPoint = reactive({
		lat: 0,
		lng: 0,
	});

	async function bindToDropOffLocation() {
		const loader = new Loader({
			apiKey: runtimeConfig.app.GOOGLE_MAPS_APIKEY,
			version: "weekly",
		});

		const Places = await loader.importLibrary("places");
		// the center, defaultbounds are not necessary but are best practices to limit/focus search results

		// Create a bounding box with sides ~10km away from the center point
		const defaultBounds = {
			north: center.lat + 0.1,
			south: center.lat - 0.1,
			east: center.lng + 0.1,
			west: center.lng - 0.1,
		};

		//this const will be the first arg for the new instance of the Places API

		const input = document.getElementById(
			"dropoff-location"
		) as HTMLInputElement; //binds to our input element

		//this object will be our second arg for the new instance of the Places API
		const options = {
			bounds: defaultBounds, //optional
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
			dropOffPoint.lat = place.geometry?.location?.lat();
			dropOffPoint.lng = place.geometry?.location?.lng();
		});
	}

	async function bindToPickUpLocation() {
		const loader = new Loader({
			apiKey: runtimeConfig.app.GOOGLE_MAPS_APIKEY,
			version: "weekly",
		});

		const Places = await loader.importLibrary("places");
		// the center, defaultbounds are not necessary but are best practices to limit/focus search results

		// Create a bounding box with sides ~10km away from the center point
		const defaultBounds = {
			north: center.lat + 0.1,
			south: center.lat - 0.1,
			east: center.lng + 0.1,
			west: center.lng - 0.1,
		};

		//this const will be the first arg for the new instance of the Places API

		const input = document.getElementById(
			"pickup-location"
		) as HTMLInputElement; //binds to our input element

		//this object will be our second arg for the new instance of the Places API
		const options = {
			bounds: defaultBounds, //optional
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
			pickupPoint.lat = place.geometry?.location?.lat();
			pickupPoint.lng = place.geometry?.location?.lng();

			console.log("pickup point: ", pickupPoint);
		});
	}

	return {
		center,
		pickupPoint,
		dropOffPoint,
		bindToDropOffLocation,
		bindToPickUpLocation,
	};
}
