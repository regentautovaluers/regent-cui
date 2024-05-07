<template>
	<tr class="hover:shadow-lg">
		<td class="px-6 py-6 whitespace-nowrap font-semibold text-pink-600">
			{{ componentProps.nameOfUser }}
		</td>
		<td class="px-6 py-6 whitespace-nowrap text-gray-600 font-semibold">
			{{ componentProps.username }}
		</td>
		<td class="px-6 py-6 whitespace-nowrap text-gray-600 font-semibold">
			{{ componentProps.userLevel }}
		</td>
		<td
			class="px-6 py-6 whitespace-nowrap text-center font-semibold text-blue-500">
			{{ componentProps.isActive }}
		</td>
		<td
			class="px-6 py-6 whitespace-nowrap text-end font-semibold text-green-500">
			{{ componentProps.accCreationDate }}
		</td>
		<td
			class="px-6 py-6 whitespace-nowrap text-ellipsis overflow-hidden text-end font-semibold text-pink-500">
			{{ componentProps.accCreatedBy }}
		</td>
		<td>
			<div
				class="relative inline-block text-left"
				ref="dropdownContainer">
				<button @click="toggleDropdown">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1.8em"
						height="1.8em"
						viewBox="0 0 24 24">
						<path
							fill="currentColor"
							fill-rule="evenodd"
							d="M10.5 5A1.5 1.5 0 0 1 12 3.5h.01a1.5 1.5 0 0 1 1.5 1.5v.01a1.5 1.5 0 0 1-1.5 1.5H12a1.5 1.5 0 0 1-1.5-1.5zm0 7a1.5 1.5 0 0 1 1.5-1.5h.01a1.5 1.5 0 0 1 1.5 1.5v.01a1.5 1.5 0 0 1-1.5 1.5H12a1.5 1.5 0 0 1-1.5-1.5zm1.5 5.5a1.5 1.5 0 0 0-1.5 1.5v.01a1.5 1.5 0 0 0 1.5 1.5h.01a1.5 1.5 0 0 0 1.5-1.5V19a1.5 1.5 0 0 0-1.5-1.5z"
							clip-rule="evenodd" />
					</svg>
				</button>
				<div
					v-if="isDropdownVisible"
					@click.stop
					class="custom-dropdown -top-[80%]">
					<div
						class="py-1 space-y-1"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="options-menu">
						<NuxtLink
							:to="{
								name: 'valuation-update-user-details',
								query: {
									'corpuid': componentProps.corpUserId,
								},
							}"
							class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
							Update Account Details
						</NuxtLink>
						<button
							v-if="componentProps.isActive === 'y'"
							class="w-full flex justify-between items-center gap-x-3.5 py-2 px-3 rounded-lg bg-red-500 hover:bg-red-600 focus:outline-none text-white"
							@click="
								deactivateAccount(
									componentProps.corpUserId,
									componentProps.corp
								)
							">
							<span>Deactivate Account</span>
							<div
								v-if="deActivateAccountLoading"
								class="animate-spin inline-block size-5 border-[3px] border-white border-current border-t-transparent text-gray-800 rounded-full"
								role="status"
								aria-label="loading" />
						</button>
						<button
							v-if="componentProps.isActive === 'n'"
							class="w-full flex justify-between items-center gap-x-3.5 py-2 px-3 rounded-lg bg-green-500 hover:bg-green-600 focus:outline-none text-white"
							@click="
								activateAccount(
									componentProps.corpUserId,
									componentProps.corp
								)
							">
							<span>Activate Account</span>
							<div
								v-if="activateAccountLoading"
								class="animate-spin inline-block size-5 border-[3px] border-white border-current border-t-transparent text-gray-800 rounded-full"
								role="status"
								aria-label="loading" />
						</button>
					</div>
				</div>
			</div>
		</td>
	</tr>
</template>

<script setup lang="ts">
	const componentProps = defineProps<{
		corpUserId: string;
		corp: string;
		nameOfUser: string;
		username: string;
		userLevel: string;
		isActive: string;
		accCreationDate: string;
		accCreatedBy: string;
	}>();

	const isDropdownVisible = ref(false);
	const dropdownContainer = ref(null);
	const activateAccountLoading: Ref<boolean> = ref(false);
	const deActivateAccountLoading: Ref<boolean> = ref(false);
	const { openToast } = useToast();
	const runtimeConfig = useRuntimeConfig();

	function toggleDropdown() {
		isDropdownVisible.value = !isDropdownVisible.value;
	}

	function closeDropdown() {
		isDropdownVisible.value = false;
	}

	function handleClickOutside(event: MouseEvent) {
		if (!event.target) return;
		// Check if the click is outside the dropdown container
		if (!dropdownContainer.value.contains(event.target as Node)) {
			closeDropdown();
		}
	}

	async function deactivateAccount(
		corpUID: string,
		corpName: string
	): Promise<void> {
		deActivateAccountLoading.value = true;
		try {
			await $fetch("/ava/api/corp-users/deactivate", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				query: {
					uname: runtimeConfig.app.VALUATION_BASE_UNAME,
					pwd: runtimeConfig.app.VALUATION_BASE_PASS,
					corp: corpName,
					corp_user_id: corpUID,
				},
				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error("Failed to deactivate user account!");
					}

					openToast("Account deactivation successfull", "success");
				},
			});
		} catch (error) {
			console.log("An error occured: ", error);
			openToast("Failed to deactivate account. Try again!", "danger");
		} finally {
			deActivateAccountLoading.value = false;
		}
	}

	async function activateAccount(
		corpUID: string,
		corpName: string
	): Promise<void> {
		activateAccountLoading.value = true;
		try {
			await $fetch("/ava/api/corp-users/activate", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				query: {
					uname: runtimeConfig.app.VALUATION_BASE_UNAME,
					pwd: runtimeConfig.app.VALUATION_BASE_PASS,
					corp: corpName,
					corp_user_id: corpUID,
				},
				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error("Failed to activate user account!");
					}

					openToast("Account activation successfull", "success");
				},
			});
		} catch (error) {
			console.log("An error occured: ", error);
			openToast("Failed to activate account. Try again!", "danger");
		} finally {
			activateAccountLoading.value = false;
		}
	}

	onMounted(() => {
		document.addEventListener("click", handleClickOutside);
	});

	onBeforeUnmount(() => {
		document.removeEventListener("click", handleClickOutside);
	});
</script>
