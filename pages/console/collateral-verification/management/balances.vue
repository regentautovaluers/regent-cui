<template>
	<div>
		<div
			class="laptop:flex-row laptop:space-y-0 laptop:space-x-4 mb-4 flex h-52 flex-col space-y-4">
			<div
				class="laptop:w-1/2 flex w-full flex-col items-center justify-center space-y-4 rounded-md border-[1px] p-4 text-gray-500 shadow-sm ring-gray-400 transition-all duration-150 outline-none hover:ring-2">
				<span class="text-7xl">{{
					getCollateralVerificationTokenInfo?.balance ?? 'N/A'
				}}</span
				><span class="text-sm">Tokens Left</span>
			</div>
			<div
				class="laptop:w-1/2 flex w-full flex-col items-center justify-center rounded-md border-[1px] p-4 shadow-sm ring-gray-400 transition-all duration-150 outline-none hover:ring-2">
				top up
			</div>
		</div>
		<div></div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'collateral-verification-manage-balances',
		layout: 'console-layout',
	});

	const { getCollateralVerificationTokenInfo } = useCollateralVerificationTokensManagement();
</script>
