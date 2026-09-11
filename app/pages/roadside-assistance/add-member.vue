<script setup lang="ts">
const { activeRouteName } = useNavigation();
</script>

<template>
  <GrowableCard :show-padding="true">
    <div class="flex items-center justify-between mb-5">
      <nav
        class="tabs tabs-bordered"
        aria-label="Tabs"
        role="tablist"
        aria-orientation="horizontal"
      >
        <NuxtLink
          :to="{ name: 'ra-onboard-single-member' }"
          :class="[
            'tab w-fit',
            activeRouteName == 'ra-onboard-single-member' && 'text-red-500',
          ]"
        >
          Individual Registration
        </NuxtLink>
        <NuxtLink
          :to="{ name: 'ra-onboard-bulk' }"
          :class="[
            'tab w-fit',
            activeRouteName == 'ra-onboard-bulk' &&
              'active-tab:tab-active active',
          ]"
        >
          Fleet / Bulk Registration
        </NuxtLink>
      </nav>

      <NuxtLink
        class="uppercase btn-primary btn h-13"
        :to="{ name: 'ra-ava-members' }"
      >
        View All Members
      </NuxtLink>
    </div>
    <NuxtPage></NuxtPage>
  </GrowableCard>
</template>
