<script setup lang="ts">
import GenericSubmitButton from "~/components/inputs/GenericSubmitButton.vue";

definePageMeta({
  name: "home",
});

const { openModal } = useModal();

const handleEdit = () => {
  openModal(GenericSubmitButton);
};
</script>

<template><button @click="handleEdit()">Open Model</button></template>
