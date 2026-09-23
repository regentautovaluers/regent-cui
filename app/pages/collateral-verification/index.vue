<script setup lang="ts">
definePageMeta({
  name: "cv-onboard-single",
  displayName: "Onboard Collateral",
});

const onboardCollatertal = reactive({
  registrationNumber: "",
  chassisNumber: "",
  engineNumber: "",
  color: "",
  make: "",
  model: "",
  yearOfManufacture: 0,
  description: "",
  relevantLinks: [] as string[],
  dateOfIncident: "",
  amountDefaulted: "",
});
const onboardCollateralLoading = ref(false);
const { post } = useStandardizedApi();
const { $showToast } = useNuxtApp();

async function onboardCollateral() {
  try {
    onboardCollateralLoading.value = true;
    await post("/api/col-v/onboard-collateral", onboardCollatertal);
    $showToast({
      title: "Success!",
      description: "Case onboard successfull!",
      color: "success",
    });
  } catch (err) {
    $showToast({
      title: "Failed!",
      description: "Something went wrong. Please try again!",
      color: "error",
    });
  } finally {
    onboardCollateralLoading.value = false;
  }
}
</script>

<template>
  <GrowableCard card-title="Onboard Collateral Incident">
    <form class="space-y-8" @submit.prevent="onboardCollateral()">
      <div class="flex items-center">
        <div class="w-1/4">
          <span class="label-text text-base">Preliminary Information</span>
        </div>
        <div class="grow">
          <div class="flex join w-full flex-col *:w-full sm:flex-row">
            <InputsGenericDateInput
              input-id="val-start-date"
              input-place-holder="When did this incident occur?"
              input-extra-styles="join-item rounded-l-md"
              v-model="onboardCollatertal.dateOfIncident"
            ></InputsGenericDateInput>
            <InputsGenericInput
              input-id="add-user-fname"
              input-place-holder="How much got defaulted?"
              :input-required="true"
              input-helpertext="Number without commas or units e.g. 123456"
              input-extra-styles="join-item rounded-r-md"
              v-model="onboardCollatertal.amountDefaulted"
            ></InputsGenericInput>
          </div>
        </div>
      </div>
      <div class="flex items-center">
        <div class="w-1/4">
          <span class="label-text text-base">Vehicle Registration</span>
        </div>
        <div class="grow">
          <InputsGenericInput
            input-id="add-user-fname"
            input-place-holder="e.g KAG123X"
            :input-required="true"
            input-helpertext="E.g. number plate, chassis or engine number"
            v-model="onboardCollatertal.registrationNumber"
          ></InputsGenericInput>
        </div>
      </div>
      <div class="flex items-center">
        <div class="w-1/4">
          <span class="label-text text-base">Vehicle Identifiers</span>
        </div>
        <div class="grow">
          <div class="flex join w-full flex-col *:w-full sm:flex-row">
            <InputsGenericInput
              input-id="add-user-fname"
              input-place-holder="Enter chassis number..."
              :input-required="true"
              input-helpertext="At the time the incident occured"
              input-extra-styles="join-item rounded-l-md"
              v-model="onboardCollatertal.chassisNumber"
            ></InputsGenericInput>
            <InputsGenericInput
              input-id="add-user-fname"
              input-place-holder="Enter engine number..."
              :input-required="true"
              input-helpertext="At the time the incident occured"
              input-extra-styles="join-item rounded-r-md"
              v-model="onboardCollatertal.engineNumber"
            ></InputsGenericInput>
          </div>
        </div>
      </div>
      <div class="flex items-center">
        <div class="w-1/4">
          <span class="label-text text-base">Vehicle Type</span>
        </div>
        <div class="grow">
          <div class="flex join w-full flex-col *:w-full sm:flex-row">
            <InputsGenericInput
              input-id="add-user-fname"
              input-place-holder="Enter make e.g. Toyota..."
              :input-required="true"
              input-helpertext="At the time the incident occured"
              input-extra-styles="join-item rounded-l-md"
              v-model="onboardCollatertal.make"
            ></InputsGenericInput>
            <InputsGenericInput
              input-id="add-user-fname"
              input-place-holder="Enter model e.g. Corolla..."
              :input-required="true"
              input-helpertext="At the time the incident occured"
              input-extra-styles="join-item rounded-r-md"
              v-model="onboardCollatertal.model"
            ></InputsGenericInput>
          </div>
        </div>
      </div>
      <div class="flex items-center">
        <div class="w-1/4">
          <span class="label-text text-base">Vehicle Color</span>
        </div>
        <div class="grow">
          <InputsGenericInput
            input-id="add-user-fname"
            input-place-holder="e.g white"
            :input-required="true"
            input-helpertext="Vehicle color at the time the incident occured"
            v-model="onboardCollatertal.color"
          ></InputsGenericInput>
        </div>
      </div>
      <div class="flex items-center">
        <div class="w-1/4">
          <span class="label-text text-base">Incident Description</span>
        </div>
        <div class="grow">
          <InputsGenericTextArea
            input-id="cal-extra-instructions"
            input-place-holder="Write here what you'd like others to know about this incident. Be as descriptive as possible!"
            :input-default-row-num="6"
            v-model="onboardCollatertal.description"
          >
          </InputsGenericTextArea>
        </div>
      </div>

      <InputsGenericSubmitButton
        button-text="Onboard Incident"
        :submit-loading="onboardCollateralLoading"
      >
      </InputsGenericSubmitButton>
    </form>
  </GrowableCard>
</template>
