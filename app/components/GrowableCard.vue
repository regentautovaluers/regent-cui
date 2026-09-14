<script setup lang="ts">
interface Props {
  cardTitle?: string;
  showPadding?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showPadding: true,
  showSpacing: true,
});

const slots = useSlots();
</script>

<template>
  <div class="card block w-full h-full min-h-full">
    <div :class="['card-body gap-0', showPadding && 'p-10']" v-if="slots.default">
      <h5 class="card-title mb-2.5" v-if="cardTitle">{{ cardTitle }}</h5>
      <slot name="default" />
    </div>

    <slot name="no-padding"></slot>
  </div>
</template>
