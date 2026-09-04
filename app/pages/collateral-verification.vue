<script setup lang="ts">
const { routes: aRoutes } = useNavigation();
const { name: rName } = useRoute();
</script>

<template>
  <div class="space-y-10 flex space-x-5 min-h-full h-full">
    <div class="w-[15%] sticky">
      <h1 class="mb-10 text-2xl font-bold">Actions</h1>
      <div class="flex flex-col space-y-5">
        <NuxtLink
          v-for="e in aRoutes.find((e) => e.id == 3)?.children!"
          :key="e.id"
          :class="['inline-flex space-x-3', rName == e.name && 'text-primary']"
          :to="{ name: e.name }"
        >
          <span :class="[e.icon, 'size-7']"></span>
          <span> {{ e.screenName }}</span>
        </NuxtLink>
      </div>
    </div>
    <div class="grow h-fit">
      <NuxtPage></NuxtPage>
    </div>
    <div class="w-[15%]">
      <UserAvatar2></UserAvatar2>
    </div>
  </div>
</template>
