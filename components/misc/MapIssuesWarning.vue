<template>
	<div
		class="my-4 rounded-lg border border-yellow-200 bg-yellow-100 p-4 text-sm text-yellow-800"
		role="alert">
		If the map adjacent to this form has not loaded, kindly click
		<button @click="reloadPage">
			<span class="font-semibold">Reload</span>
		</button>
		to reload it before filling the form.
	</div>
</template>

<script setup lang="ts">
	const reloadPage = (): void => {
		location.reload();
	};
</script>
