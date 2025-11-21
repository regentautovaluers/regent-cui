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
	const { fetchStatus, corporateBranches } = useCorporateBranch();
</script>
