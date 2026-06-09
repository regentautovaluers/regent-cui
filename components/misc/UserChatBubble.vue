<template>
	<div :class="['group h-fit', optionalStyles]">
		<div :class="['rounded-xl bg-gray-200/70 p-3 text-sm text-gray-700 outline-none']">
			<span>{{ message }}</span>
		</div>
		<div class="invisible flex h-fit w-full items-end justify-end group-hover:visible">
			<button class="inline-flex items-center justify-center rounded-full p-1">
				<span class="icon-[material-symbols-light--content-copy-outline] size-5"></span>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	withDefaults(
		defineProps<{
			message: string;
			optionalStyles?: string;
		}>(),
		{
			message: '',
		},
	);
</script>
