<template>
	<div class="responsive-view h-fit bg-[#f6f9f2] py-10">
		<div class="w-full bg-white p-10 px-2 lg:px-10">
			<div
				class="flex flex-col items-center justify-between space-y-3 lg:flex-row lg:space-y-0">
				<div class="border-b-1 w- space-x-4 text-sm md:text-base lg:w-fit lg:text-lg">
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
					class="w-full rounded-md bg-blue-600 p-4 text-center text-sm font-semibold text-white md:w-fit"
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
