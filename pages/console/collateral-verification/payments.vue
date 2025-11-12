<template>
	<!-- new UI -->
	<div
		class="laptop:p-4 laptop-lg:p-8 flex flex-1 flex-col rounded-lg border-2 bg-white p-2 outline-none">
		<!-- links strip -->
		<div class="flex border-b py-5">
			<NuxtLink
				v-for="(e, idx) in routeEntries.filter((re) => re.shouldShow)"
				:key="idx"
				:to="{ name: e.to }"
				class="relative w-1/2 text-center text-sm">
				<span
					:class="[
						doesRouteNameMatch(e.to)
							? 'font-semibold text-blue-600 after:absolute after:-bottom-[22px] after:left-0 after:h-[2.5px] after:w-full after:bg-blue-600'
							: 'text-gray-500',
					]">
					{{ e.name }}
				</span>
			</NuxtLink>
		</div>
		<NuxtPage />
	</div>
</template>
<script setup lang="ts">
	const { doesRouteNameMatch, doesRoutePathInclude } = useNavigationRoutes();

	definePageMeta({
		layout: 'console-layout',
	});

	const routeEntries = [
		{
			to: 'collateral-verification-payments-invoices',
			name: 'Invoices',
			shouldShow: true,
		},
		{
			to: 'collateral-verification-payments-regular',
			name: 'Payment History',
			shouldShow: true,
		},
	];
</script>
