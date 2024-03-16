<template>
	<form class="py-12">
		<div class="w-full">
			<label
				for="registration-number"
				class="block font-medium mb-2 dark:text-white"
				>Provide Vehicle Registration Number</label
			>
			<input
				type="text"
				id="registration-number"
				class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 peer rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
				placeholder="Provide the registration number to search"
				required />
			<span class="invisible peer-focus:visible text-xs"
				>Press ENTER key when you're done typing</span
			>
		</div>
		<!-- Progress Bar -->
		<div class="my-5">
			<div
				class="flex w-full h-3 bg-gray-200 rounded-full overflow-hidden"
				role="progressbar"
				aria-valuenow="1"
				aria-valuemin="0"
				aria-valuemax="100">
				<div
					class="flex flex-col justify-center rounded-full overflow-hidden bg-pink-600 text-xs text-white text-center whitespace-nowrap transition duration-500"
					:style="{ width: `${currentPercentage}%` }" />
			</div>
			<div
				class="flex items-center justify-between w-full text-end text-gray-500 antialiased mt-3">
				<span> {{ vehicleRegistration }} </span>
				<span>{{ distanceLeftForTowing }} KM FREE TOWING LEFT</span>
			</div>
		</div>
		<!-- End Progress Bar -->

		<!-- Vehicle Make and Model -->
		<div class="w-full">
			<label
				for="registration-number"
				class="block font-medium mb-2 dark:text-white"
				>Vehicle Make and Model</label
			>
			<input
				type="text"
				id="registration-number"
				class="py-3 px-4 h-[4.5rem] block w-full text-gray-500 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-80 disabled:pointer-events-none"
				placeholder="Provide the registration number to search"
				:value="vehicleMakeAndModel"
				disabled
				required />
		</div>

		<!-- pickup location -->
		<div class="mt-5">
			<label
				for="pickup-location"
				class="block font-medium mb-2 dark:text-white"
				>Pickup Location</label
			>
			<div class="relative">
				<input
					type="text"
					id="pickup-location"
					class="py-5 ps-10 w-full bg-transparent border-t-transparent border-b-2 border-x-transparent border-b-gray-200 focus:border-t-transparent focus:border-x-transparent focus:border-b-blue-500 focus:ring-0"
					placeholder="Type an address to search"
					required />
				<img
					src="/icons/misc/pick-up-location.svg"
					alt="Pickup Location"
					class="absolute top-[25%]" />
			</div>
		</div>

		<!-- drop off location -->
		<div class="mt-5">
			<label
				for="dropoff-location"
				class="block font-medium mb-2 dark:text-white"
				>Drop Off Location</label
			>
			<div class="relative">
				<input
					type="text"
					id="dropoff-location"
					class="py-5 ps-10 w-full bg-transparent border-t-transparent border-b-2 border-x-transparent border-b-gray-200 focus:border-t-transparent focus:border-x-transparent focus:border-b-blue-500 focus:ring-0"
					placeholder="Type an address to search"
					required />
				<img
					src="/icons/misc/drop-off-location.svg"
					alt="Pickup Location"
					class="absolute top-[25%]" />
			</div>
		</div>

		<!-- comments -->
		<div class="my-5">
			<label
				for="comments-box"
				class="block font-medium mb-2 dark:text-white"
				>Comments</label
			>
			<textarea
				id="comments-box"
				class="py-3 px-4 block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500"
				rows="2"
				placeholder="Provide optional comments for this service request."></textarea>
		</div>

		<!-- statistics -->
		<div class="flex justify-between mt-8 space-x-4">
			<div
				class="w-1/3 p-4 rounded-md border border-pink-500"
				v-for="a in 3">
				<h1 class="text-lg font-semibold text-pink-500">Distance</h1>
				<h1 class="text-lg font-semibold text-gray-500">50Km</h1>
			</div>
		</div>

		<!-- submit button -->
		<button
			type="submit"
			class="py-3 px-4 w-full mt-7 text-lg h-16 items-center gap-x-2 font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700">
			<span v-if="!formSubmissionLoading">Submit Towing Request</span>
			<div
				v-if="formSubmissionLoading"
				class="animate-spin inline-block size-5 border-[3px] border-white border-current border-t-transparent text-gray-800 rounded-full"
				role="status"
				aria-label="loading" />
		</button>
	</form>
</template>

<script setup lang="ts">
	const currentPercentage: Ref<number> = ref(80);
	const vehicleRegistration: Ref<string> = ref("KCG 002G");
	const distanceLeftForTowing: Ref<number> = ref(16);
	const vehicleMake: Ref<string> = ref("Test Make");
	const vehicleModel: Ref<string> = ref("Test Model");
	const formSubmissionLoading = ref(false);
	const { bindToDropOffLocation, bindToPickUpLocation } = useLocations();

	const vehicleMakeAndModel = computed(
		() => `${vehicleMake.value} ${vehicleModel.value}`
	);

	onMounted(async () => {
		await bindToPickUpLocation().then(() => bindToDropOffLocation());
	});
</script>

<style lang="css">
	.progressbar {
		width: v-bind(currentPercentage.value) %;
	}

	.pac-container {
		border-radius: 10px;
		margin-top: 2px;
		box-shadow: 10px;
	}

	.pac-item {
		padding-top: 6px;
		padding-bottom: 6px;
		font-size: 12px;
	}
</style>
