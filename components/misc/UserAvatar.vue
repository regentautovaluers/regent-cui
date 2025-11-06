<template>
	<div
		:class="[
			'tablet:flex hidden min-h-[43px] min-w-[43px] items-center justify-center rounded-full border bg-blue-600 outline-none',
		]">
		<span :class="['text-xl font-semibold text-slate-100']">{{ firstLetter }}</span>
	</div>
</template>

<script setup lang="ts">
	const { getPrincipal } = useAuth();
	const firstLetter: ComputedRef<string> = computed(
		() => getPrincipal.value?.username?.substring(0, 1) ?? '',
	);
</script>
