<template>
	<div
		:class="[
			'flex min-h-[50%] w-full flex-col justify-between rounded-xl bg-gray-200 p-6',
			width,
		]">
		<h1 class="text-center text-2xl font-semibold">
			{{ componentProps.alertHeading }}
		</h1>
		<slot name="alertMessage" />
		<div class="flex h-16 items-center rounded-xl bg-yellow-400 bg-opacity-70 p-2">
			<div class="w-[15%]"></div>
			<span class="flex-grow text-center">{{ componentProps.warningMessage }}</span>
		</div>

		<div class="flex flex-col space-y-2">
			<slot name="actionControls" />
		</div>
	</div>
</template>

<script setup lang="ts">
	export interface ComponentProps {
		alertType: string;
		width?: string;
		alertHeading: string;
		warningMessage: string;
	}

	const componentProps = defineProps<ComponentProps>();
</script>
