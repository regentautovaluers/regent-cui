<script setup lang="ts"></script>

<template>
  <div class="space-y-10">
    <!-- user account settings -->
    <GrowableCard card-title="Your Account"> </GrowableCard>

    <!-- 2fa -->
    <GrowableCard card-title="Account Security"> </GrowableCard>

    <!-- system settings -->
    <GrowableCard card-title="Look & Feel">
      <SettingsSystem />
    </GrowableCard>
  </div>
</template>
