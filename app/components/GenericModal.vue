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
    <div v-show="showModal" class="fixed inset-0 bg-base-300/50 z-50">
      <!-- Teleport target always exists -->
      <div id="modal-body"></div>
    </div>
  </transition>
</template>
