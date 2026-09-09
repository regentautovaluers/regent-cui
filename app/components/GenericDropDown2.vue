<!-- components/Dropdown.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

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
      class="px-3 py-1 bg-blue-600 text-white rounded"
    >
      Actions
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
        class="absolute left-0 mr-1 mt-2 w-40 bg-white border rounded shadow-lg z-50"
      >
        <ul>
          <li>
            <button
              @click="closeDropdown"
              class="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Edit
            </button>
          </li>
          <li>
            <button
              @click="closeDropdown"
              class="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Delete
            </button>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
