<template>
	<form
		class="laptop:p-4 laptop-lg:p-8 h-full flex-1 p-2"
		@submit.prevent="
			updateMyAccountDetails(
				getPrincipal.userId,
				firstName,
				lastName,
				email,
				phoneNumber,
				roleInOrganization,
				true,
				getPrincipal.branchId,
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
					disabled
					v-model="roleInOrganization" />
			</div>
		</div>

		<!-- submit button -->
		<button
			type="submit"
			:class="[
				'generic-form-submit laptop:w-1/2 mt-3',
				updateCorporateAccountLoading && 'skeleton skeleton-animated',
			]">
			{{ updateCorporateAccountLoading ? 'Please Wait...' : 'Save Changes' }}
		</button>
	</form>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'settings-my-account',
		layout: 'console-layout',
	});

	const { getPrincipal } = useAuth();
	const { updateMyAccountDetails, updateCorporateAccountLoading } = useUserAccounts();
	const firstName: Ref<string> = ref(getPrincipal.value.username.split(' ')[0]);
	const lastName: Ref<string> = ref(getPrincipal.value.username.split(' ')[1]);
	const email: Ref<string> = ref(getPrincipal.value.email);
	const phoneNumber: Ref<string> = ref(getPrincipal.value.phonenumber);
	const roleInOrganization: Ref<string> = ref(getPrincipal.value.roleInOrganization);

	watch(phoneNumber, (newNumber) => {
		if (newNumber.startsWith('0') || newNumber.startsWith('+254')) {
			phoneNumber.value = newNumber.replace(/^(\+254|0)/, '254');
		}
	});
</script>
