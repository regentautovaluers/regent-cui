<template>
	<div class="space-y-5">
		<!-- preliminary info -->
		<div class="grid h-fit grid-cols-2 gap-2 rounded-lg bg-gray-200/80 p-4 outline-none">
			<div class="col-span-2">
				<h1 class="font-bold text-gray-700">Vehicle Information</h1>
			</div>
			<div class="flex h-12 items-center space-x-3">
				<h2 class="inline-flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--barcode-scanner] text-xl text-gray-700"></span>
					<span class="text-sm text-gray-500">Registration</span>
				</h2>
				<span class="text-gray-400">&VerticalBar;</span>
				<h3 class="text-sm font-semibold text-gray-700">{{ regNo }}</h3>
			</div>
			<div class="flex h-12 items-center space-x-3">
				<h2 class="inline-flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--settings-phone] text-xl text-gray-700"></span>
					<span class="text-sm text-gray-500">Phone</span>
				</h2>
				<span class="text-gray-400">&VerticalBar;</span>
				<h3 class="text-sm font-semibold text-gray-700">{{ clientPhone }}</h3>
			</div>
			<div class="flex h-12 items-center space-x-3">
				<h2 class="inline-flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--person] text-xl text-gray-700"></span>
					<span class="text-sm text-gray-500">Client Name</span>
				</h2>
				<span class="text-gray-400">&VerticalBar;</span>
				<h3 class="text-sm font-semibold text-gray-700">{{ clientName }}</h3>
			</div>
			<div class="flex h-12 items-center space-x-3">
				<h2 class="inline-flex items-center space-x-1">
					<span
						class="icon-[material-symbols-light--show-chart] text-xl text-gray-700"></span>
					<span class="text-sm text-gray-500">Overall Score</span>
				</h2>
				<span class="text-gray-400">&VerticalBar;</span>
				<h3 class="text-sm font-semibold text-gray-700">
					<span
						:class="[
							'text-sm font-semibold',
							!driverRiskScore && 'text-gray-500',
							driverRiskScore?.averageScore! > 5 && 'text-red-500',
							driverRiskScore?.averageScore! >= 2 &&
								driverRiskScore?.averageScore! <= 4 &&
								'text-yellow-500',
							driverRiskScore?.averageScore! < 2 && 'text-green-500',
						]">
						{{ driverRiskScore?.averageScore ?? '-' }} :
						{{ driverRiskScore?.averageRiskLevel ?? '-' }}</span
					>
				</h3>
			</div>
		</div>

		<!-- detailed analysis -->
		<div class="h-fit rounded-lg">
			<div class="mb-2">
				<h1 class="font-bold text-gray-700">Detailed Analysis</h1>
			</div>

			<!-- detailed analysis -->
			<div class="tablet:grid-cols-2 laptop:gap-5 grid grid-cols-1 gap-4">
				<!--harsh acceleration analysis  -->
				<div class="h-[10rem] rounded-lg border-2 p-4 outline-none">
					<h1 class="mb-2 text-sm font-semibold text-gray-700">Harsh Accel. Analysis</h1>
					<div class="grid grid-cols-[40%_60%] gap-2">
						<div class="border-r border-r-gray-400">
							<h1 class="text-sm text-gray-500">Score (Per 100 Km)</h1>
						</div>
						<div class="w-full text-end">
							<span
								:class="[
									'text-sm font-semibold',
									!driverRiskScore && 'text-gray-500',
									driverRiskScore?.harshAccelerationScore?.percentageScore! > 5 &&
										'text-red-500',
									driverRiskScore?.harshAccelerationScore?.percentageScore! >=
										2 &&
										driverRiskScore?.harshAccelerationScore?.percentageScore! <=
											4 &&
										'text-yellow-500',
									driverRiskScore?.harshAccelerationScore?.percentageScore! < 2 &&
										'text-green-500',
								]"
								>{{
									driverRiskScore?.harshAccelerationScore?.percentageScore ?? '-'
								}}</span
							>
						</div>
						<div class="border-r border-r-gray-400">
							<h1 class="text-sm text-gray-500">Number of Incidents</h1>
						</div>
						<div class="w-full text-end">
							<span class="text-sm font-semibold text-gray-500">{{
								driverRiskScore?.harshAccelerationScore?.rawScore ?? '-'
							}}</span>
						</div>
						<div class="border-r border-r-gray-400">
							<h1 class="text-sm text-gray-500">Risk Rating</h1>
						</div>
						<div class="w-full text-end">
							<span
								:class="[
									'text-sm font-semibold',
									!driverRiskScore && 'text-gray-500',
									driverRiskScore?.harshAccelerationScore?.percentageScore! > 5 &&
										'text-red-500',
									driverRiskScore?.harshAccelerationScore?.percentageScore! >=
										2 &&
										driverRiskScore?.harshAccelerationScore?.percentageScore! <=
											4 &&
										'text-yellow-500',
									driverRiskScore?.harshAccelerationScore?.percentageScore! < 2 &&
										'text-green-500',
								]"
								>{{
									driverRiskScore?.harshAccelerationScore?.riskLevel ?? '-'
								}}</span
							>
						</div>
					</div>
				</div>

				<!--harsh braking analysis  -->
				<div class="h-[10rem] rounded-lg border-2 p-4 outline-none">
					<h1 class="mb-2 text-sm font-semibold text-gray-700">Harsh Braking Analysis</h1>
					<div class="grid grid-cols-[40%_60%] gap-2">
						<div class="border-r border-r-gray-400">
							<h1 class="text-sm text-gray-500">Score (Per 100 Km)</h1>
						</div>
						<div class="w-full text-end">
							<span
								:class="[
									'text-sm font-semibold',
									!driverRiskScore && 'text-gray-500',
									driverRiskScore?.brakingScore?.percentageScore! > 5 &&
										'text-red-500',
									driverRiskScore?.brakingScore?.percentageScore! >= 2 &&
										driverRiskScore?.brakingScore?.percentageScore! <= 4 &&
										'text-yellow-500',
									driverRiskScore?.brakingScore?.percentageScore! < 2 &&
										'text-green-500',
								]"
								>{{ driverRiskScore?.brakingScore?.percentageScore ?? '-' }}</span
							>
						</div>
						<div class="border-r border-r-gray-400">
							<h1 class="text-sm text-gray-500">Number of Incidents</h1>
						</div>
						<div class="w-full text-end">
							<span class="text-sm font-semibold text-gray-500">{{
								driverRiskScore?.brakingScore?.rawScore ?? '-'
							}}</span>
						</div>
						<div class="border-r border-r-gray-400">
							<h1 class="text-sm text-gray-500">Risk Rating</h1>
						</div>
						<div class="w-full text-end">
							<span
								:class="[
									'text-sm font-semibold',
									!driverRiskScore && 'text-gray-500',
									driverRiskScore?.brakingScore?.percentageScore! > 5 &&
										'text-red-500',
									driverRiskScore?.brakingScore?.percentageScore! >= 2 &&
										driverRiskScore?.brakingScore?.percentageScore! <= 4 &&
										'text-yellow-500',
									driverRiskScore?.brakingScore?.percentageScore! < 2 &&
										'text-green-500',
								]"
								>{{ driverRiskScore?.brakingScore?.riskLevel ?? '-' }}</span
							>
						</div>
					</div>
				</div>

				<!--harsh cornering analysis  -->
				<div class="h-[10rem] rounded-lg border-2 p-4 outline-none">
					<h1 class="mb-2 text-sm font-semibold text-gray-700">
						Harsh Cornering Analysis
					</h1>
					<div class="grid grid-cols-[40%_60%] gap-2">
						<div class="border-r border-r-gray-400">
							<h1 class="text-sm text-gray-500">Score (Per 100 Km)</h1>
						</div>
						<div class="w-full text-end">
							<span
								:class="[
									'text-sm font-semibold',
									!driverRiskScore && 'text-gray-500',
									driverRiskScore?.harshCornering?.percentageScore! > 5 &&
										'text-red-500',
									driverRiskScore?.harshCornering?.percentageScore! >= 2 &&
										driverRiskScore?.harshCornering?.percentageScore! <= 4 &&
										'text-yellow-500',
									driverRiskScore?.harshCornering?.percentageScore! < 2 &&
										'text-green-500',
								]"
								>{{ driverRiskScore?.harshCornering?.percentageScore ?? '-' }}</span
							>
						</div>
						<div class="border-r border-r-gray-400">
							<h1 class="text-sm text-gray-500">Number of Incidents</h1>
						</div>
						<div class="w-full text-end">
							<span class="text-sm font-semibold text-gray-500">{{
								driverRiskScore?.harshCornering?.rawScore ?? '-'
							}}</span>
						</div>
						<div class="border-r border-r-gray-400">
							<h1 class="text-sm text-gray-500">Risk Rating</h1>
						</div>
						<div class="w-full text-end">
							<span
								:class="[
									'text-sm font-semibold',
									!driverRiskScore && 'text-gray-500',
									driverRiskScore?.harshCornering?.percentageScore! > 5 &&
										'text-red-500',
									driverRiskScore?.harshCornering?.percentageScore! >= 2 &&
										driverRiskScore?.harshCornering?.percentageScore! <= 4 &&
										'text-yellow-500',
									driverRiskScore?.harshCornering?.percentageScore! < 2 &&
										'text-green-500',
								]"
								>{{ driverRiskScore?.harshCornering?.riskLevel ?? '-' }}</span
							>
						</div>
					</div>
				</div>

				<!--risk assessment  -->
				<div class="h-[10rem] rounded-lg border-2 p-4 outline-none">
					<h1 class="mb-2 text-sm font-semibold text-gray-700">Risk Assessment</h1>
					<div class="grid grid-cols-[40%_60%] gap-2">
						<div class="border-r border-r-gray-400">
							<h1 class="text-sm text-gray-500">Overall Score</h1>
						</div>
						<div class="w-full text-end">
							<span
								:class="[
									'text-sm font-semibold',
									!driverRiskScore && 'text-gray-500',
									driverRiskScore?.averageScore! > 5 && 'text-red-500',
									driverRiskScore?.averageScore! >= 2 &&
										driverRiskScore?.averageScore! <= 4 &&
										'text-yellow-500',
									driverRiskScore?.averageScore! < 2 && 'text-green-500',
								]"
								>{{ driverRiskScore?.averageScore ?? '-' }}</span
							>
						</div>
						<div class="border-r border-r-gray-400">
							<h1 class="text-sm text-gray-500">Risk Rating</h1>
						</div>
						<div class="w-full text-end">
							<span
								:class="[
									'text-sm font-semibold',
									!driverRiskScore && 'text-gray-500',
									driverRiskScore?.averageScore! > 5 && 'text-red-500',
									driverRiskScore?.averageScore! >= 2 &&
										driverRiskScore?.averageScore! <= 4 &&
										'text-yellow-500',
									driverRiskScore?.averageScore! < 2 && 'text-green-500',
								]"
								>{{ driverRiskScore?.averageRiskLevel ?? '-' }}</span
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { type DriverRiskScore } from '~/types/insurance-telematics/driver-behaviour';

	const { id, regNo, clientPhone, clientName, driverRiskScore } = defineProps<{
		id: number;
		regNo: String;
		clientPhone: String;
		clientName: String;

		driverRiskScore?: DriverRiskScore;
	}>();
</script>
