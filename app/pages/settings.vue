<script setup lang="ts">
const { routes: aRoutes } = useNavigation();
const { activeRouteName } = useNavigation();
</script>

<template>
  <div class="flex-1 flex space-x-5 min-h-full">
    <div class="w-[15%] max-w-[15%] min-w-[15%] flex-1 min-h-full">
      <h1 class="mb-10 text-2xl font-bold">Actions</h1>

      <div class="flex flex-col space-y-5">
        <NuxtLink
          v-for="e in aRoutes.find((e) => e.id == 7 /*for settings*/)
            ?.children!"
          :key="e.id"
          :class="[
            'inline-flex space-x-3',
            activeRouteName == e.name && 'text-primary',
          ]"
          :to="{ name: e.name }"
        >
          <span :class="[e.icon, 'size-7']"></span>
          <span> {{ e.screenName }}</span>
        </NuxtLink>
      </div>
    </div>
    <div class="grow w-0 min-w-0">
      <NuxtPage></NuxtPage>
    </div>
    <div class="w-[15%] max-w-[15%] min-w-[15%] flex-1 min-h-full">
      <UserAvatar2></UserAvatar2>
    </div>
  </div>
</template>
