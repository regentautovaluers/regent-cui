<template>
	<div class="console-layout-spacing rounded-lg border border-gray-200 bg-white">
		<div class="hide-scrollbar space-x-4 overflow-x-scroll border-b p-5 whitespace-nowrap">
			<button
				@click="() => (activeRegistrationForm = 0)"
				class="relative text-sm">
				<span
					:class="[
						activeRegistrationForm == 0
							? 'font-semibold text-blue-600 after:absolute after:-bottom-[23px] after:left-0 after:h-[2.5px] after:w-full after:bg-blue-600'
							: 'text-gray-500',
					]"
					>Individual Registration</span
				>
			</button>
			<button
				@click="() => (activeRegistrationForm = 1)"
				class="relative text-sm">
				<span
					:class="[
						activeRegistrationForm == 1
							? 'font-semibold text-blue-600 after:absolute after:-bottom-[23px] after:left-0 after:h-[2.5px] after:w-full after:bg-blue-600'
							: 'text-gray-500',
					]"
					>Bulk / Fleet Registration</span
				>
			</button>
		</div>
		<div class="laptop:p-4 laptop-lg:p-8 laptop:flex-1 mt-5 p-2 flex flex-col">
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
