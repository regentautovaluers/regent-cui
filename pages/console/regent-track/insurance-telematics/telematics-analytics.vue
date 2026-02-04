<template>
	<div class="flex flex-1 flex-col outline-none">
		<!-- the stats -->
		<div
			class="tablet:grid-cols-3 laptop:grid-cols-4 laptop:gap-5 grid h-fit grid-cols-2 gap-3">
			<div
				class="flex h-full items-center justify-center rounded-lg border bg-white p-5 shadow-xs outline-none">
				<div class="flex-grow">
					<h2 class="text-sm text-gray-500">Total Vehicles</h2>
					<h1 class="text-lg font-semibold text-gray-700">
						{{ computedAnalytics!.totalDevices }}
					</h1>
				</div>
				<button
					class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-blue-300 bg-blue-100">
					<span
						class="icon-[material-symbols-light--directions-car-sharp] text-3xl text-blue-600"></span>
				</button>
			</div>
			<div
				class="flex h-full items-center justify-center rounded-lg border bg-white p-5 shadow-xs outline-none">
				<div class="flex-grow">
					<h2 class="text-sm text-gray-500">Average Score</h2>
					<h1 class="text-lg font-semibold text-gray-700">
						{{
							Math.trunc(
								Math.ceil(
									computedAnalytics?.cummAvgDriverScore ??
										0 / computedAnalytics!.totalDevices,
								),
							)
						}}
					</h1>
					<h3 class="text-sm text-gray-500">From Driving Behaviour</h3>
				</div>
				<button
					class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-green-300 bg-green-100">
					<span
						class="icon-[material-symbols-light--show-chart-rounded] text-3xl text-green-600"></span>
				</button>
			</div>
			<div
				class="flex h-full items-center justify-center rounded-lg border bg-white p-5 shadow-xs outline-none">
				<div class="flex-grow">
					<h2 class="text-sm text-gray-500">Good Drivers</h2>
					<h1 class="text-lg font-semibold text-gray-700">
						{{ computedAnalytics!.goodDrivers }}
					</h1>
					<h3 class="text-sm text-gray-500">From Driving Behaviour</h3>
				</div>
				<button
					class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-green-300 bg-green-100">
					<span
						class="icon-[material-symbols-light--thumb-up] text-3xl text-green-600"></span>
				</button>
			</div>
			<div
				class="flex h-full items-center justify-center rounded-lg border bg-white p-5 shadow-xs outline-none">
				<div class="flex-grow">
					<h2 class="text-sm text-gray-500">Total Distance</h2>
					<h1 class="text-lg font-semibold text-gray-700">
						{{ computedAnalytics!.totalDistance }}
					</h1>
					<h3 class="text-sm text-gray-500">As Per Selected Time</h3>
				</div>
				<button
					class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-blue-300 bg-blue-100">
					<span
						class="icon-[material-symbols-light--conversion-path] text-3xl text-blue-600"></span>
				</button>
			</div>
		</div>

		<!-- ending analysis -->
		<div class="laptop:grid-cols-2 laptop:gap-5 mt-6 grid h-fit grid-cols-1 gap-3">
			<div
				class="flex h-full flex-col justify-evenly rounded-lg border bg-white p-5 shadow-sm outline-none">
				<h1 class="font-semibold text-gray-700">Driver Risk Distribution</h1>
				<!-- low risk vehicles -->
				<div class="mt-5 space-y-2">
					<div class="flex items-center justify-between">
						<h1 class="inline-flex items-center space-x-2">
							<div class="size-3 rounded-full bg-green-500"></div>
							<span class="text-sm font-semibold text-gray-700">Low Risk (0-1)</span>
						</h1>
						<h2 class="inline-flex items-center space-x-2">
							<span class="text-sm font-semibold text-green-500">{{
								computedAnalytics!.driverRiskDitribution.lowRisk
							}}</span>
							<span class="text-sm text-gray-500"
								>({{
									(computedAnalytics!.driverRiskDitribution.lowRisk * 100) /
									computedAnalytics!.totalDevices
								}}%)</span
							>
						</h2>
					</div>
					<div class="h-2.5 w-full rounded-full bg-gray-200">
						<div
							class="h-2.5 rounded-full bg-green-500"
							v-bind:style="{
								width: `${
									(computedAnalytics!.driverRiskDitribution.lowRisk * 100) /
									computedAnalytics!.totalDevices
								}%`,
							}"></div>
					</div>
				</div>

				<!-- medium risk vehicles -->
				<div class="mt-5 space-y-2">
					<div class="flex items-center justify-between">
						<h1 class="inline-flex items-center space-x-2">
							<div class="size-3 rounded-full bg-yellow-500"></div>
							<span class="text-sm font-semibold text-gray-700"
								>Medium Risk (2-4)</span
							>
						</h1>
						<h2 class="inline-flex items-center space-x-2">
							<span class="text-sm font-semibold text-yellow-500">{{
								computedAnalytics!.driverRiskDitribution.mediumRisk
							}}</span>
							<span class="text-sm text-gray-500"
								>({{
									(computedAnalytics!.driverRiskDitribution.mediumRisk * 100) /
									computedAnalytics!.totalDevices
								}}%)</span
							>
						</h2>
					</div>
					<div class="h-2.5 w-full rounded-full bg-gray-200">
						<div
							class="h-2.5 rounded-full bg-yellow-500"
							v-bind:style="{
								width: `${
									(computedAnalytics!.driverRiskDitribution.mediumRisk * 100) /
									computedAnalytics!.totalDevices
								}%`,
							}"></div>
					</div>
				</div>

				<!-- high risk vehicles -->
				<div class="mt-5 space-y-2">
					<div class="flex items-center justify-between">
						<h1 class="inline-flex items-center space-x-2">
							<div class="size-3 rounded-full bg-red-500"></div>
							<span class="text-sm font-semibold text-gray-700">High Risk (5+)</span>
						</h1>
						<h2 class="inline-flex items-center space-x-2">
							<span class="text-sm font-semibold text-red-500">{{
								computedAnalytics?.driverRiskDitribution.highRisk
							}}</span>
							<span class="text-sm text-gray-500"
								>({{
									(computedAnalytics!.driverRiskDitribution.highRisk * 100) /
									computedAnalytics!.totalDevices
								}}%)</span
							>
						</h2>
					</div>
					<div class="h-2.5 w-full rounded-full bg-gray-200">
						<div
							class="h-2.5 rounded-full bg-red-500"
							v-bind:style="{
								width: `${
									(computedAnalytics!.driverRiskDitribution.highRisk * 100) /
									computedAnalytics!.totalDevices
								}%`,
							}"></div>
					</div>
				</div>
			</div>

			<!-- stats -->
			<div class="h-fit rounded-lg border bg-white p-5 shadow-sm outline-none">
				<h1 class="font-semibold text-gray-700">Accident Analysis</h1>
				<!-- minor accidents -->
				<div
					class="mt-5 flex h-16 items-center justify-between rounded-lg border border-green-200 bg-green-100 px-5 outline-none">
					<div class="flex h-full items-center space-x-2">
						<span
							class="icon-[material-symbols-light--warning-outline] text-4xl text-green-500"></span>
						<div>
							<h1 class="font-semibold text-green-800">Minor Accidents</h1>
							<h2 class="text-sm text-green-800">
								Vehicles in this category experienced an impact force between 2G and
								4G
							</h2>
						</div>
					</div>
					<h1 class="font-semibold text-green-800">
						{{ computedAnalytics?.accidentsDistribution.minorAccidents }}
					</h1>
				</div>

				<!-- moderate accidents -->
				<div
					class="mt-5 flex h-16 items-center justify-between rounded-lg border border-yellow-200 bg-yellow-100 px-5 outline-none">
					<div class="flex h-full items-center space-x-2">
						<span
							class="icon-[material-symbols-light--warning-outline] text-4xl text-yellow-500"></span>
						<div>
							<h1 class="font-semibold text-yellow-800">Moderate Accidents</h1>
							<h2 class="text-sm text-yellow-800">
								Vehicles in this category experienced an impact force between 4G and
								8G
							</h2>
						</div>
					</div>
					<h1 class="font-semibold text-yellow-800">
						{{ computedAnalytics?.accidentsDistribution.moderateAccidents }}
					</h1>
				</div>

				<!-- severe accidents -->
				<div
					class="mt-5 flex h-16 items-center justify-between rounded-lg border border-red-200 bg-red-100 px-5 outline-none">
					<div class="flex h-full items-center space-x-2">
						<span
							class="icon-[material-symbols-light--warning-outline] text-4xl text-red-500"></span>
						<div>
							<h1 class="font-semibold text-red-800">Severe Accidents</h1>
							<h2 class="text-sm text-red-800">
								Vehicles in this category experienced an impact force greater than
								8G
							</h2>
						</div>
					</div>
					<h1 class="font-semibold text-red-800">
						{{ computedAnalytics?.accidentsDistribution.severeAccidents }}
					</h1>
				</div>
			</div>
		</div>

		<!-- premium impact analysis -->
		<div
			class="mt-6 flex flex-col justify-evenly rounded-lg border bg-white p-5 shadow-sm outline-none">
			<h1 class="mb-4 font-semibold text-gray-700">Driver Risk Distribution</h1>
			<!-- low risk vehicles -->
			<div class="laptop:grid-cols-3 grid grid-cols-1 gap-5">
				<div
					class="flex h-52 flex-col items-center justify-center space-y-1 rounded-lg border border-green-500 bg-green-100 text-green-600">
					<span class="text-3xl font-semibold">{{
						computedAnalytics!.driverRiskDitribution.lowRisk
					}}</span>
					<span class="text-sm font-semibold">Discount Eligible</span>
					<span class="text-sm"
						>Excellent driving score. Eligible for premium discount.</span
					>
				</div>

				<div
					class="flex h-52 flex-col items-center justify-center space-y-1 rounded-lg border border-gray-500 bg-gray-100 text-gray-600">
					<span class="text-3xl font-semibold">{{
						computedAnalytics!.driverRiskDitribution.mediumRisk
					}}</span>
					<span class="text-sm font-semibold">Standard Rate</span>
					<span class="text-sm">No premium adjustment for these vehicles.</span>
				</div>

				<div
					class="flex h-52 flex-col items-center justify-center space-y-1 rounded-lg border border-red-500 bg-red-100 text-red-600">
					<span class="text-3xl font-semibold">{{
						computedAnalytics!.driverRiskDitribution.highRisk
					}}</span>
					<span class="text-sm font-semibold">Premium Increase</span>
					<span class="text-sm"
						>High risk score vehicles. Eligible for premium increase.</span
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: 'insurance-telematics-analytics',
		layout: 'console-layout',
	});

	const { computedAnalytics } = useAnalyzeInsuranceMetrics();
</script>
