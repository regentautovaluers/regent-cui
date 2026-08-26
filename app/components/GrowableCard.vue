<script setup lang="ts">
    interface Props {
        cardTitle: string;
    }

    const props = defineProps<Props>();
</script>

<template>
  <div class="card block w-full min-h-full">
    <div class="card-body p-10">
      <h5 class="card-title mb-2.5">{{cardTitle}}</h5>
      <slot />
    </div>
  </div>
</template>
