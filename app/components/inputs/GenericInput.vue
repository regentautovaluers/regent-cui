<template>
  <div class="">
    <label class="label-text" for="labelAndHelperText">{{ inputLabel }}</label>
    <input
      :type="inputType"
      :placeholder="inputPlaceHolder"
      :class="[
        'input max-w-sm',
        displayValidityColors,
        `input-${inputTextSize}`,
      ]"
      :id="inputId"
      :disabled="inputDisabled"
    />
    <span class="helper-text" v-show="inputHelpertext">{{
      inputHelpertext
    }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  inputType?: "password" | "text";
  inputDisabled?: boolean;
  inputId: string;
  inputPlaceHolder?: string;
  inputLabel: string;
  inputValid?: boolean;
  inputTextSize?: "xs" | "sm" | "md" | "lg" | "xl";
  inputHelpertext?: string | undefined;
}
const props = withDefaults(defineProps<Props>(), {
  inputType: "text",
  inputDisabled: false,
  inputId: "generic-input-label",
  inputPlaceHolder: "your placeholder",
  inputValid: undefined,
  inputTextSize: "md",
  inputHelpertext: undefined,
});

const bindTo = defineModel("bindTo", { type: String, default: "" });
const displayValidityColors = computed<string | null>(() => {
  if (props.inputValid == undefined) {
    return null;
  }

  return props.inputValid ? "is-valid" : "is-invalid";
});
</script>
