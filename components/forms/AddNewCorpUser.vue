<template>
	<form
		class="rounded-2xl shadow px-6 py-6 border"
		@submit.prevent="createUserAccount">
		<h1 class="font-semibold text-lg my-b">Add A New User</h1>
		<div class="flex flex-col">
			<label class="font-bold text-gray-500">Full Name</label>
			<div class="flex w-full space-x-4">
				<input
					type="text"
					id="first-name"
					class="generic-input"
					placeholder="John"
					required
					v-model.trim="firstName" />
				<input
					type="text"
					id="other-name"
					class="generic-input"
					placeholder="Doe"
					required
					v-model.trim="otherName" />
			</div>
		</div>
		<div class="flex flex-col mt-3">
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
		<div class="flex flex-col mt-3">
			<label class="font-bold text-gray-500">Phone Number</label>
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
		<div class="flex flex-col mt-3">
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
		<div class="flex flex-col mt-3">
			<label
				for="user-branch"
				class="font-bold text-gray-500"
				>User's Branch</label
			>
			<select
				class="generic-input"
				id="user-branch"
				required
				v-model="companyBranch">
				<option value="">Select The User's Branch</option>
				<option
					v-for="(branch, index) in availableBranches"
					:key="index"
					:value="branch.branchId">
					{{ branch.branchName + '-' + branch.branchLocation }}
				</option>
			</select>
			<ActionTriggeredModal
				modal-title="Add Branch"
				:trigger-button-index="1"
				trigger-button-text="Missing Branch?">
				<template #activeElement>
					<AddNewCorpBranch @refresh-branches="refreshBranches" />
				</template>
			</ActionTriggeredModal>
		</div>
		<div class="flex flex-col mt-3">
			<label class="font-bold text-gray-500">Role In Company</label>
			<div class="flex flex-grow">
				<input
					type="text"
					id="role"
					class="generic-input"
					placeholder="Underwriter"
					required
					v-model.trim.lazy="companyRole" />
			</div>
		</div>
		<div class="flex flex-col mt-3">
			<label class="font-bold text-gray-500">User Privilege</label>
			<div class="flex flex-grow space-x-4">
				<label class="generic-input flex items-center w-1/2">
					<span class="text-gray-500"> Is A Normal User </span>
					<input
						type="radio"
						value="role_corp_norm"
						class="radio-buttons"
						id="normal"
						checked
						v-model="userRole" />
				</label>
				<label class="generic-input flex items-center w-1/2">
					<span class="text-gray-500"> Is An Admin </span>
					<input
						type="radio"
						value="role_corp_admin"
						class="radio-buttons"
						id="admin"
						v-model="userRole" />
				</label>
			</div>
		</div>
		<div class="mt-3">
			<button
				type="submit"
				class="form-submit md:w-1/3 relative overflow-clip"
				:disabled="formSubmissionLoading">
				<LoadingIndicator
					v-if="formSubmissionLoading"
					inject-classes="absolute w-[100%] mt-0 -top-1" />
				<span v-if="formSubmissionLoading">Processing...</span>
				<span v-else>Create Account</span>
			</button>
		</div>
	</form>
</template>

<script setup lang="ts">
	const formSubmissionLoading = ref(false);
	const { getPrincipal } = useAuth();
	const availableBranches: Ref<any[]> = ref([]);
	const firstName: Ref<string> = ref('');
	const otherName: Ref<string> = ref('');
	const email: Ref<string> = ref('');
	const phoneNumber: Ref<string> = ref('');
	const password: Ref<string> = ref('');
	const companyBranch: Ref<string> = ref('');
	const companyRole: Ref<string> = ref('');
	const userRole: Ref<string> = ref('');
	const runtimeConfig = useRuntimeConfig();
	const { openToast } = useToast();

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

	const createUserAccount = async (): Promise<void> => {
		formSubmissionLoading.value = true;
		try {
			await $fetch('/api/v1/auth/corp-account/signup', {
				baseURL: runtimeConfig.public.VALUATION_BASE_URL,
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					firstName: firstName.value,
					lastName: otherName.value,
					email: email.value,
					phoneNumber: phoneNumber.value,
					password: password.value,
					profilePicture: null,
					corporateId: getPrincipal.value.corpId,
					roleInOrganization: companyRole.value,
					userRoles: [userRole.value],
				}),
				onResponse({ response }) {
					if (response.status === 200) {
						openToast('Account creation successfull!', 'success');
					} else {
						throw new Error('Account creation failed. Try again!');
					}
					cleanRefs();
				},
			});
		} catch (error) {
			console.log('An error occured: ', error);
			openToast('Account creation failed. Try again!', 'danger');
		} finally {
			formSubmissionLoading.value = false;
		}
	};

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
			openToast('Failed to retrieve branches. Try again!', 'danger');
		},
	});
</script>
