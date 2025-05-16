<template>
	<div class="console-layout-spacing">
		<div class="flex flex-col items-center justify-between space-y-3 lg:flex-row lg:space-y-0">
			<div
				class="border-b-1 w- space-x-4 text-sm font-semibold text-gray-500 md:text-base lg:w-fit lg:text-lg">
				<button
					@click="() => (activeRegistrationForm = 0)"
					:class="[
						'border-b-2',
						activeRegistrationForm === 0
							? 'border-b-blue-600 text-blue-600'
							: 'border-b-inherit',
					]">
					<span>Individual Registration</span>
				</button>
				<button
					@click="() => (activeRegistrationForm = 1)"
					:class="[
						'border-b-2',
						activeRegistrationForm === 1
							? 'border-b-blue-600 text-blue-600'
							: 'border-b-inherit',
					]">
					<span>Bulk / Fleet Registration</span>
				</button>
			</div>
			<!-- <NuxtLink
				:to="{ name: 'memberships-home' }"
				class="w-full rounded-md bg-blue-600 p-4 text-center text-sm font-semibold text-white md:w-fit"
				>VIEW ALL MEMBERS</NuxtLink
			> -->
		</div>
		<div class="mt-6">
			<IndividualMembershipReg v-if="activeRegistrationForm === 0" />
			<BulkMembershipReg v-else-if="activeRegistrationForm === 1" />
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'ava-membership-onboard',
		layout: 'console-layout',
	});

	const activeRegistrationForm = ref(0);
</script>
