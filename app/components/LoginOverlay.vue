<script setup lang="ts">
const { authnLoading, attemptLogin } = useAuthn();
const config = useRuntimeConfig();
const rememberMe = ref(false);
const payload = reactive({
  email: "",
  password: "",
});
const slideImages: readonly string[] = [
  "/fslides/1.jpg",
  "/fslides/2.jpg",
  "/fslides/3.jpg",
  "/fslides/4.jpg",
  "/fslides/5.jpg",
  "/fslides/6.jpg",
];
</script>

<template>
  <div class="fixed top-0 z-50 w-screen bg-base-100 h-screen flex">
    <div class="w-[60%] h-full max-h-full">
      <div
        id="indicators"
        data-carousel='{ "loadingClasses": "opacity-0", "dotsItemClasses": "carousel-dot carousel-active:bg-primary", "isAutoPlay": true, "speed": 5000 }'
        class="relative w-full h-full"
      >
        <div class="carousel h-full">
          <div class="carousel-body h-full opacity-0">
            <!-- Slides -->
            <div
              class="carousel-slide"
              v-for="(v, idx) in slideImages"
              :key="idx"
            >
              <div class="flex h-full justify-center">
                <NuxtImg
                  :src="v"
                  densities="x1 x2"
                  class="object-cover size-full"
                  preload
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="carousel-pagination absolute bottom-3 end-0 start-0 flex justify-center gap-3"
        ></div>
      </div>
    </div>
    <div class="flex grow flex-col">
      <div class="h-[20%] p-25">
        <NuxtImg src="/regent-maxi-logo.png" densities="x1 x2" class="h-22" />
      </div>
      <div class="grow p-25">
        <span class="text-base-content text-5xl font-semibold">Hello,</span>
        <br />
        <span class="text-base-content text-5xl font-semibold"
          >Welcome Back!</span
        >
        <form
          @submit.prevent="attemptLogin({ ...payload, rememberMe })"
          class="grow space-y-5"
        >
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
        <a
          class="font-semibold text-primary underline"
          href="https://regentautovaluers.com/"
          target="_blank"
          >Regent Auto Valuers</a
        >
      </div>
    </div>
  </div>
</template>
