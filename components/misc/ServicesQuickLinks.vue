<template>
	<div class="min-h-84 w-68 max-w-68 rounded-lg border px-5 py-5 shadow-sm">
		<div class="size-fit rounded-full border border-blue-600">
			<button
				class="m-0.5 rounded-full bg-blue-600 p-4"
				disabled>
				<slot />
			</button>
		</div>
		<h1 class="mt-2 text-xl font-semibold">{{ title }}</h1>
		<p class="my-3 text-wrap text-gray-500">
			{{ props.serviceDescription }}
		</p>
		<NuxtLink
			class="text-blue-500 duration-100 ease-in-out hover:text-blue-700"
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
