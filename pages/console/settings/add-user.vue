<template>
	<form
		class="laptop:p-4 laptop-lg:p-8 flex flex-1 flex-col rounded-lg border-2 bg-white p-2 outline-none"
		@submit.prevent="
			addNewAccount(
				username,
				email,
				phoneNumber,
				password,
				corporateBranch,
				companyRole,
				[userRole],
				cleanRefs,
			)
		">
		<div>
			<label class="generic-input-label generic-input-required-label">Full Name</label>
			<div class="flex w-full space-x-4">
				<input
					type="text"
					class="generic-input"
					placeholder="John"
					required
					v-model.trim="firstName" />
				<input
					type="text"
					class="generic-input"
					placeholder="Doe"
					required
					v-model.trim="otherName" />
			</div>
		</div>
		<div class="mt-3">
			<label
				class="generic-input-label generic-input-required-label"
				for="email"
				>Email</label
			>
			<div class="flex flex-grow">
				<input
					type="email"
					id="email"
					class="generic-input"
					placeholder="johndoe@corpemail.com"
					required
					v-model.trim="email" />
			</div>
		</div>
		<div class="mt-3">
			<label
				class="generic-input-label"
				for="phone"
				>Phone Number</label
			>
			<div class="flex flex-grow">
				<input
					type="text"
					id="phone"
					class="generic-input"
					placeholder="254712345678"
					required
					v-model.trim="phoneNumber" />
			</div>
		</div>
		<div class="mt-3">
			<label class="generic-input-label generic-input-required-label">Password</label>
			<div class="flex flex-grow">
				<input
					type="password"
					id="new-password"
					class="generic-input"
					placeholder="gnarly_squirell@123"
					required
					v-model.trim="password" />
			</div>
		</div>

		<div
			class="mt-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800"
			role="alert">
			<div class="flex items-center">
				<svg
					class="me-2 h-4 w-4 shrink-0"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20">
					<path
						d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
				</svg>
				<span class="sr-only">Info</span>
				<h3 class="text-sm font-medium">Notice On The User's Branch</h3>
			</div>

			<p class="mt-2 mb-4 text-sm">
				If you fail to choose the user's branch, they will be able to access all reports
				across all your branches. Similarly, if a user is an admin with a branch, they still
				will be able to access all reports across all you branches. Giving a non-admin a
				branch will make the user only access reports for that branch. Reload you branches
				by clicking the 'Refresh List' below, or
				<NuxtLink
					:to="{ name: 'corp-branches' }"
					class="font-semibold underline underline-offset-2"
					>Add One</NuxtLink
				>
			</p>
			<div class="flex">
				<button
					type="button"
					class="rounded-lg border border-yellow-800 bg-transparent px-3 py-1.5 text-center text-sm font-medium text-yellow-800 hover:bg-yellow-900 hover:text-white focus:ring-4 focus:ring-yellow-300 focus:outline-none"
					@click.prevent="refreshBranches()">
					Refresh List
				</button>
			</div>
		</div>
		<!-- Corp Branch Field -->
		<div class="relative mt-3">
			<label
				for="user-branch"
				class="generic-input-label"
				>User's Branch</label
			>
			<select
				class="generic-input"
				id="user-branch"
				required
				v-model="corporateBranch">
				<option value="">Select The User's Branch</option>
				<option
					v-for="(branch, index) in corporateBranches"
					:key="index"
					:value="branch.branchId">
					{{ branch.branchName + '-' + branch.branchLocation }}
				</option>
			</select>
			<FormSubmissionLoader
				class="absolute top-[52%] right-7 mr-2 size-5 animate-spin text-gray-500"
				v-if="fetchStatus === 'pending'" />
		</div>
		<div class="mt-3">
			<label class="generic-input-label">Role In Company</label>
			<div class="flex flex-grow">
				<input
					type="text"
					id="role"
					class="generic-input"
					placeholder="Underwriter"
					required
					v-model.trim="companyRole" />
			</div>
		</div>
		<div class="mt-3">
			<label class="generic-input-label">User Privilege</label>
			<div class="flex flex-grow space-x-4">
				<div class="flex w-full items-center justify-between space-x-4">
					<label class="generic-input flex w-1/2 items-center justify-between">
						<span class="text-gray-500">Normal User</span>
						<input
							type="radio"
							value="role_corp_norm"
							class="radio-buttons"
							id="normal"
							name="user-type"
							v-model="userRole" />
					</label>
					<label class="generic-input flex w-1/2 items-center justify-between">
						<span class="text-gray-500">Admin User</span>
						<input
							type="radio"
							value="role_corp_admin"
							class="radio-buttons"
							id="admin"
							name="user-type"
							v-model="userRole" />
					</label>
				</div>
			</div>
		</div>

		<!-- submit button -->
		<button
			type="submit"
			:class="[
				'generic-form-submit laptop:w-1/2 mt-3',
				addNewAccountLoading && 'skeleton skeleton-animated',
			]">
			{{ addNewAccountLoading ? 'Please Wait...' : 'Add New User' }}
		</button>
	</form>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'vehicle-valuation-add-user',
	});

	const firstName: Ref<string> = ref('');
	const otherName: Ref<string> = ref('');
	const email: Ref<string> = ref('');
	const phoneNumber: Ref<string> = ref('');
	const password: Ref<string> = ref('');
	const corporateBranch: Ref<string> = ref('');
	const companyRole: Ref<string> = ref('');
	const userRole: Ref<string> = ref('role_corp_norm');

	const username = computed(() => {
		return `${firstName.value} ${otherName.value}`;
	});

	watch(phoneNumber, (newNumber) => {
		if (newNumber.startsWith('0') || newNumber.startsWith('+254')) {
			phoneNumber.value = newNumber.replace(/^(\+254|0)/, '254');
		}
	});

	const cleanRefs = () => {
		firstName.value = '';
		otherName.value = '';
		email.value = '';
		phoneNumber.value = '';
		password.value = '';
		companyRole.value = '';
	};

	const { addNewAccountLoading, addNewAccount } = useUserAccounts();
	const { fetchStatus, corporateBranches, refreshBranches } = useCorporateBranch();
</script>
