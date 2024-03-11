<template>
	<div class="py-10 bg-[#f6f9f2] responsive-view h-full">
		<div class="bg-white w-full p-10 px-2 lg:px-10">
			<h1 class="my-4 text-2xl antialiased font-semibold">
				Add To Your Fleets
			</h1>
			<p class="text-lg text-gray-500">
				Note that each fleet you add using this form will be shown to
				you as one of your corporate options when you make a bulk
				membership registration.
			</p>
			<form
				@submit.prevent="addToCorporateFleet"
				class="mt-5">
				<label
					for="fleet-name"
					class="block font-medium mb-2 dark:text-white"
					>Name of the Fleet</label
				>
				<input
					type="text"
					id="fleet-name"
					class="py-3 px-4 h-[4.5rem] block w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
					placeholder="e.g Kenya Power & Lightning Company" />
				<button
					type="submit"
					class="py-3 px-4 w-full mt-7 lg:w-1/2 text-lg h-16 items-center gap-x-2 font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
					<span v-if="!formSubmissionLoading">Add to Fleet</span>
					<div
						v-if="formSubmissionLoading"
						class="animate-spin inline-block size-5 border-[3px] border-white border-current border-t-transparent text-gray-800 rounded-full"
						role="status"
						aria-label="loading" />
				</button>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: "manage-fleets",
		layout: "in-app-layout",
	});

	const formSubmissionLoading = ref(false);

	function addToCorporateFleet() {}
</script>
