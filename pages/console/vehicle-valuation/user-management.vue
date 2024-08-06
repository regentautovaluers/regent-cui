<template>
	<div class="py-10 responsive-view h-fit">
		<h1 class="text-xl my-5 md:text-3xl font-semibold">Actions</h1>
		<div class="flex space-x-4">
			<div class="h-full flex flex-col space-y-1 w-[15%] min-w-1/6">
				<NuxtLink
					v-for="(link, index) in computedInternalLinks"
					:to="{ name: link.to }"
					class="p-2 hover:bg-gray-100 rounded-lg whitespace-nowrap"
					:class="
						$route.name === link.to ? 'text-blue-600 font-semibold bg-gray-100' : null
					"
					:key="index"
					>{{ link.text }}</NuxtLink
				>
			</div>
			<div class="h-full w-[65%]">
				<NuxtPage />
			</div>
			<div class="h-full flex-grow flex justify-center items-center">
				<UpdateUserProfilePic />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'valuation-user-management',
		layout: 'in-app-layout',
	});

	type InternalLink = {
		text: string;
		to: string;
		forAdminOnly: boolean;
	};

	const { isPrincipalAdmin } = useAuth();
	const internalLinks: InternalLink[] = [
		{
			text: 'My Account',
			to: 'valuation-my-account',
			forAdminOnly: false,
		},
		{
			text: 'Manage All Users',
			to: 'valuation-manage-users',
			forAdminOnly: true,
		},
		{
			text: 'Add New User',
			to: 'valuation-users-add-user',
			forAdminOnly: true,
		},
		// {
		// 	text: 'Update Details',
		// 	to: 'valuation-update-user-details',
		// },
	];

	const computedInternalLinks: ComputedRef<InternalLink[]> = computed(() => {
		return internalLinks.filter((link) => {
			if (link.forAdminOnly) {
				return isPrincipalAdmin();
			}
			return true;
		});
	});
</script>
