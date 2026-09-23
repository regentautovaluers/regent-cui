<script setup lang="ts">
interface Props {
  actionId: string;
}

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const props = defineProps<Props>();

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function closeDropdown() {
  isOpen.value = false;
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="relative inline-block" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="btn btn-circle btn-text btn-sm"
      :id="actionId"
    >
      <span class="icon-[material-symbols--more-vert] size-6"></span>
    </button>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="isOpen"
        class="bg-base-100 absolute -left-53 -top-2 mt-2 w-52 border rounded-lg shadow-lg z-30"
        @click="closeDropdown"
      >
        <ul class="p-1 space-y-1">
          <slot />
        </ul>
      </div>
    </transition>
  </div>
</template>
