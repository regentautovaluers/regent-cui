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
			<label class="font-bold text-gray-500">Full Name</label>
			<div
				class="flex w-full flex-col space-x-0 space-y-3 md:flex-row md:space-x-4 md:space-y-0">
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
			<label class="font-bold text-gray-500">Email</label>
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
			<label class="font-bold text-gray-500">Phone Number</label>
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
			<label class="font-bold text-gray-500">Password</label>
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
			<label class="font-bold text-gray-500">Role In Company</label>
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
		<div class="mt-3">
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
					v-for="(branch, index) in availableBranches"
					:key="index"
					:value="branch.branchId">
					{{ branch.branchName + '-' + branch.branchLocation }}
				</option>
			</select>
		</div>
		<div class="mt-3">
			<label class="font-bold text-gray-500">User Privilege</label>
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
			<label class="font-bold text-gray-500">Account Status</label>
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
			class="generic-form-submit mt-3">
			<FormSubmissionLoader
				classes="mr-2 size-6 animate-spin text-white"
				v-if="updateCorporateAccountLoading" />
			{{ updateCorporateAccountLoading ? $t('request_processing') : 'Update' }}
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

	const { updateMyAccountDetails, updateCorporateAccountLoading } = useAuth();
	const firstName: Ref<string> = ref(props.username.split(' ')[0]);
	const lastName: Ref<string> = ref(props.username.split(' ')[1]);
	const email: Ref<string> = ref(props.email);
	const phoneNumber: Ref<string> = ref(props.phoneNumber);
	const roleInOrganization: Ref<string> = ref(props.roleInOrganization);
	const userRole: Ref<string> = ref(props.userRole.toLowerCase());
	const isAccountEnabled: Ref<boolean> = ref(props.isAccountEnabled);
	const corporateBranch: Ref<string> = ref(props.branchId);
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const availableBranches: Ref<any[]> = ref([]);
	// const password: Ref<string> = ref('');

	watch(phoneNumber, (newNumber) => {
		if (newNumber.startsWith('0') || newNumber.startsWith('+254')) {
			phoneNumber.value = newNumber.replace(/^(\+254|0)/, '254');
		}
	});

	const { refresh: refreshBranches } = useFetch('/api/v1/auth/corp-branch/get-all', {
		baseURL: runtimeConfig.public.VALUATION_BASE_URL,
		method: 'GET',
		headers: {
			Accept: 'application/json',
		},
		server: false,
		lazy: true,
		query: {
			corpId: getPrincipal.value.corpId,
		},
		onResponse({ response }) {
			if (response.status === 200) {
				availableBranches.value = response._data.data;
			}
		},

		onRequestError() {
			// openToast('Failed to retrieve branches. Try again!', 'danger');
		},
	});
</script>
