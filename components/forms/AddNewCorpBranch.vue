<template>
	<form @submit.prevent="createUserAccount">
		<div class="flex flex-col">
			<label class="font-bold text-gray-500">Branch Name</label>
			<div class="flex flex-grow">
				<input
					type="text"
					id="branch-name"
					class="generic-input"
					placeholder="My Corpoprate Branch"
					required
					v-model.trim="branchName" />
			</div>
		</div>
		<div class="mt-3 flex flex-col">
			<label class="font-bold text-gray-500">Branch Location</label>
			<div class="flex flex-grow">
				<input
					type="text"
					id="branch-location"
					class="generic-input"
					placeholder="Nairobi, Kenya"
					required
					v-model.trim="branchLocation" />
			</div>
		</div>
		<div class="mt-4 flex w-full items-center justify-center lg:w-1/3">
			<button
				type="submit"
				class="form-submit relative overflow-clip"
				:disabled="formSubmissionLoading">
				<LoadingIndicator
					v-if="formSubmissionLoading"
					inject-classes="absolute w-[100%] mt-0 -top-1" />
				<span v-if="formSubmissionLoading">Processing...</span>
				<span v-else>Add Branch</span>
			</button>
		</div>
	</form>
</template>

<script setup lang="ts">
	const formSubmissionLoading = ref(false);
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const { openToast } = useToast();
	const branchName: Ref<string> = ref('');
	const branchLocation: Ref<string> = ref('');
	const emits = defineEmits(['refresh-branches']);

	const cleanRefs = () => {
		branchName.value = '';
		branchLocation.value = '';
	};

	const createUserAccount = async (): Promise<void> => {
		formSubmissionLoading.value = true;
		try {
			await $fetch('/api/v1/auth/corp-branch/add', {
				baseURL: runtimeConfig.public.VALUATION_BASE_URL,
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					branchName: branchName.value,
					branchLocation: branchLocation.value,
					corpId: getPrincipal.value.corpId,
					recordedBy: getPrincipal.value.userId,
				}),
				onResponse({ response }) {
					if (response.status === 200) {
						openToast('Branch added successfully!', 'success');
						emits('refresh-branches');
					} else {
						throw new Error('Branch creation failed. Try again!');
					}
					cleanRefs();
				},
			});
		} catch (error) {
			console.log('An error occured: ', error);
			openToast('Branch creation failed. Try again!', 'danger');
		} finally {
			formSubmissionLoading.value = false;
		}
	};
</script>
