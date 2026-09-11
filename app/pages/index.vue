<script setup lang="ts">
definePageMeta({
  name: "home",
});

const { triggerModal } = useModal();
</script>

<template>
  <button @click="triggerModal()">Open Model</button>
  <Teleport to="#modal-body">
    <h1>Hello world</h1>
  </Teleport>
</template>
