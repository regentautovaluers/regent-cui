<template>
	<div class="w-full flex flex-col items-center py-2">
		<img
			class="inline-block size-[190px] rounded-full shadow-lg"
			src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
			alt="User Image" />
		<h1 class="font-bold tracking text-lg">{{ getPrincipal.username }}</h1>
        <h2 class="text-gray-500 font-semibold">{{ getPrincipal.email }}</h2>
		<h3 class="text-gray-500 font-bold">{{ getPrincipal.corpName }}</h3>
	</div>
</template>

<script setup lang="ts">
	const { getPrincipal } = useAuth();
</script>
