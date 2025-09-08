<template>
	<div
		class="flex h-[21rem] flex-col items-start justify-center rounded-lg border px-6 shadow-sm">
		<div class="size-fit rounded-full border border-blue-600">
			<button
				class="m-0.5 inline-flex size-18 items-center justify-center rounded-full bg-blue-600 p-4"
				disabled>
				<slot />
			</button>
		</div>
		<h1 class="t mt-2 font-semibold whitespace-nowrap">{{ title }}</h1>
		<p class="my-3 text-start text-sm text-wrap text-gray-500">
			{{ props.serviceDescription }}
		</p>
		<NuxtLink
			class="text-sm text-blue-600 duration-100 ease-in-out"
			:to="{ name: props.link }">
			<span>Get Started</span>
		</NuxtLink>
	</div>
</template>

<script setup lang="ts">
	const props = defineProps({
		title: { required: true, type: String },
		link: { required: true, type: String },
		serviceDescription: { required: true, type: String },
	});
</script>
