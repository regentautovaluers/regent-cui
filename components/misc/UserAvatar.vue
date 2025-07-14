<template>
	<div
		:class="[
			'ax-w-12 flex max-h-12 min-h-12 min-w-12 items-center justify-center rounded-full border bg-blue-600 outline-none',
		]">
		<span :class="['text-xl font-semibold text-slate-100']">{{ firstLetter }}</span>
	</div>
</template>

<script setup lang="ts">
	const { getPrincipal } = useAuth();
	const firstLetter: ComputedRef<string> = computed(() =>
		getPrincipal.value.username.substring(0, 1),
	);
</script>
