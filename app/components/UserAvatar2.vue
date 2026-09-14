<script setup lang="ts">
const store = usePrincipalStore();
</script>

<template>
  <div class="h-fit flex flex-col items-center">
    <div class="avatar avatar-placeholder">
      <div class="bg-primary text-error-content w-30 rounded-full">
        <span class="text-2xl uppercase">{{
          getInitials(store.username)
        }}</span>
      </div>
    </div>

    <div class="mt-3"></div>
    <h4 class="text-base-content text-xl font-semibold">
      {{ store.username }}
    </h4>
    <h5 class="text-base-content">{{ store.email }}</h5>

    <div class="mt-3"></div>
    <NuxtLink class="btn btn-outline btn-secondary rounded-full">
      Edit Your Profile
      <span class="icon-[material-symbols--edit]"></span>
    </NuxtLink>
  </div>
</template>
