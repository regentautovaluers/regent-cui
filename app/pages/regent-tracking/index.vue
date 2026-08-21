<script setup lang="ts">
definePageMeta({
  name: "tracking-home",
  layout: "tracking",
});

const store = usePrincipalStore();
</script>

<template>
  <h1>Hello world</h1>
  {{ store.isTrackingLoggedIn }}
</template>
