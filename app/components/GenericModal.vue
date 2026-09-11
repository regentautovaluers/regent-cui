<!-- components/GlobalModal.vue -->
<script setup lang="ts">
const { showModal, triggerModal } = useModal();
</script>

<template>
  <transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <!-- Use v-show instead of v-if -->
    <div
      v-show="showModal"
      class="fixed inset-0 flex items-center justify-center bg-base-300/50 z-50"
    >
      <h1 class="text-5xl font-bold">This is my modal</h1>
      <button
        type="button"
        class="w-20 p-4 bg-blue-500"
        @click="triggerModal()"
      >
        Close Modal
      </button>

      <!-- Teleport target always exists -->
      <div id="modal-body" class="bg-red-500 size-fit"></div>
    </div>
  </transition>
</template>
