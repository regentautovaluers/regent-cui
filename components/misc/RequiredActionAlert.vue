<template>
	<div
		:class="[
			'min-h-[50%] w-full rounded-xl p-6 flex flex-col justify-between bg-gray-200',
			width,
		]">
		<h1 class="text-center font-semibold text-2xl">
			{{ componentProps.alertHeading }}
		</h1>
		<slot name="alertMessage" />
		<div
			class="rounded-xl bg-yellow-400 bg-opacity-70 h-16 flex p-2 items-center">
			<div class="w-[15%]"></div>
			<span class="text-center flex-grow">{{
				componentProps.warningMessage
			}}</span>
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
