<template>
	<div class="flex w-full flex-col items-center py-2">
		<div class="relative size-fit rounded-full">
			<img
				class="size-[160px] rounded-full object-cover shadow-lg"
				:src="profilePicture" />
		</div>
		<form class="mt-1 flex w-[58%] justify-center md:w-[28%]">
			<label
				for="profile-picture"
				class="group inline-flex w-full items-center justify-between rounded-2xl border bg-gray-200 bg-transparent px-3 py-2 text-gray-500 shadow-sm transition duration-200 hover:cursor-pointer hover:bg-gray-200"
				><span>Change Avatar</span>
				<FormSubmissionLoader
					classes="size-6 animate-spin text-gray-400"
					v-if="updateProfilePictureLoading" />
				<!-- prettier-ignore -->
				<svg
					viewBox="0 0 24 24"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
					class="size-6 transition duration-200 group-hover:text-gray-400"
                    v-else>
					<path
						d="M4 16.0001V20.0001L8 20.0001L18.8686 9.13146L18.8695 9.13061C19.265 8.73516 19.4628 8.53736 19.5369 8.3092C19.6021 8.10835 19.6022 7.89201 19.5369 7.69117C19.4627 7.46284 19.2646 7.26474 18.8686 6.86872L17.1288 5.12892C16.7345 4.7346 16.5369 4.53704 16.3091 4.46301C16.1082 4.39775 15.8919 4.39775 15.691 4.46301C15.463 4.53709 15.2652 4.73488 14.8704 5.12976L14.8686 5.13146L4 16.0001Z" />
				</svg>
			</label>
			<input
				id="profile-picture"
				type="file"
				name="profilePicture"
				accept=".jpg, .png, .webp"
				class="hidden"
				@change.prevent="updateProfilePicture" />
		</form>
	</div>
</template>

<script setup lang="ts">
	const { getPrincipal, updateProfilePicture, updateProfilePictureLoading } = useAuth();
	const profilePicture: Ref<string> = ref('');

	onMounted(() => (profilePicture.value = getPrincipal.value.profilePicture));
</script>
