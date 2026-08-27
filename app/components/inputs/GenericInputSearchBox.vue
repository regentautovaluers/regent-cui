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
      :class="['input dropdown-toggle h-13', `input-${inputTextSize}`]"
      :id="inputId"
      :disabled="inputDisabled"
      aria-haspopup="menu"
      aria-expanded="false"
      v-model="userInput"
    />

    <!-- loading spinner -->
    <template v-show="inputDataLoading">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        class="absolute right-3 top-[43%] size-7"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          fill="currentColor"
          d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
          opacity=".25"
        />
        <path
          fill="currentColor"
          d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
        >
          <animateTransform
            attributeName="transform"
            dur="0.75s"
            repeatCount="indefinite"
            type="rotate"
            values="0 12 12;360 12 12"
          />
        </path>
      </svg>
    </template>

    <span class="helper-text" v-show="inputHelpertext">{{
      inputHelpertext
    }}</span>
    <ul
      class="dropdown-menu absolute left-0 right-0 dropdown-open:opacity-100 hidden border border-primary h-fit max-h-64 overflow-y-auto thin-scrollbar"
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
  inputDataLoading?: boolean;
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
  inputDataLoading: false,
  inputRequired: false,
  inputId: "generic-input-label",
  inputPlaceHolder: "Type to search",
  inputValid: undefined,
  inputTextSize: "md",
  inputHelpertext: "Type to search",
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
