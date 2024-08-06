<template>
	<div class="py-10 bg-[#f6f9f2] responsive-view h-fit">
		<div class="bg-white w-full p-10 px-2 lg:px-10">
			<h1 class="my-4 text-2xl antialiased font-semibold">
				Editing Membership Details for
				{{ $route.query.vehicleRegistration }}
			</h1>
			<EditMembershipDetails />
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'edit-membership-details',
		layout: 'in-app-layout',
	});
</script>
