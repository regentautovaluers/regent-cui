<template>
	<form
		class="h-fit rounded-lg border px-6 py-2 shadow-sm md:py-6"
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
		<h1 class="text-lg font-semibold">Add New User</h1>
		<div>
			<label class="font-bold text-gray-500">Full Name</label>
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
				class="font-bold text-gray-500"
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
				class="font-bold text-gray-500"
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
			<label class="font-bold text-gray-500">Password</label>
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

		<!-- Corp Branch Field -->
		<div class="relative mt-3">
			<label
				for="user-branch"
				class="font-bold text-gray-500"
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
				classes="mr-2 absolute right-0 top-[52%] right-7 size-5 animate-spin text-gray-500"
				v-if="fetchStatus === 'pending'" />
		</div>
		<div class="mt-3">
			<label class="font-bold text-gray-500">Role In Company</label>
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
			<label class="font-bold text-gray-500">User Privilege</label>
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
			class="generic-form-submit mt-3 w-full lg:w-[49%]">
			<FormSubmissionLoader
				classes="mr-2 size-6 animate-spin text-white"
				v-if="addNewAccountLoading" />
			{{ addNewAccountLoading ? $t('request_processing') : 'Add New User' }}
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
		userRole.value = '';
	};

	const { addNewAccountLoading, addNewAccount } = useAuth();
	const { fetchStatus, corporateBranches } = useCorporateBranch();
</script>
