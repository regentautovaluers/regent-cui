import { Loader } from "@googlemaps/js-api-loader";

export default function () {
	const runtimeConfig = useRuntimeConfig();
	const pickupPointName = ref("");
	const dropOffPointName = ref("");
	const pickupLatitude: Ref<number> = ref(Number.NEGATIVE_INFINITY);
	const pickupLongitude: Ref<number> = ref(Number.NEGATIVE_INFINITY);
	const destinationLatitude: Ref<number> = ref(Number.NEGATIVE_INFINITY);
	const destinationLongitude: Ref<number> = ref(Number.NEGATIVE_INFINITY);

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

			destinationLatitude.value = place.geometry?.location?.lat()!;
			destinationLongitude.value = place.geometry?.location?.lng()!;
			dropOffPointName.value = `${
				place.address_components![0].short_name
			} ${place.address_components![1].short_name}, ${
				place.address_components![2].short_name
			}`;
		});
	}

	async function bindToPickUpLocation() {
		const loader = new Loader({
			apiKey: runtimeConfig.app.GOOGLE_MAPS_APIKEY,
			version: "weekly",
		});
		const Places = await loader.importLibrary("places");
		const input = document.getElementById(
			"client-location"
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

			pickupLatitude.value = place.geometry?.location?.lat()!;
			pickupLongitude.value = place.geometry?.location?.lng()!;
			pickupPointName.value = `${
				place.address_components![0].short_name
			} ${place.address_components![1].short_name}, ${
				place.address_components![2].short_name
			}`;
		});
	}

	return {
		bindToPickUpLocation,
		bindToDropOffLocation,
		pickupLatitude,
		pickupLongitude,
		destinationLongitude,
		destinationLatitude,
		pickupPointName,
		dropOffPointName,
	};
}
