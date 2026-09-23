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
            'tab active-tab:tab-active w-fit',
            activeRouteName == 'ra-onboard-single-member' && 'active',
          ]"
          id="tabs-basic-item-1"
          data-tab="#tabs-basic-1"
        >
          Individual Registration
        </NuxtLink>
        <NuxtLink
          :to="{ name: 'ra-onboard-bulk' }"
          :class="[
            'tab active-tab:tab-active w-fit',
            activeRouteName == 'ra-onboard-bulk' && 'active',
          ]"
          id="tabs-basic-item-2"
          data-tab="#tabs-basic-2"
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
