<template>
	<div
		:class="[
			'flex max-h-11 min-h-11 max-w-11 min-w-11 items-center justify-center rounded-full border bg-blue-600 outline-none',
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
