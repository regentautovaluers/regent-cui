<script setup lang="ts">
interface Props {
  title: string;
  subTitle: string;
  customClass?: string;
  allowScroll?: boolean;
}

const props = withDefaults(defineProps<Props>(), { allowScroll: true });
</script>

<template>
  <div :class="['rounded-lg any-border flex flex-col card', customClass]">
    <div class="p-4 space-y-1 any-border-b h-25">
      <h3 class="font-semibold text-lg">{{ title }}</h3>
      <h4 class="text-sm">{{ subTitle }}</h4>
    </div>
    <div
      :class="[
        'space-y-4 h-[100%-27%]',
        allowScroll && 'overflow-y-auto thin-scrollbar',
      ]"
    >
      <slot></slot>
    </div>
    <div class="space-y-4 h-[100%-27%] overflow-y-auto thin-scrollbar p-4">
      <slot name="with-pad"></slot>
    </div>
  </div>
</template>
