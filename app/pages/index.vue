<script setup lang="ts">
definePageMeta({
  name: "home",
});

const { authnLoading, attemptLogin } = useAuthn();
const payload = reactive({
  email: "",
  password: "",
});
</script>

<template>
  <form @submit.prevent="attemptLogin(payload)">
    <InputsGenericInput
      input-id="cal-registration-number"
      input-place-holder="enter only one e.g. KAA1224"
      input-label="Your Email"
      input-helpertext="Uppercase with no spaces"
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
</template>
