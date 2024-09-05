<template>
	<button
		class="rounded-lg bg-blue-500 p-2 text-white outline-none"
		@click="openToast">
		Open Toast
	</button>
</template>

<script setup lang="ts">
	const openToast = () => {
		useToast('test message', {
			type: 'info',
			showIcon: true,
			showCloseButton: true,
			hideProgressBar: true,
			transition: 'slide',
		});
	};
</script>
