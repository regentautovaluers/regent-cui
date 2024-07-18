<template>
	<div class="py-10 h-full responsive-view">
		<!-- top section with general information about the report -->
		<div class="rounded-lg shadow-sm h-48 bg-red-500">
			<div></div>
			<hr />
			<div></div>
		</div>

		<!-- responder details, trip detals and cost breakdown -->
		<div
			class="grid grid-cols-2 gap-x-8 h-[30rem] rounded-lg shadow-sm mt-8">
			<div class="h-full bg-yellow-500 rounded-lg"></div>
			<div class="h-full bg-green-500 rounded-lg"></div>
		</div>

		<!-- map section -->
		<div class="h-[32rem] rounded-lg shadow-sm mt-8 bg-pink-500"></div>
	</div>
</template>

<script setup>
	definePageMeta({
		name: "roadside-assistance-reports",
		layout: "in-app-layout",
	});
</script>
