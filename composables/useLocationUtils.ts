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
		const input = document.getElementById(
			"dropoff-location"
		) as HTMLInputElement;
		const options = {
			// types: ["establishment"],
			componentRestrictions: { country: "ke" },
			fields: ["address_components", "geometry", "name"],
			strictBounds: false,
		};
		const autocomplete = new Places.Autocomplete(input, options);
		autocomplete.addListener("place_changed", () => {
			const place = autocomplete.getPlace();
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
		) as HTMLInputElement;
		const options = {
			// types: ["establishment"],
			componentRestrictions: { country: "ke" },
			fields: ["address_components", "geometry", "name"],
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

	onMounted(async () => {
		await bindToPickUpLocation().then(() => bindToDropOffLocation());
	});

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
