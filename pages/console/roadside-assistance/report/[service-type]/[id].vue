<template>
	<div
		class="py-10 h-fit responsive-view"
		id="report">
		<!-- top section with general information about the report -->
		<div class="rounded-lg border shadow-sm h-52 mx-16">
			<!-- general trip details and download button -->
			<div class="flex items-center justify-between py-3 px-8">
				<div class="flex">
					<img
						src="https://images.unsplash.com/photo-1721048166150-3b2bb2ca3431?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						alt="Responder Image"
						class="rounded-2xl size-20 object-cover shadow-sm" />
					<div class="flex-grow space-y-1 ml-5">
						<h1 class="font-semibold text-blue-600">KCC 002G</h1>
						<div class="w-fit space-x-2">
							<span class="text-gray-500 font-semibold"
								>Tesla Model X</span
							>
							<span class="text-gray-700 font-semibold"
								>&middot;</span
							>
							<span class="text-gray-500 font-semibold">SUV</span>
							<span class="text-gray-500 font-semibold"
								>Black</span
							>
						</div>
						<h2 class="font-semibold text-blue-600">
							Trip Id: 3289436746
						</h2>
					</div>
				</div>
				<button
					class="bg-blue-600 hover:bg-blue-700 text-white font-semibold uppercase px-4 py-2 rounded-xl h-14 disabled:bg-gray-500"
					@click="generatePdf"
					disabled>
					Download Report
				</button>
			</div>
			<hr />
			<div class="flex items-center justify-between py-3 px-8">
				<div class="flex flex-col space-y-1">
					<span class="font-semibold text-gray-600"
						>Vehicle Owner</span
					>
					<span class="text-gray-500">Benjamin Ndung'o</span>
					<span class="text-blue-600 font-semibold">0700000000</span>
				</div>
				<div class="flex flex-col space-y-1">
					<span class="font-semibold text-gray-600">Dispatcher</span>
					<span class="text-gray-500">Jane Angeline Kabura</span>
					<span class="text-blue-600 font-semibold">0700000000</span>
				</div>
				<div class="flex flex-col space-y-1">
					<span class="font-semibold text-gray-600">Date & Time</span>
					<span class="text-gray-500">12.03.2023</span>
					<span class="text-blue-600 font-semibold"
						>11:20 - 13:56</span
					>
				</div>
				<div class="flex flex-col space-y-1">
					<span class="font-semibold text-gray-600">Reason</span>
					<span class="text-gray-500">Road Accident</span>
					<span class="text-blue-600 underline font-semibold"
						>More Details</span
					>
				</div>
			</div>
		</div>

		<!-- responder details, trip detals and cost breakdown -->
		<div
			class="grid grid-cols-2 gap-x-8 h-[28rem] rounded-lg shadow-sm mt-8 mx-16">
			<div class="h-full rounded-lg flex flex-col space-y-8">
				<div
					class="border rounded-lg shadow-sm h-[22%] flex items-center space-x-4 px-8">
					<img
						src="https://images.unsplash.com/photo-1721048166150-3b2bb2ca3431?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						alt="Responder Image"
						class="rounded-full size-20 object-cover shadow-sm" />
					<div class="flex-grow space-y-1">
						<h1 class="font-semibold text-gray-700">Responder</h1>
						<h2 class="font-semibold text-gray-500">
							Evelyn Makena Makena
						</h2>
						<div class="w-fit space-x-2">
							<span
								class="text-blue-600 font-semibold bg-gray-200 rounded-xl px-2 p-1 text-sm">
								KDG 880D
							</span>
							<span class="text-gray-700 font-semibold"
								>&middot;</span
							>
							<span class="text-gray-500 font-semibold"
								>low bed truck</span
							>
						</div>
					</div>
				</div>
				<div class="flex-grow border rounded-lg py-4 px-8 shadow-sm">
					<h1 class="font-semibold text-xl mb-2">Trip Details</h1>
					<h1 class="font-semibold text-gray-500">
						As logged by our system on 12.03.2021
					</h1>
					<div class="flex items-center space-x-4 mt-8">
						<div
							v-for="(detail, index) in tripDetailsFields"
							:key="index"
							class="rounded-md border bg-gray-100 w-1/4 p-3">
							<h1 class="font-semibold text-gray-700">
								{{ detail.label }}
							</h1>
							<span class="font-semibold text-gray-500">{{
								detail.value
							}}</span>
						</div>
					</div>
					<div class="mt-8 space-y-6">
						<div class="flex items-center space-x-4">
							<div
								class="size-12 flex items-center justify-center bg-blue-600 rounded-full">
								<PickupLocationIcon :classes="['size-7']" />
							</div>
							<div class="flex-grow">
								<span class="text-gray-700 font-semibold"
									>Shell, Kahawa Sukari</span
								>
								<h1 class="text-gray-500">Pick Up Point</h1>
							</div>
						</div>
						<div class="flex items-center space-x-4">
							<div
								class="size-12 flex items-center justify-center bg-pink-600 rounded-full">
								<DropOffLocationIcon :classes="['size-7']" />
							</div>
							<div class="flex-grow">
								<span class="text-gray-700 font-semibold"
									>Shell, Kahawa Sukari</span
								>
								<h1 class="text-gray-500">Drop Off Location</h1>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="h-full border rounded-lg py-4 px-8 shadow-sm">
				<h1 class="font-semibold text-xl mb-8">Cost Breakdown</h1>
				<span class="text-gray-500 font-semibold">
					{{ vehicleRegistration }} had {{ distanceLeftForTowing }} Km
					of free towing remaining</span
				>
				<div
					class="flex w-full h-3 bg-gray-200 rounded-full overflow-hidden mt-3"
					role="progressbar"
					aria-valuenow="1"
					aria-valuemin="0"
					aria-valuemax="100">
					<div
						class="flex flex-col justify-center rounded-full overflow-hidden bg-pink-600 text-xs text-white text-center whitespace-nowrap transition duration-500"
						:style="{ width: `${currentPercentage}%` }" />
				</div>
				<div
					v-for="(field, index) in costBreakdownFields"
					:key="index"
					class="py-3 my-2 flex items-center justify-between text-lg"
					:class="{
						'border-b': index !== costBreakdownFields.length - 1,
					}">
					<span class="text-gray-500 font-semibold"
						>{{ field.label }}:
					</span>
					<span class="text-gray-700 font-semibold">{{
						field.value
					}}</span>
				</div>
			</div>
		</div>

		<!-- map section -->
		<div
			class="h-[42rem] border rounded-lg shadow-sm mt-24 mx-16 relative overflow-clip">
			<GoogleMap
				ref="mapRef"
				:api-key="googleMapsApiKey"
				style="width: 100%; height: 100%"
				:center="center"
				:zoom="13">
			</GoogleMap>

			<!-- Bottom statistics -->
			<div
				class="absolute bottom-8 w-[80%] left-1/2 transform -translate-x-1/2 bg-white px-8 py-4 rounded-lg h-40 border shadow-sm flex items-center justify-between">
				<div class="w-1/3 h-full max-h-full flex items-center">
					<img
						src="/images/towing-image.jpg"
						alt="Service Image"
						class="h-full w-[40%] object-cover rounded-lg" />

					<div class="flex-grow space-y-1 ml-8">
						<h1 class="font-semibold text-gray-700">
							Benjamin Ndung'o
						</h1>
						<div class="w-fit space-x-2">
							<span class="text-gray-500 font-semibold"
								>Tesla Model X</span
							>
							<span class="text-gray-700 font-semibold"
								>&middot;</span
							>
							<span class="text-gray-500 font-semibold">SUV</span>
						</div>
						<div class="w-fit space-x-2">
							<span
								class="text-blue-600 font-semibold bg-gray-200 rounded-xl px-2 p-1 text-sm">
								KDG 880D
							</span>
						</div>
						<h2 class="font-semibold text-gray-700">
							Trip Id: 3289436746
						</h2>
						<span class="text-gray-500 font-semibold">
							12.03.2023
						</span>
					</div>
				</div>
				<div
					class="w-1/3 h-full max-h-full space-y-6 flex flex-col justify-center">
					<div class="flex items-center space-x-4">
						<div
							class="size-12 flex items-center justify-center bg-blue-600 rounded-full">
							<PickupLocationIcon :classes="['size-7']" />
						</div>
						<div class="flex-grow">
							<span class="text-gray-700 font-semibold"
								>Shell, Kahawa Sukari</span
							>
							<h1 class="text-gray-500">Pick Up Point</h1>
						</div>
					</div>
					<div class="flex items-center space-x-4">
						<div
							class="size-12 flex items-center justify-center bg-pink-600 rounded-full">
							<DropOffLocationIcon :classes="['size-7']" />
						</div>
						<div class="flex-grow">
							<span class="text-gray-700 font-semibold"
								>Shell, Kahawa Sukari</span
							>
							<h1 class="text-gray-500">Drop Off Location</h1>
						</div>
					</div>
				</div>
				<div
					class="h-full max-h-full space-y-4 flex flex-col justify-start">
					<div class="flex items-center">
						<div class="size-4 bg-blue-600 rounded-full" />
						<div
							class="flex-grow flex justify-between items-center space-x-8 ml-1">
							<h1 class="text-gray-500">Distance:</h1>
							<span class="text-blue-500">47.5KM</span>
						</div>
					</div>
					<div class="flex items-center">
						<div class="size-4 bg-pink-600 rounded-full" />
						<div
							class="flex-grow flex justify-between items-center space-x-18 ml-1">
							<h1 class="text-gray-500">Payment:</h1>
							<span class="text-blue-500">47.5KM</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- pre-towing report summary -->
		<div
			class="grid grid-cols-2 gap-x-8 h-[30rem] rounded-lg shadow-sm mt-8 mx-16">
			<!-- Collected Data System -->
			<div class="h-full border rounded-lg flex flex-col"></div>

			<!-- pre-towing pictures section -->
			<div class="h-full flex flex-col space-y-4">
				<div class="h-1/4 whitespace-nowrap">
					<button
						v-for="(image, index) in sampleImages"
						:key="index"
						class="h-full w-1/4 p-1"
						:class="index !== sampleImages.length - 1 ? '' : 'pr-0'"
						@click="activePreTowingImage = index">
						<img
							:src="image"
							class="h-full max-h-full w-full overflow-clip rounded-md"
							alt="Report Image" />
					</button>
				</div>
				<div class="flex-grow relative">
					<img
						:src="sampleImages[activePreTowingImage]"
						alt="Report Image"
						class="object-cover max-h-full rounded-md" />
					<div
						class="absolute bottom-0 bg-gray-700 w-full p-4 bg-opacity-80 overflow-clip">
						<h1 class="text-white font-semibold">
							Pre-Towing Pictures (KCC 002G)
						</h1>
					</div>
				</div>
			</div>
		</div>

		<!-- vehicle spares data section -->
		<div class="mt-40 mx-16 flex space-x-8">
			<div
				class="w-1/4 border px-8 py-2 flex items-center h-20 space-x-4 rounded-lg">
				<FuelIcon
					:classes="['size-12']"
					:color="'#2563eb'" />
				<div class="h-full flex-grow space-y-2">
					<h1 class="text-lg text-gray-700 font-semibold">
						Fuel Level Pre-Tow
					</h1>
					<span class="text-gray-500 font-semibold">50%</span>
				</div>
			</div>
			<div
				class="w-1/4 border px-8 py-2 flex items-center h-20 space-x-4 rounded-lg">
				<TyreIcon
					:classes="['size-12']"
					:color="'#2563eb'" />
				<div class="h-full flex-grow space-y-2">
					<h1 class="text-lg text-gray-700 font-semibold">
						Spare Tyre
					</h1>
					<span class="text-gray-500 font-semibold"
						>2 Spare Tyres</span
					>
				</div>
			</div>
			<div
				class="w-1/4 border px-8 py-2 flex items-center h-20 space-x-4 rounded-lg">
				<ToolkitIcon
					:classes="['size-12']"
					:color="'#2563eb'" />
				<div class="h-full flex-grow space-y-2">
					<h1 class="text-lg text-gray-700 font-semibold">Toolkit</h1>

					<!-- TODO: Fix the wrapping issue here -->
					<span class="text-gray-500 font-semibold"
						>Jack - 3, Spanners - 1</span
					>
				</div>
			</div>
			<div
				class="w-1/4 border px-8 py-2 flex items-center h-20 space-x-4 rounded-lg">
				<GaugeIcon
					:classes="['size-12']"
					:color="'#2563eb'" />
				<div class="h-full flex-grow space-y-2">
					<h1 class="text-lg text-gray-700 font-semibold">
						Milage Pre-Tow
					</h1>
					<span class="text-gray-500 font-semibold">90000 Km</span>
				</div>
			</div>
		</div>

		<!-- Final section with ratings -->
		<div class="mt-10 mx-16 flex space-x-8">
			<div
				class="w-1/2 border px-8 py-2 flex items-center h-32 space-x-4 rounded-lg">
				<img
					src="https://images.unsplash.com/photo-1721048166150-3b2bb2ca3431?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					alt="Responder Image"
					class="rounded-full size-20 object-cover shadow-sm" />
				<div class="flex-grow ml-5 h-fit">
					<h1 class="font-semibold text-lg text-gray-700">
						Vehicle Received By
					</h1>
					<h2 class="font-semibold text-gray-500">
						Asap Rocky Omondi
					</h2>
					<img
						src="public/images/signature.png"
						alt="Receriver Signature"
						class="h-14" />
				</div>
				<div class="bg-blue-200 p-2 rounded-2xl">
					<a href="#"><MessageIcon /></a>
				</div>
				<div class="bg-blue-200 p-2 rounded-2xl">
					<a href="#"><MobileCallIcon /></a>
				</div>
			</div>
			<div class="w-1/2 flex h-32 space-x-8 rounded-lg">
				<div
					class="w-1/2 flex items-center h-full px-8 py-2 border rounded-lg">
					<LocationPin />
					<div class="flex-grow ml-5 h-fit">
						<h1 class="font-semibold text-lg text-gray-700">
							Drop Off Location
						</h1>
						<h2 class="font-semibold text-gray-500">
							Kilimani Mall, Nairobi
						</h2>
						<span class="text-blue-500 font-semibold"
							>12.0.2024</span
						>
					</div>
				</div>
				<div
					class="w-1/2 flex items-center h-full px-8 py-2 border rounded-lg">
					<PersonIcon
						width="3em"
						height="3em" />
					<div class="flex-grow ml-5 h-fit">
						<h1 class="font-semibold text-lg text-gray-700">
							Client Rating
						</h1>
						<h2 class="font-semibold text-gray-500">
							Benjamin Ndung'o
						</h2>
						<div class="text-blue-500 font-semibold">
							<!-- Rating -->
							<div class="flex items-center space-x-1">
								<OneStarIcon />
								<OneStarIcon />
								<OneStarIcon />
								<ZeroStarIcon />
								<ZeroStarIcon />
								<span class="text-gray-500">(3.0)</span>
							</div>
							<!-- End Rating -->
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { type locationCoordsMarker } from "~/types/types";
	import { GoogleMap, InfoWindow, Polyline } from "vue3-google-map";
	import { useGeolocation } from "@vueuse/core";

	definePageMeta({
		name: "roadside-assistance-reports",
		layout: "in-app-layout",
	});

	const runtimeConfig = useRuntimeConfig();
	const { $html2pdf } = useNuxtApp();
	const googleMapsApiKey = runtimeConfig.app.GOOGLE_MAPS_APIKEY;
	const { coords } = useGeolocation();
	const mapRef: Ref<any> = ref(null);
	const center: Ref<locationCoordsMarker> = ref({
		lat: 0.0,
		lng: 0.0,
	});
	const currentPercentage: Ref<number> = ref(60);
	const distanceLeftForTowing: Ref<number> = ref(16);
	const vehicleRegistration: Ref<string> = ref("KSD 222W");
	const sampleImages: readonly string[] = [
		"https://plus.unsplash.com/premium_photo-1720884611740-f5e807d7c77e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://images.unsplash.com/photo-1721143571164-06550363f6d0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://images.unsplash.com/photo-1721265576459-ac6433c540d5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"https://plus.unsplash.com/premium_photo-1719850361442-dd4203f47fb9?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
	];
	const activePreTowingImage: Ref<number> = ref(0);

	watch([() => mapRef.value?.ready], ([ready]) => {
		if (!ready) {
			return;
		} else {
			center.value.lat = coords.value.latitude;
			center.value.lng = coords.value.longitude;

			if (center.value.lat !== 0.0 && center.value.lng !== 0.0)
				mapRef.value?.map.panTo({
					lat: center.value.lat,
					lng: center.value.lng,
				});
		}
	});

	const costBreakdownFields: ComputedRef<any[]> = computed(() => {
		return [
			{
				label: "Distance",
				value: "47.5Km",
			},
			{
				label: "Free Towing Distance",
				value: "-16Km",
			},
			{
				label: "Billable Distance",
				value: "31.75Km",
			},
			{
				label: "Subtotal",
				value: "Ksh 7,405",
			},
			{
				label: "Extra Charges",
				value: "Ksh 7,405",
			},
			{
				label: "Total",
				value: "Ksh 7,405",
			},
		];
	});

	const tripDetailsFields: ComputedRef<any[]> = computed(() => {
		return [
			{
				label: "Distance",
				value: "47.5Km",
			},
			{
				label: "Dispatch",
				value: "13:04",
			},
			{
				label: "Arrival",
				value: "13:34",
			},
			{
				label: "Dropoff",
				value: "14:20",
			},
		];
	});

	const calculatePercentage = (freeDistance: number): number => {
		return (freeDistance * 100) / 20;
	};

	const generatePdf = () => {
		const element = document.getElementById("report")!;

		// clone the element: https://stackoverflow.com/questions/60557116/html2pdf-wont-print-hidden-div-after-unhiding-it/60558415#60558415
		const clonedElement = element.cloneNode(true) as HTMLElement;
		clonedElement.classList.remove("hidden");
		clonedElement.classList.add("block");
		// need to append to the document, otherwise the downloading doesn't start
		document.body.appendChild(clonedElement);

		// https://www.npmjs.com/package/html2pdf.js/v/0.9.0#options
		$html2pdf(clonedElement, {
			margin: 1,
			filename: "filename.pdf",
			image: { type: "png", quality: 0.98 },
			html2canvas: {
				scale: 2,
				scrollY: 0,
				scrollX: 0,
				windowWidth: 1024, // desktop width
				windowHeight: 768, // desktop height
			},
			jsPDF: {
				unit: "in",
				format: "letter",
				orientation: "landscape",
				html2canvas: {
					allowTaint: true,
					useCORS: true,
				},
			},
			enableLinks: true,
		});
		clonedElement.remove();
	};
</script>

<style lang="css">
	.progressbar {
		width: v-bind(currentPercentage);
	}
</style>
