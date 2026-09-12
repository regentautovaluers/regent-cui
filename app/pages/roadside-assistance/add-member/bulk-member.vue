<script setup lang="ts">
import { readSheet } from "read-excel-file/browser";
definePageMeta({
  name: "ra-onboard-bulk",
  displayName: "Onboard Bulk AVA Members",
});

const { post } = useStandardizedApi();
const submittingRequest = ref(false);
const parsingFile = ref(false);
const selectedFleet: Ref<AVAAvailableFleets | null> = ref(null);
const selectedMembershipType: Ref<number | null> = ref(null);
const { triggerModal } = useModal();
const { $showToast } = useNuxtApp();
const processedFleetData: Ref<BulkAVAMemberRegistration[]> = ref([]);
const {
  data: availableFleets,
  status,
  refresh,
} = useApiData<AVAAvailableFleets[]>(
  computed(() => "corporate-ava-fleet"),
  "/api/roadside-assistance/load-fleet",
  {
    lazy: false,
    dedupe: "defer",
  },
);

async function onboardBulkAVAMember() {
  try {
    submittingRequest.value = true;

    const response = await post(
      "/api/roadside-assistance/onboard-bulk",
      processedFleetData.value,
    );

    if (response.success) {
      $showToast({
        title: "Success!",
        description: `${processedFleetData.value.length} AVA members added successfully!`,
        color: "success",
      });
    }
  } catch (error) {
    $showToast({
      title: "Failed!",
      description: "Unable to upload members. Try again!",
      color: "error",
    });
  } finally {
    submittingRequest.value = false;
    processedFleetData.value = [];
  }
}

function populateFleetData(id: number) {
  selectedFleet.value = availableFleets?.value?.find((e) => e.id == id) || null;
}

async function processUploadedFile(uploadEvent: any) {
  try {
    const data = await readSheet(uploadEvent.target.files[0]);
    parsingFile.value = true;

    let row = 1;
    for (; row < data.length; row++) {
      const processedFleet = parseToAVABulkMember(row, data[row] as string[]);
      processedFleetData.value.push(processedFleet);
    }
  } catch (ex: unknown) {
    if (ex instanceof Error) {
      $showToast({
        title: "Invalid File Input!",
        description: ex.message,
        color: "error",
      });
    } else {
      $showToast({
        title: "Invalid File Input!",
        description: "Unable to parse file. Please try again!",
        color: "error",
      });
    }
  } finally {
    parsingFile.value = false;
  }
}

function parseToAVABulkMember(
  rowNum: number,
  row: string[],
): BulkAVAMemberRegistration {
  if (row.length < 10 || row.length > 10) {
    throw new Error("Entries on row: " + rowNum + " must be exactly 10");
  }

  const ret: BulkAVAMemberRegistration = {
    // fleet details
    fleetId: 0,
    available_free_distance: 20,

    // details about the vehicle
    membershipTypeId: 1,
    registration: "",
    make: "",
    model: "",
    color: "",
    payment_status: "",
    membership_status: "",
    start_date: "",
    end_date: "",

    // details about the member
    full_name: "",
    phone_number: "",
    userEmail: "",
    category: "corporate",
  };

  ret.payment_status = "paid";
  ret.membership_status = "active";

  if (!selectedFleet.value) throw new Error("Please first select a fleet!");
  ret.fleetId = selectedFleet.value?.id;

  if (!selectedMembershipType.value)
    throw new Error("Please select a membership type!");
  ret.membershipTypeId = selectedMembershipType.value;

  for (const [index, value] of row.entries()) {
    switch (index) {
      case 0: {
        if (!value) throw new Error("Client name cannot be empty!");
        ret.full_name = value;
        break;
      }
      case 1: {
        if (!value) throw new Error("Client phone cannot be empty!");
        ret.phone_number = `254${value}`;
        break;
      }
      case 2: {
        ret.userEmail = value;
        break;
      }
      case 3: {
        if (!value) throw new Error("Vehicle registration cannot be empty!");
        ret.registration = value;
        break;
      }
      case 4: {
        if (!value) throw new Error("Start date cannot be empty!");
        ret.start_date = extractDate(value);
        break;
      }
      case 5: {
        if (!value) throw new Error("End date cannot be empty!");
        ret.end_date = extractDate(value);
        break;
      }
      case 8: {
        ret.make = value;
      }
      case 9: {
        ret.model = value;
      }
      default: {
        // SILENTLY DO NOTHING
      }
    }
  }

  return ret;
}
</script>

<template>
  <form class="space-y-10" @submit.prevent="onboardBulkAVAMember()">
    <h3 class="text-base-content text-2xl my-5">
      Bulk / Fleet Onboarding Form
    </h3>

    <!-- fleet details -->
    <InputsGenericInputSearchBox
      :input-id="`ava-bulkreg-fleets`"
      input-label="Fleet Name"
      :input-data-loading="status == 'pending'"
      :input-required="true"
      :input-dropdown-options="
        availableFleets?.map((e) => ({ id: e.id, text: e.fleetname })) || []
      "
      @value-selected="(id) => populateFleetData(id)"
    >
    </InputsGenericInputSearchBox>

    <div class="grid gap-8 grid-cols-3">
      <InputsGenericInput
        input-id="ava-bulkreg-fleetownername"
        input-place-holder="e.g. John Doe"
        input-label="Fleet Manager"
        :input-required="true"
        :input-disabled="true"
      ></InputsGenericInput>
      <InputsGenericInput
        input-id="ava-bulkreg-fleetownerphone"
        input-place-holder="e.g. 254700000000"
        input-label="Fleet Manager Phone"
        :input-required="true"
        :input-disabled="true"
      ></InputsGenericInput>
      <InputsGenericInput
        input-id="ava-bulkreg-fleetowneremail"
        input-place-holder="e.g. contact@test.co.ke"
        input-label="Fleet Manager Phone"
        :input-required="true"
        :input-disabled="true"
      ></InputsGenericInput>
    </div>

    <div
      class="alert alert-soft alert-warning flex items-center gap-4"
      role="alert"
    >
      <p>Not seing your fleet? Refresh or Add One!</p>
      <div class="join">
        <button
          class="btn btn-warning join-item"
          type="button"
          @click="triggerModal()"
        >
          Add Fleet
        </button>
        <button class="btn btn-warning join-item">Refresh</button>
      </div>
    </div>

    <div class="grid gap-x-8 grid-cols-2">
      <InputsGenericDateInput
        input-id="ava-bulkreg-fleetsd"
        input-place-holder="e.g. 2021-01-01"
        input-label="Cover Period Starts"
        :input-required="true"
      ></InputsGenericDateInput>

      <InputsGenericDateInput
        input-id="ava-bulkreg-fleeted"
        input-place-holder="e.g. 2022-01-01"
        input-label="Cover Period Ends"
        :input-required="true"
      ></InputsGenericDateInput>
    </div>

    <InputsGenericInputSearchBox
      input-id="ava-bulkreg-fleetmt"
      input-label="Membership Type"
      :input-required="true"
      :input-dropdown-options="[
        {
          id: 1,
          text: 'Roadside Assistance',
        },
        {
          id: 2,
          text: 'Emergency Evacuation',
        },
      ]"
      @value-selected="(id) => (selectedMembershipType = id)"
    >
    </InputsGenericInputSearchBox>

    <h3 class="text-base-content text-2xl mt-5 mb-3">
      Download Excel Template
    </h3>
    <p class="inline-flex flex-col mb-5">
      <span
        >Kindly download our Excel template and complete all columns exactly as
        provided.</span
      >
      <span
        >Please refrain from altering the column structure or their
        sequence.</span
      >
    </p>
    <a
      href="https://media.regentautovaluers.com/media/download/utility-media/ava-roadside-assistance/onboarding_template.xlsx"
      target="_top"
      class="alert alert-soft alert-info flex items-center gap-4"
      role="alert"
    >
      <p>Click here to initiate Excel template download</p>
      <span
        class="icon-[material-symbols--sim-card-download-rounded] shrink-0 size-6"
      ></span>
    </a>

    <h3 class="text-base-content text-2xl mt-5 mb-3">Upload Excel Template</h3>
    <p class="mb-5">
      Please upload the completed template to proceed with your submission
    </p>

    <label
      for="excel-template-input"
      class="alert alert-soft alert-primary border-dashed flex items-center gap-4 cursor-pointer"
      role="button"
    >
      <input
        type="file"
        id="excel-template-input"
        class="hidden"
        @change="processUploadedFile($event)"
      />
      <p>Click here to upload the completed Excel template</p>
      <span class="icon-[material-symbols--upload-file] shrink-0 size-6"></span>
    </label>

    <InputsGenericSubmitButton
      button-text="Submit Request"
      :submit-loading="submittingRequest"
      class="w-1/3"
    ></InputsGenericSubmitButton>
  </form>
</template>
