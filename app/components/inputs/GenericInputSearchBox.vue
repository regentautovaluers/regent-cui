<template>
  <div class="dropdown w-full relative">
    <label
      :class="[
        'label-text text-base mb-1',
        inputRequired && 'after:content-[\'*\'] after:ml-0.5',
      ]"
      :for="inputId"
      >{{ inputLabel }}</label
    >
    <input
      :type="inputType"
      :placeholder="inputPlaceHolder"
      :class="['input dropdown-toggle h-14', `input-${inputTextSize}`]"
      :id="inputId"
      :disabled="inputDisabled"
      aria-haspopup="menu"
      aria-expanded="false"
      v-model="userInput"
    />
    <span class="helper-text" v-show="inputHelpertext">{{
      inputHelpertext
    }}</span>
    <ul
      class="dropdown-menu dropdown-open:opacity-100 hidden overflow-y-auto border border-accent mt-1"
      role="menu"
      aria-orientation="vertical"
      :aria-labelledby="inputId"
    >
      <li v-for="i in filteredOptions" :key="i.id">
        <button
          class="dropdown-item inline-flex items-center justify-between group"
          type="button"
          @mousedown="selectOption(i.id, i.text)"
        >
          <span>
            {{ i.text }}
          </span>
          <span
            class="icon-[material-symbols--arrow-insert-rounded] text-base-content/80 size-5 hidden group-hover:block"
          ></span>
        </button>
      </li>
    </ul>
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
  inputTextSize?: "xs" | "sm" | "md" | "lg" | "xl";
  inputDropdownOptions: { id: string | number; text: string | number }[];
  inputHelpertext?: string;
}
const props = withDefaults(defineProps<Props>(), {
  inputType: "text",
  inputDisabled: false,
  inputRequired: false,
  inputId: "generic-input-label",
  inputPlaceHolder: "Type to search",
  inputValid: undefined,
  inputTextSize: "md",
  inputHelpertext: undefined,
});
const emits = defineEmits(["value-selected"]);

const userInput: Ref<string> = ref("");

/**
 * High-performance UI Filtering
 * Native .filter() is optimized at the V8 engine level and runs almost instantly
 * for typical autocomplete dataset sizes.
 */
const filteredOptions = computed(() => {
  const query = userInput.value.trim().toLowerCase();

  if (!query) return props.inputDropdownOptions;

  return props.inputDropdownOptions.filter((option) => {
    const stringText = String(option.text).toLowerCase();
    return stringText.includes(query);
  });
});

// When a user clicks a match
const selectOption = (id: string | number, text: string | number) => {
  userInput.value = text.toString();
  emits("value-selected", id);
};
</script>
