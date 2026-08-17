<script setup lang="ts">
const { authnLoading, attemptLogin } = useAuthn();
const config = useRuntimeConfig();
const rememberMe = ref(false);
const payload = reactive({
  email: "",
  password: "",
});
</script>

<template>
  <div class="fixed top-0 w-screen h-screen flex">
    <div class="w-[60%] h-full max-h-full bg-green-500"></div>
    <div class="flex grow flex-col bg-red-500">
      <div class="h-[20%] p-16">
        <NuxtImg src="/regent-maxi-logo.png" densities="x1 x2" class="h-22" />
      </div>
      <div class="grow p-16">
        <span class="text-base-content text-5xl font-semibold">Hello,</span>
        <br />
        <span class="text-base-content text-5xl font-semibold"
          >Welcome Back!</span
        >
        <form @submit.prevent="attemptLogin({ ...payload, rememberMe})" class="grow space-y-5">
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

          <div class="flex justify-between items-center">
            <InputsGenericCheckbox
              id="authnRememberMe"
              display-text="Remember Me"
              v-model="rememberMe"
            ></InputsGenericCheckbox>
          </div>
          <InputsGenericSubmitButton
            button-text="Log In"
            :submit-loading="authnLoading"
            class="w-full"
          ></InputsGenericSubmitButton>
        </form>
      </div>

      <div class="h-[15%] flex justify-center items-end p-16">
        Copyright &copy; {{ config.public.COPYRIGHT_YEAR }}. All Rights
        Reserved.
      </div>
    </div>
  </div>
</template>
