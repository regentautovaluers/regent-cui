<!-- components/BaseDatePicker.vue -->
<script setup lang="ts" id="base-datepicker">
import { ref, onMounted, onUnmounted } from "vue";
import flatpickr from "flatpickr";

const props = defineProps({
  modelValue: { type: String, default: "" },
  options: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["update:modelValue"]);
const inputRef = ref(null);
let fp = null;

onMounted(() => {
  if (inputRef.value) {
    fp = flatpickr(inputRef.value, {
      defaultDate: props.modelValue,
      onChange: (selectedDates, dateStr) => {
        emit("update:modelValue", dateStr);
      },
      appendTo: document.body,
      ...props.options,
    });
  }
});

onUnmounted(() => {
  fp?.destroy();
});
</script>

<template>
  <input
    ref="inputRef"
    type="text"
    class="input h-14 w-fit"
    placeholder="Select date"
  />
</template>
