<template>
	<div class="h-full">
		<div class="flex flex-col items-center justify-between space-y-3 lg:flex-row lg:space-y-0">
			<div
				class="border-b-1 w- space-x-4 text-sm font-semibold text-gray-500 md:text-base lg:w-fit lg:text-lg">
				<button
					@click="() => (activeView = 0)"
					:class="[
						'border-b-2',
						activeView === 0 ? 'border-b-blue-600 text-blue-600' : 'border-b-inherit',
					]">
					<span>Create Authority Letter</span>
				</button>
				<button
					@click="() => (activeView = 1)"
					:class="[
						'border-b-2',
						activeView === 1 ? 'border-b-blue-600 text-blue-600' : 'border-b-inherit',
					]">
					<span>View Authority Letters</span>
				</button>
			</div>
			<!-- <NuxtLink
				:to="{ name: 'memberships-home' }"
				class="w-full rounded-md bg-blue-600 p-4 text-center text-sm font-semibold text-white md:w-fit"
				>VIEW ALL MEMBERS</NuxtLink
			> -->
		</div>
		<div class="mt-6">
			<CreateAuthorizationLetter v-if="activeView === 0" />
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'vehicle-valuation-authorization-letter',
		layout: 'console-layout',
	});

	const activeView = ref(0);
</script>
