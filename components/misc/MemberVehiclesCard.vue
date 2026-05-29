<template>
	<div
		class="flex h-fit flex-col overflow-clip rounded-lg bg-pink-700 transition-colors duration-150 hover:bg-pink-900">
		<h1 class="mt-2 ml-4 font-extrabold text-white">{{ props.regNo }}</h1>
		<div class="my-2 pl-4 text-white">
			<h1 class="mb-2 text-sm">{{ props.membershipType }}</h1>
			<div class="grid grid-cols-2">
				<div>
					<h1 class="w-fit text-sm text-gray-200">Joined</h1>
					<h2 class="text-xs font-semibold">{{ props.dateRegistered }}</h2>
				</div>
				<div>
					<h1 class="w-fit text-sm text-gray-200">Expiry Date</h1>
					<h2 class="text-xs font-semibold">{{ props.expirationDate }}</h2>
				</div>
			</div>
		</div>
		<div
			class="flex h-10 items-center space-x-2 rounded-b-lg border-t border-t-gray-500 font-semibold text-white backdrop-opacity-40 px-4">
			<div
				class="size-2 rounded-full"
				:class="props.membershipStatus === 'Active' ? 'bg-green-500' : 'bg-red-500'" />
			<h1 class="text-sm">{{ props.membershipStatus }}</h1>
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
