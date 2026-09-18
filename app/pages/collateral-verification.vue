<script setup lang="ts">
const { routes: aRoutes } = useNavigation();
const tokenStore = useCollateralVerificationsTokenStore();
const { activeRouteName } = useNavigation();

onMounted(async () => {
  await tokenStore.loadTokenData();
});
</script>

<template>
  <div class="flex-1 flex space-x-5 min-h-full h-full">
    <div class="w-[15%] sticky h-full">
      <h1 class="mb-10 text-2xl font-bold">Actions</h1>
      <div class="flex flex-col space-y-5">
        <NuxtLink
          v-for="e in aRoutes.find((e) => e.id == 3)?.children!"
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
    <div class="grow w-0 min-w-0 h-full">
      <NuxtPage></NuxtPage>
    </div>
    <div class="w-[15%] h-full">
      <div class="h-fit flex flex-col items-center">
        <div class="avatar avatar-placeholder">
          <div class="bg-primary text-error-content w-30 rounded-full">
            <span class="text-2xl font-semibold">{{
              tokenStore.getTokenBalance
            }}</span>
          </div>
        </div>

        <div class="mt-3"></div>
        <h4 class="text-base-content text-xl font-semibold">
          Tokens Available
        </h4>

        <div class="mt-3"></div>
        <button
          type="button"
          class="btn btn-outline btn-secondary rounded-full"
        >
          Top Up Tokens
          <span class="icon-[material-symbols--add-2-rounded]"></span>
        </button>
      </div>
    </div>
  </div>
</template>
