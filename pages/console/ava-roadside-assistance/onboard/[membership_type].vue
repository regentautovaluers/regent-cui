<template>
	<!-- new UI -->
	<div class="console-layout-spacing">
		<!-- links strip -->
		<div
			class="hide-scrollbar mb-5 h-fit space-x-4 divide-y-2 overflow-x-scroll rounded-lg border-2 bg-white whitespace-nowrap">
			<div class="inline-flex h-28 w-full items-center justify-between p-5 outline-none">
				<div class="flex h-full items-center space-x-3">
					<button
						class="inline-flex h-[70%] w-[50px] items-center justify-center rounded-lg bg-blue-600 outline-none">
						<span
							class="icon-[material-symbols-light--add-2] text-4xl text-slate-100"></span>
					</button>
					<div>
						<h1 class="text-xl font-semibold text-gray-800">Onboard AVA Members</h1>
						<h2 class="text-sm text-gray-500">
							Create Accounts for New Members, Individually or In Bulk.
						</h2>
					</div>
				</div>
			</div>
			<div
				class="hide-scrollbar h-16 space-x-10 overflow-x-scroll px-5 pt-5 whitespace-nowrap">
				<button
					class="relative inline-flex items-end space-x-2"
					@click="activeRegistrationForm = 0">
					<span
						:class="[
							'size-6 icon-[material-symbols-light--account-box-sharp]',
							activeRegistrationForm == 0 ? 'text-blue-600' : 'text-gray-500',
						]"></span>
					<span
						:class="[
							activeRegistrationForm == 0
								? 'font-semibold text-blue-600 after:absolute after:-bottom-[21px] after:left-0 after:h-[5px] after:w-full after:rounded-full after:bg-blue-600'
								: 'text-gray-500',
						]">
						Individual Registration
					</span>
				</button>

				<button
					class="relative inline-flex items-end space-x-2"
					@click="activeRegistrationForm = 1">
					<span
						:class="[
							'icon-[material-symbols-light--supervisor-account-rounded] size-6',
							activeRegistrationForm == 1 ? 'text-blue-600' : 'text-gray-500',
						]"></span>
					<span
						:class="[
							activeRegistrationForm == 1
								? 'font-semibold text-blue-600 after:absolute after:-bottom-[21px] after:left-0 after:h-[5px] after:w-full after:rounded-full after:bg-blue-600'
								: 'text-gray-500',
						]">
						Bulk Registration
					</span>
				</button>
			</div>
		</div>
		<div class="tablet:p-5 rounded-lg border-2 bg-white p-2 whitespace-nowrap">
			<IndividualMembershipReg v-if="activeRegistrationForm === 0" />
			<BulkMembershipReg v-else-if="activeRegistrationForm === 1" />
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'ava-membership-onboard',
		layout: 'console-layout',
	});

	const activeRegistrationForm = ref(0);
</script>
