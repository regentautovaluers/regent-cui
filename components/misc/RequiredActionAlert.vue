<template>
	<div
		:class="[
			'min-h-[24rem] h-fit rounded-2xl p-6',
			notificationColor,
			width,
		]">
		<h1 class="inline-flex items-center space-x-2 font-semibold text-2xl">
			<span
				class="bg-green-500 rounded-full size-10 flex items-center justify-center mr-4">
				<Icon
					name="uil:github"
					color="black"
					size="30" />
			</span>
			{{ componentProps.alertHeading }}
		</h1>
		<slot name="alertMessage" />
		<slot name="actionControls" />
	</div>
</template>

<script setup lang="ts">
	export interface ComponentProps {
		alertType: string;
		width?: string;
		alertHeading: string;
	}

	const componentProps = defineProps<ComponentProps>();
	const notificationColor = "bg-red-500";
</script>
