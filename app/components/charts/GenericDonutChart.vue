<template>
	<div :class="['relative', title && 'space-y-3']">
		<h3
			class="font-semibold text-gray-700"
			v-if="title">
			{{ title }}
		</h3>
		<DonutChart
			:data="data.map((i) => derivePercentage(i.value, totalInput))"
			:height="height ?? 200"
			:radius="radius ?? 0"
			:categories="categories"
			:hide-legend="hideLegend ?? false"
			:type="DonutType.Full"
			:pad-angle="0"
			:arc-width="innerHoleWidth ?? 0">
			<template #tooltip="{ values }">
				<div class="text-default flex items-center gap-2 p-2">
					<div
						class="size-3 rounded-full"
						:style="{
							backgroundColor: getCategoryColor(values?.label),
						}" />
					<span class="text-dimmed mr-1">
						{{ values?.label }}
					</span>
					{{ values ? values[values?.label] : '' }}
				</div>
			</template>
		</DonutChart>
	</div>
</template>

<script setup lang="ts">
	interface Props {
		data: {
			name: string;
			value: number;
		}[];
		hideLegend?: boolean;
		height?: number;
		radius?: number;
		innerHoleWidth?: number;
		title?: string;
	}

	interface BulletLegendItemInterface {
		name: string;
		color: string;
	}

	const tailwindColors = [
		'indigo-600',
		'purple-600',
		'pink-600',
		'rose-600',
		'emerald-600',
		'blue-600',
		'amber-600',
		'cyan-600',
	];

	const props = defineProps<Props>();
	const totalInput: ComputedRef<number> = computed(() =>
		props.data.map((e) => e.value).reduce((cumm, curr) => cumm + curr, 0),
	);
	const categories = computed(() => {
		return props.data.reduce(
			(acc, item, index) => {
				acc[item.name] = {
					name: item.name,
					// Assign color based on the index to ensure consistency
					color: `var(--color-${tailwindColors[index % tailwindColors.length]})`,
				};
				return acc;
			},
			{} as Record<string, BulletLegendItemInterface>,
		);
	});

	function derivePercentage(x: number, total: number): number {
		return (x * 100) / total;
	}

	function getCategoryColor(label: string): string | undefined {
		const ct = unref(categories);
		return Object.values(ct).find((e) => e.name == label)?.color;
	}
</script>
