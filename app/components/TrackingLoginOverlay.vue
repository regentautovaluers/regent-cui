<script setup lang="ts">
const config = useRuntimeConfig();
const { post } = useStandardizedApi();
const tracking_auth_token = useCookie("tracking_auth_token");
const store = usePrincipalStore();
const payload = reactive({
  email: "",
  password: "",
});
const authnLoading = ref(false);

async function attemptLogin() {
  try {
    authnLoading.value = true;
    const response = await post<RegentTrackingLoginResponse>(
      "/api/regent-tracking/client-login",
      payload,
    );

    if (response.success) {
      const data = (
        response as StandardSuccessResponse<RegentTrackingLoginResponse>
      ).data;
      tracking_auth_token.value = data.user_api_hash;
      store.isTrackingLoggedIn = true;
    }
  } catch (ex) {
  } finally {
    authnLoading.value = false;
  }
}
</script>

<template>
  <div
    class="fixed top-0 z-50 w-screen flex grow flex-col bg-base-100 h-screen"
  >
    <div class="h-[10%] p-10">
      <NuxtLink class="btn btn-soft" :to="{ name: 'home' }">
        <span
          class="icon-[material-symbols--arrow-back-rounded] inline-flex items-center"
        ></span>
        Go Back Home
      </NuxtLink>
    </div>
    <div class="grow flex flex-col justify-center items-center">
      <NuxtImg src="/regent-maxi-logo.png" densities="x1 x2" class="h-22" />
      <span class="text-base-content text-2xl mt-5 font-semibold"
        >Login To Regent Tracking</span
      >
      <form @submit.prevent="attemptLogin()" class="grow space-y-5 w-1/3">
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

        <div
          class="alert alert-outline alert-warning flex items-center gap-4"
          role="alert"
        >
          <span class="icon-[tabler--alert-triangle] shrink-0 size-6"></span>
          <p>
            <span class="">Have no account?</span>
            <a
              href="mailto:support@regenttrack.co.ke,operations@regenttrack.co.ke"
              class="font-semibold underline underline-offset-2"
              target="_blank"
            >
              Contact Us</a
            >
            To Set Up One Today!
          </p>
        </div>
      </form>
    </div>

    <div class="h-[10%] flex justify-center items-end p-10">
      Copyright &copy; {{ config.public.COPYRIGHT_YEAR }}. All Rights Reserved.
    </div>
  </div>
</template>
