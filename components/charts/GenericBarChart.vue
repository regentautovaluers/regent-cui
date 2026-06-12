<template>
	<div :class="[title && 'space-y-3']">
		<h3
			class="font-semibold text-gray-700"
			v-if="title">
			{{ title }}
		</h3>
		<BarChart
			:data="data"
			:height="height ?? 300"
			:categories="computedCategories"
			:y-axis="computedYAxisKeys"
			:y-label="yAxisLabel"
			:x-label="xAxisLabel"
			:group-padding="0"
			:bar-padding="barGroupsPadding ?? 0.2"
			:x-num-ticks="ticksOnXAxis ?? 3"
			:radius="barRadius ?? 4"
			:x-formatter="computedXFormatter"
			:y-formatter="yFormatter"
			:legend-position="LegendPosition.TopRight"
			:hide-legend="hideLegend ?? true"
			:y-grid-line="showHorizontalGridLines ?? true" />
	</div>
</template>

<script lang="ts" setup>
	interface Props {
		data: {
			[key: string]: string | number;
		}[];
		title?: string;
		height?: number;
		barRadius?: number;
		hideLegend?: boolean;
		showHorizontalGridLines?: boolean;
		ticksOnXAxis?: number;
		barGroupsPadding?: number;
		yAxisLabel: string;
		xAxisLabel: string;
	}

	interface BulletLegendItemInterface {
		name: string;
		color: string;
	}

	const props = defineProps<Props>();

	const getXKey = (): string | null => {
		if (!props.data || props.data.length === 0) return null;
		const firstItem = props.data[0];
		return Object.keys(firstItem).find((key) => typeof firstItem[key] === 'string') || null;
	};

	const computedXFormatter = (tick: number, _i?: number, _ticks?: number[]): string => {
		if (!props.data || !props.data[tick]) return '';
		const xKey = getXKey();
		if (!xKey) return '';

		return String(props.data[tick][xKey]);
	};

	const computedYAxisKeys = computed(() => {
		const firstItem = props.data[0];

		// Filter keys where the value is strictly a 'number'
		return Object.keys(firstItem).filter((key) => typeof firstItem[key] === 'number');
	});

	type RevenueDataItem = {
		month: string;
		desktop: number;
		mobile: number;
	};

	const generateColor = (index: number): string => {
		const palette = [
			'#3b82f6',
			'#22c55e',
			'#eab308',
			'#ef4444',
			'#a855f7',
			'#ec4899',
			'#f97316',
			'#06b6d4',
			'#84cc16',
			'#6366f1',
		];
		// Cycle through palette or generate random if index exceeds
		return palette[index % palette.length];
	};

	const computedCategories = computed<Record<string, BulletLegendItemInterface>>(() => {
		if (!props.data || props.data.length === 0) return {};

		const firstItem = props.data[0];
		const keys = Object.keys(firstItem);
		const xKey = getXKey();

		const categories: Record<string, BulletLegendItemInterface> = {};
		let colorIndex = 0;

		keys.forEach((key) => {
			// Skip the X-axis key (label) and only create categories for numeric data
			if (key === xKey) return;

			categories[key] = {
				name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize key for legend
				color: generateColor(colorIndex++),
			};
		});

		return categories;
	});

	const yFormatter = (tick: number) => tick.toString();
</script>
