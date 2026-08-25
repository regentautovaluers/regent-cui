<template>
  <div>
    <label
      v-if="inputLabel"
      :class="[
        'label-text text-base mb-1',
        inputRequired && 'after:content-[\'*\'] after:ml-0.5',
      ]"
      for="inputId"
      >{{ inputLabel }}</label
    >
    <input
      :type="inputType"
      :placeholder="inputPlaceHolder"
      :class="['input h-13', displayValidityColors, `input-${inputTextSize}`]"
      :id="inputId"
      :disabled="inputDisabled"
      :required="inputRequired"
      v-model="model"
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
  inputRequired?: boolean;
  inputId: string;
  inputPlaceHolder?: string;
  inputLabel?: string;
  inputValid?: boolean;
  inputTextSize?: "xs" | "sm" | "md" | "lg" | "xl";
  inputHelpertext?: string;
}
const props = withDefaults(defineProps<Props>(), {
  inputType: "text",
  inputDisabled: false,
  inputRequired: false,
  inputId: "generic-input-label",
  inputPlaceHolder: "your placeholder",
  inputValid: undefined,
  inputTextSize: "md",
  inputHelpertext: undefined,
});

const model = defineModel<string>({ default: "" });
const displayValidityColors = computed<string | null>(() => {
  if (props.inputValid == undefined) {
    return null;
  }

  return props.inputValid ? "is-valid" : "is-invalid";
});
</script>
