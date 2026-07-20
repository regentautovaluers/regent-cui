<template>
  <div class="sm:w-96">
    <label class="label-text" for="textareaLabel"> {{ inputLabel }} </label>
    <textarea
      :class="['textarea', `textarea-${inputTextSize}`, displayValidityColors]"
      :placeholder="inputPlaceHolder"
      :id="inputId"
      :rows="inputDefaultRowNum"
      :disabled="inputDisabled"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
interface Props {
  inputDisabled?: boolean;
  inputId: string;
  inputPlaceHolder?: string;
  inputDefaultRowNum?: number;
  inputTextSize?: "xs" | "sm" | "md" | "lg" | "xl";
  inputValid?: boolean;
  inputLabel: string;
}

const props = withDefaults(defineProps<Props>(), {
  inputDisabled: false,
  inputId: "generic-textarea-id",
  inputPlaceHolder: "your placeholder",
  inputDefaultRowNum: 5,
  inputTextSize: "md",
  inputValid: undefined,
});

const bindTo = defineModel("bindTo", { type: String, default: "" });
const displayValidityColors = computed<string | null>(() => {
  if (props.inputValid == undefined) {
    return null;
  }

  return props.inputValid ? "is-valid" : "is-invalid";
});
</script>
