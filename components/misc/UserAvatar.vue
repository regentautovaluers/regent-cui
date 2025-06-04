<template>
	<div
		:class="[
			'flex items-center justify-center rounded-full border bg-blue-600 outline-none',
			props.circleSize,
		]">
		<span :class="['font-semibold text-slate-100', props.initialsSize]">{{ firstLetter }}</span>
	</div>
</template>

<script setup lang="ts">
	const props = defineProps({
		circleSize: { required: false, type: String, default: 'size-11' },
		initialsSize: { required: false, type: String, default: 'text-lg' },
	});

	const { getPrincipal } = useAuth();
	const firstLetter: ComputedRef<string> = computed(() =>
		getPrincipal.value.username.substring(0, 1),
	);
</script>
