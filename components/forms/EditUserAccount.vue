<template>
	<form
		@submit.prevent="
			updateMyAccountDetails(
				props.userId,
				firstName,
				lastName,
				email,
				phoneNumber,
				roleInOrganization,
				isAccountEnabled,
				corporateBranch,
				[userRole],
			)
		">
		<div class="flex flex-col">
			<label class="generic-input-label">Full Name</label>
			<div
				class="flex w-full flex-col space-y-3 space-x-0 md:flex-row md:space-y-0 md:space-x-4">
				<input
					type="text"
					id="first-name"
					class="generic-input"
					placeholder="John"
					required
					v-model="firstName" />
				<input
					type="text"
					id="other-name"
					class="generic-input"
					placeholder="Doe"
					required
					v-model="lastName" />
			</div>
		</div>
		<div class="mt-3 flex flex-col">
			<label class="generic-input-label">Email</label>
			<div class="flex flex-grow">
				<input
					type="email"
					id="email"
					class="generic-input"
					placeholder="johndoe@corpemail.com"
					required
					v-model="email" />
			</div>
		</div>
		<div class="mt-3 flex flex-col">
			<label class="generic-input-label">Phone Number</label>
			<div class="flex flex-grow">
				<input
					type="text"
					id="phone"
					class="generic-input"
					placeholder="254712345678"
					required
					v-model="phoneNumber" />
			</div>
		</div>
		<!-- <div class="mt-3 flex flex-col">
			<label class="generic-input-label">Password</label>
			<div class="flex flex-grow">
				<input
					type="password"
					id="new-password"
					class="generic-input"
					placeholder="gnarly_squirell@123"
					v-model="password" />
			</div>
		</div> -->
		<div class="mt-3 flex flex-col">
			<label class="generic-input-label">Role In Company</label>
			<div class="flex flex-grow">
				<input
					type="text"
					id="role"
					class="generic-input"
					placeholder="Managing Director"
					required
					v-model="roleInOrganization" />
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
			<label class="generic-input-label">User Privilege</label>
			<div class="flex flex-grow space-x-4">
				<label class="generic-input flex w-1/2 items-center justify-between">
					<span class="text-gray-500">Normal User</span>
					<input
						type="radio"
						value="role_corp_norm"
						class="radio-buttons"
						id="normal"
						v-model="userRole" />
				</label>
				<label class="generic-input flex w-1/2 items-center justify-between">
					<span class="text-gray-500">Admin User</span>
					<input
						type="radio"
						value="role_corp_admin"
						class="radio-buttons"
						id="admin"
						v-model="userRole" />
				</label>
			</div>
		</div>

		<div class="mt-3 flex flex-col">
			<label class="generic-input-label">Account Status</label>
			<div class="flex flex-grow">
				<select
					class="generic-input"
					id="account-status"
					required
					v-model="isAccountEnabled">
					<option :value="false">Not Active</option>
					<option :value="true">Active</option>
				</select>
			</div>
		</div>

		<!-- submit button -->
		<button
			type="submit"
			:class="[
				'generic-form-submit mt-3',
				updateCorporateAccountLoading && 'skeleton skeleton-animated',
			]">
			{{ updateCorporateAccountLoading ? 'Please Wait...' : 'Update' }}
		</button>
	</form>
</template>

<script setup lang="ts">
	const props = defineProps({
		userId: { required: true, type: String },
		username: { required: true, type: String },
		email: { required: true, type: String },
		phoneNumber: { required: true, type: String },
		roleInOrganization: { required: true, type: String },
		branchId: { required: true, type: String },
		isAccountEnabled: { required: true, type: Boolean },
		userRole: { required: true, type: String },
	});

	const { updateMyAccountDetails, updateCorporateAccountLoading } = useUserAccounts();
	const { corporateBranches, fetchStatus } = useCorporateBranch();
	const firstName: Ref<string> = ref(props.username.split(' ')[0]);
	const lastName: Ref<string> = ref(props.username.split(' ')[1]);
	const email: Ref<string> = ref(props.email);
	const phoneNumber: Ref<string> = ref(props.phoneNumber);
	const roleInOrganization: Ref<string> = ref(props.roleInOrganization);
	const userRole: Ref<string> = ref(props.userRole.toLowerCase());
	const isAccountEnabled: Ref<boolean> = ref(props.isAccountEnabled);
	const corporateBranch: Ref<string> = ref(props.branchId);

	watch(phoneNumber, (newNumber) => {
		if (newNumber.startsWith('0') || newNumber.startsWith('+254')) {
			phoneNumber.value = newNumber.replace(/^(\+254|0)/, '254');
		}
	});
</script>
