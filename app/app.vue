<script setup lang="ts">
const store = usePrincipalStore();
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <template v-if="!store.isLoggedIn">
    <LoginOverlay></LoginOverlay>
  </template>

  <template >
    <TrackingLoginOverlay></TrackingLoginOverlay>
  </template>
</template>
