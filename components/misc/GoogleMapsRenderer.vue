<template>
	<GoogleMap
		:api-key="googleMapsApiKey"
		style="width: 100%; height: 100%"
		:center="center"
		:zoom="14">
		<Marker :options="markerOptions" />
		<Marker :options="pickupMarkerOptions" />
		<Marker :options="dropOffMarkerOptions" />
	</GoogleMap>
</template>

<script setup lang="ts">
	import { GoogleMap, Marker } from "vue3-google-map";

	const { center, pickupPointCoords, dropOffPointCoords } = useLocations();
	const markerOptions = {
		position: center.value,
		label: "Y",
		title: "You Are Here",
		color: "green",
	};
	const pickupMarkerOptions = {
		position: pickupPointCoords.value,
		label: "P",
		title: "Pickup Client Here",
	};

	const dropOffMarkerOptions = {
		position: dropOffPointCoords.value,
		label: "D",
		title: "Drop Client Here",
	};
	const runtimeConfig = useRuntimeConfig();
	const googleMapsApiKey = runtimeConfig.app.GOOGLE_MAPS_APIKEY;

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
</script>
