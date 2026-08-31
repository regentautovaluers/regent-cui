<script setup lang="ts">
definePageMeta({
  name: "valuations-create-authorization-letter",
});

const { post } = useStandardizedApi();
const store = usePrincipalStore();
const generalDataStore = useGeneralDataStore();

const uploadedDocuments: Ref<any[]> = ref([]);
const rawData = reactive({
  regNo: "",
  clientName: "",
  clientPhone: "",
  regentBranch: "",
  comments: "",
  policyNumber: "",
  agentName: "",
});
const requiredDocuments = reactive([
  { name: "Certificate of Registration", idx: 0, selected: false },
  { name: "KRA PIN", idx: 1, selected: false },
  { name: "National ID", idx: 2, selected: false },
  { name: "Logbook", idx: 3, selected: false },
  { name: "Authority Letter", idx: 4, selected: false },
]);
const submittingRequest = ref(false);

function handleFileUpload(event: Event, index: number) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  // If user canceled file picker, reset status
  if (!file) {
    requiredDocuments[index]!.selected = false;
    // Remove document if it was previously uploaded for this slot
    uploadedDocuments.value = uploadedDocuments.value.filter(
      (doc) => doc.idx !== index,
    );
    return;
  }

  const ext = file.name.split(".").pop();
  const baseName = file.name.substring(0, file.name.lastIndexOf("."));
  const renamedFile = `${requiredDocuments[index]!.name}-${baseName}.${ext}`;
  const renamedFileBlob = new File([file], renamedFile, { type: file.type });

  // Prevent duplicate accumulation: filter out any existing entry for this index first
  const updatedDocs = uploadedDocuments.value.filter(
    (doc) => doc.idx !== index,
  );

  updatedDocs.push({
    idx: index, // Track index to maintain 1-to-1 mapping
    name: renamedFile,
    blob: renamedFileBlob,
  });

  uploadedDocuments.value = updatedDocs;
  requiredDocuments[index]!.selected = true;
}

async function submitForm() {
  try {
    submittingRequest.value = true;

    // convert to form data
    const formData = new FormData();

    // convert JSON to FormData entry
    Object.entries(rawData).forEach(([key, value]) =>
      formData.append(key, value),
    );

    if (uploadedDocuments.value.length > 0) {
      for (const file of uploadedDocuments.value) {
        formData.append("files", file.blob);
      }
    }

    await post("/api/vehicle-valuation/create-authority-letter", formData);
  } catch (err) {
  } finally {
    submittingRequest.value = false;
  }
}
</script>

<template>
  <GrowableCard card-title="Create Your Authority Letter">
    <form class="space-y-10" @submit.prevent="submitForm()">
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
        :input-dropdown-options="
          generalDataStore.getRegentBranches.map((e) => ({
            id: e.branchId,
            text: e.branchName,
          }))
        "
        input-helpertext="Type to search. Leave blank to direct to customer service"
        :input-data-loading="generalDataStore.loadingRegentBranches"
        :input-disabled="
          generalDataStore.loadingRegentBranches ||
          generalDataStore.getRegentBranches.length == 0
        "
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
          :input-label="store.isBroker ? 'Select Corporate' : 'Agency / Broker'"
          :input-dropdown-options="
            generalDataStore.getCorporateOrganzations.map((e) => ({
              id: e.corpId,
              text: e.corpName,
            }))
          "
          :input-data-loading="generalDataStore.loadingCorporateOrganizations"
          :input-disabled="
            generalDataStore.loadingCorporateOrganizations ||
            generalDataStore.getCorporateOrganzations.length == 0
          "
          @value-selected="(id) => rawData.agentName = id"
        >
        </InputsGenericInputSearchBox>

        <InputsGenericInput
          input-id="cal-authorized-by"
          input-label="Authorized By (You)"
          :input-disabled="true"
          :input-place-holder="store.username"
        ></InputsGenericInput>
      </div>

      <!-- Kycs -->
      <h1 class="mb-5 text-base-content text-xl">Provide Revelant Documents</h1>
      <div class="grid grid-cols-5 gap-x-5">
        <div class="w-full" v-for="e in requiredDocuments" :key="e.idx">
          <label
            class="label-text"
            :for="`cal-fu-${e.name.toLowerCase().replaceAll(' ', '_')}`"
          >
            {{ e.name }}
          </label>
          <input
            type="file"
            :class="['input', e.selected && 'is-valid']"
            :id="`cal-fu-${e.name.toLowerCase().replaceAll(' ', '_')}`"
            @change="(ev) => handleFileUpload(ev, e.idx)"
            accept=".jpeg, .png, .jpg, .pdf"
          />
          <span class="helper-text">.pdf, .jpg, .png, .jpeg(Max 1Mb)</span>
        </div>
      </div>

      <InputsGenericSubmitButton
        button-text="Submit Request"
        :submit-loading="submittingRequest"
        class="w-1/3"
      ></InputsGenericSubmitButton>
    </form>
  </GrowableCard>
</template>
