<template>
	<div class="responsive-view h-fit bg-[#f6f9f2] py-10">
		<div class="w-full bg-white p-10 px-2 lg:px-10">
			<h1 class="my-4 text-2xl font-semibold antialiased">
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
