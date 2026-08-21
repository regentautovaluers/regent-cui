<script setup lang="ts">
const store = usePrincipalStore();
const route = useRoute();
</script>

<template>
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
</template>
