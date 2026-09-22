<script setup lang="ts">
const store = usePrincipalStore();
const route = useRoute();
</script>

<template>
  <NuxtLoadingIndicator :height="4" color="#1c64f2" />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <template v-if="!store.isLoggedIn">
    <LoginOverlay></LoginOverlay>
  </template>

  <template
    v-if="!store.isTrackingLoggedIn && route.path.includes('/regent-tracking')"
  >
    <TrackingLoginOverlay></TrackingLoginOverlay>
  </template>

  <!-- shared modal -->
  <GenericModal></GenericModal>
</template>
