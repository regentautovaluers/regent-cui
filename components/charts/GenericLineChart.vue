<template>
	<div :class="[title && 'space-y-3']">
		<h3
			class="font-semibold text-gray-700"
			v-if="title">
			{{ title }}
		</h3>
		<LineChart
			:data="data"
			:height="height ?? 300"
			:y-label="yAxisLabel"
			:x-label="xAxisLabel"
			:x-num-ticks="ticksOnXAxis ?? 3"
			:categories="computedCategories"
			:x-formatter="computedXFormatter"
			:y-grid-line="showHorizontalGridLines ?? true"
			:curve-type="CurveType.MonotoneX"
			:legend-position="LegendPosition.TopRight"
			:hide-legend="hideLegend ?? true" />
	</div>
</template>

<script lang="ts" setup>
	interface BulletLegendItemInterface {
		name: string;
		color: string;
	}

	interface Props {
		data: {
			[key: string]: string | number;
		}[];
		title?: string;
		height?: number;
		hideLegend?: boolean;
		showHorizontalGridLines?: boolean;
		ticksOnXAxis?: number;
		yAxisLabel: string;
		xAxisLabel: string;
	}
	const props = defineProps<Props>();

	// 1. Helper to generate random or distinct colors
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

	// 2. Identify the X-axis key (first non-numeric key found in the first item)
	const getXKey = (): string | null => {
		if (!props.data || props.data.length === 0) return null;
		const firstItem = props.data[0];
		return Object.keys(firstItem).find((key) => typeof firstItem[key] === 'string') || null;
	};

	// 3. Compute Categories dynamically
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

	// 4. Compute X-Formatter dynamically
	const computedXFormatter = (tick: number, _i?: number, _ticks?: number[]): string => {
		if (!props.data || !props.data[tick]) return '';
		const xKey = getXKey();
		if (!xKey) return '';

		return String(props.data[tick][xKey]);
	};
</script>
