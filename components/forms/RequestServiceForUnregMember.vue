<template>
	<form class="py-12">
		<!-- client contacts -->
		<div
			class="flex flex-col lg:flex-row items-center justify-between space-y-3 lg:space-y-0 space-x-0 lg:space-x-3">
			<!-- Full Name Field -->
			<div class="w-full lg:w-1/2">
				<label
					for="full-name"
					class="block font-medium mb-2 dark:text-white"
					>Full Name</label
				>
				<input
					type="text"
					id="full-name"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="Client Name as On Their National ID"
					required />
			</div>

			<!-- Phone Field -->
			<div class="w-full lg:w-1/2">
				<label
					for="phone"
					class="block font-medium mb-2 dark:text-white"
					>Phone</label
				>
				<input
					type="text"
					id="phone"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="+254704080056"
					required />
			</div>
		</div>

		<!-- vehicle registration, make, model -->
		<div
			class="flex my-5 flex-col lg:flex-row items-center justify-between space-x-0 lg:space-x-3 space-y-3 lg:space-y-0">
			<!-- Reg Number -->
			<div class="w-full lg:w-1/3">
				<label
					for="vehicle-registration-number"
					class="block font-medium mb-2 dark:text-white"
					>Vehicle Registration Number</label
				>
				<input
					type="text"
					id="vehicle-registration-number"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="KCD 345G"
					required />
			</div>
			<!-- Vehicle Make -->
			<div class="w-full lg:w-1/3">
				<label
					for="vehicle-make"
					class="block font-medium mb-2 dark:text-white"
					>Vehicle Make</label
				>
				<select
					class="py-3 px-4 pe-9 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					id="vehicle-make"
					required>
					<option
						value="Default Make"
						selected>
						Default Make
					</option>
					<option
						v-for="(make, index) in [
							'Make A',
							'Make B',
							'Make C',
							'Make D',
						]"
						:key="index"
						:value="make">
						{{ make }}
					</option>
				</select>
			</div>
			<!-- Vehicle Model -->
			<div class="w-full lg:w-1/3">
				<label
					for="vehicle-model"
					class="block font-medium mb-2 dark:text-white"
					>Vehicle Model</label
				>
				<select
					class="py-3 px-4 pe-9 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					id="vehicle-model"
					required>
					<option
						value="Default Model"
						selected>
						Default Model
					</option>
					<option
						v-for="(model, index) in [
							'Model A',
							'Model B',
							'Model C',
							'Model D',
						]"
						:key="index"
						:value="model">
						{{ model }}
					</option>
				</select>
			</div>
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
	const formSubmissionLoading = ref(false);
	const { bindToDropOffLocation, bindToPickUpLocation } = useLocations();
	const { makeServiceRequest } = useServiceRequests();

	onMounted(async () => {
		await bindToPickUpLocation().then(() => bindToDropOffLocation());
	});
</script>

<style lang="css">
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
