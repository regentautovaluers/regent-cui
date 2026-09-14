<template>
  <div :class="['relative', title && 'space-y-3']">
    <h3 class="font-semibold text-gray-700" v-if="title">
      {{ title }}
    </h3>
    <DonutChart
      :data="data.map((i) => derivePercentage(i.value, totalInput))"
      :height="height ?? 200"
      :radius="radius ?? 0"
      :categories="categories"
      :hide-legend="true"
      :type="DonutType.Full"
      :pad-angle="0"
      :arc-width="innerHoleWidth ?? 0"
      :glow="true"
    >
      <template #tooltip="{ values }">
        <div class="text-default flex items-center gap-2 p-2">
          <div
            class="size-3 rounded-full"
            :style="{
              backgroundColor: getCategoryColor(values?.label),
            }"
          />
          <span class="text-dimmed mr-1">
            {{ values?.label }}
          </span>
          {{ values ? values[values?.label] : "" }}
        </div>
      </template>

      <template #default>
        <div class="flex flex-col items-center justify-center">
          <span class="text-3xl font-bold">
            {{ totalInput }}
          </span>
          <span>Total</span>
        </div>
      </template>
    </DonutChart>

    <div class="space-y-2 w-full mt-4" v-if="!hideLegend">
      <div
        v-for="(cat, key) in categories"
        :key="key"
        class="grid grid-cols-[80%_20%]"
      >
        <div class="flex items-center space-x-2">
          <div
            class="size-4 rounded"
            :style="{ backgroundColor: cat.color }"
          ></div>
          <span class="text-base-content font-semibold"> {{ cat.name }}</span>
        </div>
        <span class="text-base-content">
          {{ cat.value }}
        </span>
      </div>
    </div>
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
  total?: number;
}

interface BulletLegendItemInterface {
  name: string;
  color: string;
  value: number;
}

const tailwindColors = [
  "#4f46e5", // indigo-600
  "#9333ea", // purple-600
  "#db2777", // pink-600
  "#e11d48", // rose-600
  "#059669", // emerald-600
  "#2563eb", // blue-600
  "#d97706", // amber-600
  "#06b6d4", // cyan-600
  "#dc2626", // red-600
  "#16a34a", // green-600
  "#ea580c", // orange-600
  "#0d9488", // teal-600
  "#64748b", // slate-500
  "#f59e0b", // yellow-500
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#ec4899", // fuchsia-500
  "#14b8a6", // teal-500
  "#22c55e", // green-500
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#eab308", // yellow-600
  "#84cc16", // lime-600
  "#10b981", // emerald-500
  "#6366f1", // indigo-500
  "#a855f7", // purple-500
  "#f43f5e", // rose-500
  "#fb7185", // pink-400
  "#facc15", // yellow-400
  "#34d399", // green-400
  "#60a5fa", // blue-400
  "#c084fc", // violet-400
  "#f472b6", // fuchsia-400
  "#2dd4bf", // teal-400
  "#f87171", // red-400
  "#fb923c", // orange-400
  "#a3e635", // lime-400
  "#fde047", // yellow-300
  "#93c5fd", // blue-300
];

const props = defineProps<Props>();
const totalInput: ComputedRef<number> = computed(() =>
  props.total
    ? props.total
    : props.data.map((e) => e.value).reduce((cumm, curr) => cumm + curr, 0),
);
const categories = computed(() => {
  return props.data.reduce(
    (acc, item, index) => {
      acc[item.name] = {
        name: item.name,
        // Assign color based on the index to ensure consistency
        color: tailwindColors[index % tailwindColors.length]!,
        value: item.value,
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
