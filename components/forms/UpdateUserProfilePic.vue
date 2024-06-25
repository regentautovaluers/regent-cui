<template>
	<div class="w-full flex flex-col items-center py-2">
		<div class="rounded-full relative">
			<img
				class="inline-block size-[160px] rounded-full shadow-lg"
				src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
				alt="User Image" />
			<!-- <form
				@submit.prevent="uploadProfilePicture"
				class="absolute bottom-0 right-0">
				<input
					type="file"
					name="profilePicture"
					accept=".jpg, .png, .webp"
					class="w-fit file:rounded-full file:border-0 file:bg-blue-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:cursor-pointer hover:file:bg-amber-50 hover:file:text-amber-700" />
			</form> -->
		</div>
		<ClientOnly>
			<h1 class="font-bold tracking text-lg">
				{{ getPrincipal.username }}
			</h1>
			<h2 class="text-gray-500 font-semibold">
				{{ getPrincipal.email }}
			</h2>
			<h3 class="text-gray-500 font-bold">{{ getPrincipal.corpName }}</h3>
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
	const { getPrincipal } = useAuth();
	const uploadProfilePicture = async () => {};
</script>
