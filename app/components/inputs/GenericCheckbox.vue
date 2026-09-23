<script setup lang="ts">
interface Props {
  displayText: string;
  checkboxSize?: "xs" | "sm" | "lg" | "xl";
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  displayText: "Checkbox Option Text",
});

const model = defineModel<boolean>({ default: false });
</script>

<template>
  <div class="flex items-center">
    <input
      type="checkbox"
      :class="[
        'checkbox rounded-lg checkbox-primary',
        checkboxSize && `checkbox-${checkboxSize}`,
      ]"
      :id="id"
      v-model="model"
    />
    <label class="label-text text-base" :for="id">
      {{ displayText }}
    </label>
  </div>
</template>
