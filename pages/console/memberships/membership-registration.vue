<template>
	<div class="py-10 bg-[#f6f9f2] responsive-view h-fit">
		<div class="bg-white w-full p-10 px-2 lg:px-10">
			<div
				class="flex flex-col lg:flex-row space-y-3 lg:space-y-0 items-center justify-between">
				<div class="text-sm md:text-base lg:text-lg border-b-1 space-x-4 w- lg:w-fit">
					<button
						@click="() => (currentRegForm = 0)"
						:class="[
							'border-b-2',
							currentRegForm === 0
								? 'border-b-blue-600 text-blue-600'
								: 'border-b-inherit',
						]">
						<span>Individual Registration</span>
					</button>
					<button
						@click="() => (currentRegForm = 1)"
						:class="[
							'border-b-2',
							currentRegForm === 1
								? 'border-b-blue-600 text-blue-600'
								: 'border-b-inherit',
						]">
						<span>Bulk / Fleet Registration</span>
					</button>
				</div>
				<NuxtLink
					:to="{ name: 'memberships-home' }"
					class="bg-blue-600 text-white font-semibold text-sm p-4 rounded-md w-full md:w-fit text-center"
					>VIEW ALL MEMBERS</NuxtLink
				>
			</div>
			<div class="mt-16">
				<IndividualMembershipReg v-if="currentRegForm === 0" />
				<BulkMembershipReg v-else-if="currentRegForm === 1" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'membership-registration',
		layout: 'in-app-layout',
	});

	const currentRegForm = ref(0);
</script>
