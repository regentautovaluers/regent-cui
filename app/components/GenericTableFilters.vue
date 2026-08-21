<script setup lang="ts">
interface Props {
  disableFilters: boolean;
}

const props = defineProps<Props>();
const extraFiltersOpen = ref(false);
</script>

<template>
  <form class="mb-10 space-y-4">
    <div class="flex items-center justify-between">
      <div class="w-1/2 relative">
        <InputsGenericInput
          class="w-2/3"
          input-id="search-reg-no"
          input-place-holder="Search registration number"
        ></InputsGenericInput>
      </div>
      <div class="w-1/2 flex justify-end">
        <button
          class="btn btn-primary h-14 text-lg"
          type="button"
          :disabled="disableFilters"
          @click="extraFiltersOpen = !extraFiltersOpen"
        >
          Filters
          <span class="icon-[material-symbols--filter-alt] size-6"></span>
        </button>
      </div>
    </div>
    <!-- other filters -->
    <div v-show="extraFiltersOpen" class="flex items-center space-x-3">
      <slot></slot>
    </div>
  </form>
</template>
