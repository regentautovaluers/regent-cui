<template>
	<div class="py-10 bg-[#f6f9f2] responsive-view h-full">
		<div class="bg-white w-full p-10 px-2 lg:px-10">
			<h1 class="my-4 text-2xl antialiased font-semibold">
				Editing Details for {{ $route.query.memberName }}
			</h1>
			<EditMemberDetails />
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: "edit-member-details",
		layout: "in-app-layout",
	});
</script>
