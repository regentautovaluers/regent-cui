<template>
	<div class="responsive-view h-fit py-10">
		<h1 class="my-5 text-xl font-semibold md:text-3xl">Actions</h1>
		<div class="flex space-x-4">
			<div class="min-w-1/6 flex h-full w-[15%] flex-col space-y-1">
				<NuxtLink
					v-for="(link, index) in computedInternalLinks"
					:to="{ name: link.to }"
					class="whitespace-nowrap rounded-lg p-2 hover:bg-gray-100"
					:class="
						$route.name === link.to ? 'bg-gray-100 font-semibold text-blue-600' : null
					"
					:key="index"
					>{{ link.text }}</NuxtLink
				>
			</div>
			<div class="h-full w-[65%]">
				<NuxtPage />
			</div>
			<div class="flex h-full flex-grow items-center justify-center">
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
