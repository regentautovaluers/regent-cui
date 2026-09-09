<script setup lang="ts">
const store = usePrincipalStore();

function getInitials(str: string): string {
  const words = str.trim().split(/\s+/);

  if (words.length >= 2) {
    // Return first char of first two words
    return (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1 && words[0].length >= 2) {
    // Return first two chars of the single word
    return words[0].slice(0, 2).toUpperCase();
  } else {
    // Fallback for empty strings or single character words
    return str.trim().slice(0, 2).toUpperCase();
  }
}
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
