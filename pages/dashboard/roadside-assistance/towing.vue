<template>
	<div class="py-10 responsive-view grid grid-cols-[.5fr,.6fr]">
		<div class="h-full bg-red-500">
			<h1>Welcome to towing in roadside assistance</h1>
		</div>
		<div class="p-5">
			<h1 class="mb-4 text-3xl antialiased font-semibold">
				Request Towing
			</h1>
			<div
				class="flex flex-col lg:flex-row space-y-3 lg:space-y-0 items-center justify-between">
				<!-- TODO: fix issue with the border-b class to get rid of white space due to space-x-4 -->
				<div
					class="text-sm md:text-base lg:text-lg border-b-1 space-x-4 w- lg:w-fit">
					<button
						@click="() => (currentRegForm = 0)"
						:class="[
							'border-b-2 pb-1',
							currentRegForm === 0
								? 'border-b-blue-600 text-blue-600'
								: 'border-b-inherit',
						]">
						<span>Registered Client</span>
					</button>
					<button
						@click="() => (currentRegForm = 1)"
						:class="[
							'border-b-2 pb-1',
							currentRegForm === 1
								? 'border-b-blue-600 text-blue-600'
								: 'border-b-inherit',
						]">
						<span>Unregistered Client</span>
					</button>
				</div>
			</div>
			<RequestServiceForRegMember v-if="currentRegForm === 0" />
			<RequestServiceForUnregMember v-else />
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: "ava-towing",
		layout: "in-app-layout",
	});
	const currentRegForm: Ref<number> = ref(0);
</script>
