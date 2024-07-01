<template>
	<div class="w-full flex flex-col items-center py-2">
		<div class="rounded-full relative">
			<img
				class="inline-block size-[160px] rounded-full shadow-lg"
				src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
				alt="User Image" />
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
		<form
			@submit.prevent="uploadProfilePicture"
			class="mt-1 w-full flex justify-center">
			<!-- prettier-ignore -->
			<label
				for="profile-picture"
				class="text-gray-500 bg-transparent border bg-gray-200 py-2 px-3 rounded-xl shadow-sm transition duration-200 hover:cursor-pointer hover:bg-gray-200 w-full inline-flex justify-between items-center group"
				><span>Change Profile Picture</span>
				<svg
					viewBox="0 0 24 24"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
					class="size-6 transition duration-200 group-hover:text-gray-400">
					<path
						d="M4 16.0001V20.0001L8 20.0001L18.8686 9.13146L18.8695 9.13061C19.265 8.73516 19.4628 8.53736 19.5369 8.3092C19.6021 8.10835 19.6022 7.89201 19.5369 7.69117C19.4627 7.46284 19.2646 7.26474 18.8686 6.86872L17.1288 5.12892C16.7345 4.7346 16.5369 4.53704 16.3091 4.46301C16.1082 4.39775 15.8919 4.39775 15.691 4.46301C15.463 4.53709 15.2652 4.73488 14.8704 5.12976L14.8686 5.13146L4 16.0001Z" />
						</svg>
			</label>
			<input
				id="profile-picture"
				type="file"
				name="profilePicture"
				accept=".jpg, .png, .webp"
				class="hidden" />
		</form>
	</div>
</template>

<script setup lang="ts">
	const { getPrincipal } = useAuth();
	const uploadProfilePicture = async () => {};
</script>
