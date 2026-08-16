<script setup lang="ts">
definePageMeta({
  name: "valuations-create-authorization-letter",
});

const { post } = useStandardizedApi();

const rawData = reactive({
  regNo: "",
  clientName: "",
  clientPhone: "",
  regentBranch: "",
  comments: "",
  policyNumber: "",
  agentName: "",
});
const submittingRequest = ref(false);

async function submitForm() {
  try {
    submittingRequest.value = true;

    // convert to form data
    const formData = new FormData();

    // convert JSON to FormData entry
    Object.entries(rawData).forEach(([key, value]) =>
      formData.append(key, value),
    );

    // TODO: Prevent this hardcode later
    formData.append("authorizedBy", "");

    await post("/api/vehicle-valuation/create-authority-letter", formData);
  } catch (err) {
  } finally {
    submittingRequest.value = false;
  }
}
</script>

<template>
  <form class="space-y-10 p-10" @submit.prevent="submitForm()">
    <h1 class="mb-10 text-base-content text-2xl">
      Create Your Authorization Letter
    </h1>

    <!-- client details -->
    <div class="grid gap-x-8 grid-cols-3">
      <InputsGenericInput
        input-id="cal-registration-number"
        input-place-holder="enter only one e.g. KAA1224"
        input-label="Registration Number"
        input-helpertext="Uppercase with no spaces"
        :input-required="true"
        v-model="rawData.regNo"
      ></InputsGenericInput>

      <InputsGenericInput
        input-id="cal-client-name"
        input-place-holder="e.g. Jane Doe"
        input-label="Client Name"
        :input-required="true"
        v-model="rawData.clientName"
      ></InputsGenericInput>

      <InputsGenericInput
        input-id="cal-client-phone"
        input-place-holder="e.g. 254701020304"
        input-label="Client Phone"
        input-helpertext="Starts with country code without '+'"
        :input-required="true"
        v-model="rawData.clientPhone"
      ></InputsGenericInput>
    </div>

    <!-- preffered regent branch -->
    <InputsGenericInputSearchBox
      input-id="cal-select-branch"
      input-label="Select Preferred Regent Branch"
      :input-dropdown-options="[
        {
          id: '123',
          text: 'Customer Care',
        },
        {
          id: '123',
          text: 'Customer Care',
        },
        {
          id: '123',
          text: 'Customer Care',
        },
        {
          id: '123',
          text: 'Customer Care',
        },
        {
          id: '123',
          text: 'Customer Care',
        },
        {
          id: '123',
          text: 'Customer Care',
        },
        {
          id: '123',
          text: 'Customer Care',
        },
        {
          id: '123',
          text: 'Customer Care',
        },
        {
          id: '123',
          text: 'Customer Care',
        },
      ]"
      input-helpertext="Leave blank to direct to customer service"
    >
    </InputsGenericInputSearchBox>

    <!-- comment box -->
    <InputsGenericTextArea
      input-id="cal-extra-instructions"
      input-label="Provide Extra Instructions"
      input-place-holder="Write here anything extra you would like us to know. Supports up to 256 characters only!"
      :input-default-row-num="8"
      v-model="rawData.comments"
    >
    </InputsGenericTextArea>

    <!-- finalizations -->
    <div class="grid gap-x-8 grid-cols-3">
      <InputsGenericInput
        input-id="cal-policy-number"
        input-place-holder="enter only one e.g. POLICY123"
        input-label="Policy Number"
        v-model="rawData.policyNumber"
      ></InputsGenericInput>

      <InputsGenericInputSearchBox
        input-id="cal-select-side2"
        input-label="Agency / Broker"
        :input-dropdown-options="[
          {
            id: '123',
            text: 'Customer Care',
          },
        ]"
        v-model="rawData.agentName"
      >
      </InputsGenericInputSearchBox>

      <InputsGenericInput
        input-id="cal-authorized-by"
        input-label="Authorized By (You)"
        :input-disabled="true"
      ></InputsGenericInput>
    </div>

    <!-- Kycs -->
    <!-- <h1 class="mb-10 text-base-content text-xl">
      Provide Revelant Documents
    </h1>
    <InputsGenericFileInputWithPreview></InputsGenericFileInputWithPreview> -->

    <InputsGenericSubmitButton
      button-text="Submit Request"
      :submit-loading="submittingRequest"
      class="w-1/3 h-14"
    ></InputsGenericSubmitButton>
  </form>
</template>
