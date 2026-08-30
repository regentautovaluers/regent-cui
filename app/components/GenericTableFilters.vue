<script setup lang="ts">
interface Props {
  disableFilters: boolean;
  disableSubmitButton: boolean;
}

const props = defineProps<Props>();
const emits = defineEmits([
  "execute-filters",
  "extra-filters-open",
  "reset-filters",
]);
const extraFiltersOpen = ref(false);
const model = defineModel<string>({ default: "" });

function formSubmitted() {
  emits("execute-filters");
}

function toggleFilters() {
  if (extraFiltersOpen.value == false) {
    extraFiltersOpen.value = true;
    emits("extra-filters-open");

    return;
  }

  extraFiltersOpen.value = false;
}
</script>

<template>
  <form class="mb-5 space-y-4" @submit.prevent="formSubmitted()">
    <div class="flex items-center justify-between">
      <slot name="float-left"></slot>
      <div class="flex-1 relative">
        <InputsGenericInput
          input-id="search-reg-no"
          input-place-holder="Search registration number"
          v-model="model"
        ></InputsGenericInput>
        <button
          class="btn btn-square btn-primary absolute right-0 size-13 top-0"
          aria-label="Search Button"
          type="submit"
          :disabled="disableFilters"
          v-show="!extraFiltersOpen"
        >
          <span
            class="icon-[material-symbols--search-rounded] size-5 shrink-0"
          ></span>
        </button>
      </div>
      <div class="flex-1 flex justify-end">
        <button
          class="btn btn-primary h-14 text-lg"
          type="button"
          :disabled="disableFilters"
          @click="toggleFilters()"
        >
          Filters
          <span class="icon-[material-symbols--filter-alt] size-6"></span>
        </button>
      </div>
    </div>
    <!-- other filters -->
    <div v-show="extraFiltersOpen" class="flex items-end space-x-3">
      <slot></slot>
      <button
        class="btn btn-square btn-outline btn-primary size-13 max-w-13 max-h-13"
        aria-label="Reset Filters Button"
        @click="() => emits('reset-filters')"
      >
        <span
          class="icon-[material-symbols--filter-alt-off] size-4.5 shrink-0"
        ></span>
      </button>
      <InputsGenericSubmitButton
        button-text="Apply Filters"
        :submit-loading="disableSubmitButton"
        class="flex-1"
      ></InputsGenericSubmitButton>
    </div>
  </form>
</template>
