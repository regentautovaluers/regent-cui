<script setup lang="ts">
interface Props {
  title: string;
  subTitle: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="border border-base-content/50 rounded-lg w-full max-w-full">
    <div class="p-3 border-b border-base-content/50">
      <h3 class="font-semibold text-lg">{{ title }}</h3>
      <h4 class="text-sm">{{ subTitle }}</h4>
    </div>
    <div class="space-y-4 p-4"><slot></slot></div>
  </div>
</template>
