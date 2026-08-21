<script setup lang="ts">
const config = useRuntimeConfig();
const { post } = useStandardizedApi();
const payload = reactive({
  email: "",
  password: "",
});
const authnLoading = ref(false);

async function attemptLogin() {
  try {
    authnLoading.value = true;
    const response = await post<LoginResponse>(
      "/api/regent-tracking/client-login",
      payload,
    );

    console.log("Regent tracking response: " + response);
  } catch {
  } finally {
    authnLoading.value = false;
  }
}
</script>

<template>
  <div class="fixed top-0 w-screen flex grow flex-col bg-red-500 h-screen">
    <div class="h-[20%] p-16"></div>
    <div class="grow p-16">
      <span class="text-base-content text-5xl font-semibold">Hello,</span>
      <br />
      <span class="text-base-content text-5xl font-semibold"
        >Welcome Back!</span
      >
      <NuxtImg src="/regent-maxi-logo.png" densities="x1 x2" class="h-22" />
      <form @submit.prevent="attemptLogin()" class="grow space-y-5">
        <div class="mt-10"></div>
        <InputsGenericInput
          input-id="cal-registration-number"
          input-place-holder="enter only one e.g. KAA1224"
          input-label="Your Email"
          :input-required="true"
          v-model="payload.email"
        ></InputsGenericInput>
        <InputsGenericInput
          input-id="cal-registration-number"
          input-place-holder="e.g. FunNyBuNnie123"
          input-label="Password"
          :input-required="true"
          v-model="payload.password"
        ></InputsGenericInput>
        <InputsGenericSubmitButton
          button-text="Log In"
          :submit-loading="authnLoading"
          class="w-full"
        ></InputsGenericSubmitButton>
      </form>
    </div>

    <div class="h-[15%] flex justify-center items-end p-16">
      Copyright &copy; {{ config.public.COPYRIGHT_YEAR }}. All Rights Reserved.
    </div>
  </div>
</template>
