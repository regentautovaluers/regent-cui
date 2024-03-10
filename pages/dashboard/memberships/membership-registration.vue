<template>
	<div class="py-10 bg-[#f6f9f2] responsive-view h-full">
		<div class="bg-white w-full p-10">
			<div class="flex items-center justify-between">
				<div>
					<span>Individual Registration</span>
					<span>Bulk / Fleet Registration</span>
				</div>
				<NuxtLink
					:to="{ name: 'new-member' }"
					class="bg-blue-600 text-white font-semibold text-sm p-4 rounded-md w-full md:w-fit text-center"
					>VIEW ALL MEMBERS</NuxtLink
				>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: "membership-registration",
		layout: "in-app-layout",
	});
</script>
