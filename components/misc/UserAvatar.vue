<template>
	<div
		:class="[
			'tablet:size-9 flex size-8 items-center justify-center rounded-full border bg-blue-600 outline-none',
		]">
		<span :class="['text-lg font-semibold text-slate-100']">{{ firstLetter }}</span>
	</div>
</template>

<script setup lang="ts">
	const { getPrincipal } = useAuth();
	const firstLetter: ComputedRef<string> = computed(() =>
		getPrincipal.value.username.substring(0, 1),
	);
</script>
