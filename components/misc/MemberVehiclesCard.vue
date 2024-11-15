<template>
	<div
		class="flex h-fit w-[22rem] min-w-[22rem] flex-col overflow-clip rounded-lg bg-blue-600 transition-colors duration-300 hover:bg-blue-700">
		<div class="flex h-12 items-center pl-4 text-xl font-extrabold text-white">
			<h1>{{ props.regNo }}</h1>
		</div>
		<div class="my-4 px-4 text-white">
			<h1 class="mb-2 text-lg font-semibold">{{ props.membershipType }}</h1>
			<div class="grid grid-cols-2">
				<div>
					<h1 class="w-fit text-gray-400">Joined</h1>
					<h2 class="font-semibold">{{ props.dateRegistered }}</h2>
				</div>
				<div>
					<h1 class="w-fit text-gray-400">Expiry Date</h1>
					<h2 class="font-semibold">{{ props.expirationDate }}</h2>
				</div>
			</div>
		</div>
		<div
			class="flex h-12 items-center space-x-2 rounded-b-lg bg-gray-600 bg-opacity-40 pl-4 font-semibold text-white">
			<div
				class="rounded-full size-3"
				:class="props.membershipStatus === 'Active' ? 'bg-green-500' : 'bg-red-500'" />
			<h1>{{ props.membershipStatus }}</h1>
		</div>
	</div>
</template>

<script setup lang="ts">
	const props = defineProps({
		membershipId: { required: true, type: Number },
		regNo: { required: true, type: String },
		membershipType: { required: true, type: String },
		dateRegistered: { required: true, type: String },
		expirationDate: { required: true, type: String },
		membershipStatus: { required: true, type: String },
	});
</script>
