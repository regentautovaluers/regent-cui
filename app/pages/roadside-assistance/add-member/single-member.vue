<script setup lang="ts">
import type { Reactive } from "vue";

definePageMeta({
  name: "ra-onboard-single-member",
  displayName: "Onboard Single AVA Member",
});

const clientDetails: Reactive<AVAMember> = reactive({
  full_name: "",
  userEmail: "",
  phone_number: "",
  category: "individual",
});
const { $showToast } = useNuxtApp();
const { post } = useStandardizedApi();
// initial vehicle state
const initialVehicle: AVAMemberVehicle = {
  membershipTypeId: 1,
  registration: "",
  make: "",
  model: "",
  color: "",
  payment_status: "",
  membership_status: "",
  start_date: "",
  end_date: "",
};
const clientVehicles: Reactive<AVAMemberVehicle[]> = reactive([
  {
    membershipTypeId: 1,
    registration: "",
    make: "",
    model: "",
    color: "",
    payment_status: "",
    membership_status: "",
    start_date: "",
    end_date: "",
  },
]);

const creatingMembership = ref(false);
const disableClientDetailsFields = ref(false);
async function onboardAVAMember() {
  try {
    creatingMembership.value = true;
    await post(
      "/api/roadside-assistance/onboard-single",
      JSON.stringify({
        member: clientDetails,
        vehicles: clientVehicles,
      }),
    );

    $showToast({
      title: "Success!",
      description: "AVA Membership created successfully!",
      color: "success",
    });
  } catch (err) {
    $showToast({
      title: "Failed!",
      description: "Unable to submit request!",
      color: "error",
    });
  } finally {
    creatingMembership.value = false;
    resetState();
  }
}

function resetState() {
  // reset client's details
  clientDetails.full_name = "";
  clientDetails.userEmail = "";
  clientDetails.phone_number = "";
  clientDetails.category = "individual";

  clientVehicles.splice(0, clientVehicles.length, { ...initialVehicle });
}

function addNewVehicle() {
  clientVehicles.push({
    membershipTypeId: 1,
    registration: "",
    make: "",
    model: "",
    color: "",
    payment_status: "",
    membership_status: "",
    start_date: "",
    end_date: "",
  });
}

function setPaymentStatus(statusId: 0 | 1, targetIndex: number) {
  if (statusId == 0) {
    clientVehicles[targetIndex]!.payment_status = "paid";
  }

  if (statusId == 1) {
    clientVehicles[targetIndex]!.payment_status = "not paid";
  }
}

function setMembershipStatus(statusId: 0 | 1, targetIndex: number) {
  if (statusId == 0) {
    clientVehicles[targetIndex]!.membership_status = "active";
  }

  if (statusId == 1) {
    clientVehicles[targetIndex]!.membership_status = "inactive";
  }
}

onMounted(async () => {
  const { query } = useRoute();

  if (query.client) {
    const { username, phone, email } = JSON.parse(
      await decompress(base64ToArrayBuffer(query.client as string), "deflate"),
    );

    clientDetails.full_name = username;
    clientDetails.userEmail = email;
    clientDetails.phone_number = phone;

    // disable editting of these fields
    disableClientDetailsFields.value = true;
  }
});
</script>

<template>
  <form class="space-y-10" @submit.prevent="onboardAVAMember()">
    <!-- client details -->
    <div class="grid gap-8 grid-cols-3">
      <InputsGenericInput
        input-id="ava-reg-fullname"
        input-place-holder="e.g. John Doe"
        input-label="Full Name"
        :input-required="true"
        :input-disabled="disableClientDetailsFields"
        v-model="clientDetails.full_name"
      ></InputsGenericInput>

      <InputsGenericInput
        input-id="ava-reg-phone"
        input-place-holder="e.g. 254700000000"
        input-label="Phone"
        :input-required="true"
        input-helpertext="Starts with country code without '+'"
        :input-disabled="disableClientDetailsFields"
        v-model="clientDetails.phone_number"
      ></InputsGenericInput>

      <InputsGenericInput
        input-id="ava-reg-phone"
        input-place-holder="e.g. johndoe@gmail.com"
        input-label="Client Email"
        input-helpertext="For official onboarding communication"
        :input-required="true"
        :input-disabled="disableClientDetailsFields"
        v-model="clientDetails.userEmail"
      ></InputsGenericInput>
    </div>

    <h3 class="text-base-content text-2xl mb-5">Register Your Vehicles</h3>
    <template v-for="(_, idx) in clientVehicles" :key="idx">
      <div class="grid gap-x-8 grid-cols-3">
        <InputsGenericInput
          :input-id="`ava-regno-${idx}`"
          input-place-holder="e.g. KAA1234"
          input-label="Registration Number"
          input-helpertext="Uppercase with no spaces"
          :input-required="true"
          v-model="clientVehicles[idx]!.registration"
        ></InputsGenericInput>

        <InputsGenericInput
          :input-id="`ava-vehiclemake-${idx}`"
          input-place-holder="e.g. Toyota"
          input-label="Vehicle Make"
          :input-required="true"
          v-model="clientVehicles[idx]!.make"
        ></InputsGenericInput>

        <InputsGenericInput
          :input-id="`ava-vehiclemodel-${idx}`"
          input-place-holder="e.g. Corolla"
          input-label="Vehicle Model"
          :input-required="true"
          v-model="clientVehicles[idx]!.model"
        ></InputsGenericInput>
      </div>
      <div class="col-span-3 grid gap-8 grid-cols-2">
        <InputsGenericInput
          :input-id="`ava-vehiclecolor-${idx}`"
          input-place-holder="e.g. Red"
          input-label="Vehicle Color"
          :input-required="true"
          v-model="clientVehicles[idx]!.color"
        ></InputsGenericInput>
        <InputsGenericInputSearchBox
          :input-id="`ava-membershiptype-${idx}`"
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
          @value-selected="(id) => (clientVehicles[idx]!.membershipTypeId = id)"
        >
        </InputsGenericInputSearchBox>
      </div>

      <div class="col-span-3 grid gap-8 grid-cols-2">
        <InputsGenericInputSearchBox
          :input-id="`ava-paystatus-${idx}`"
          input-label="Payment"
          :input-dropdown-options="[
            {
              id: 0,
              text: 'paid',
            },
            {
              id: 1,
              text: 'not paid',
            },
          ]"
          @value-selected="(id) => setPaymentStatus(id, idx)"
        >
        </InputsGenericInputSearchBox>

        <InputsGenericInputSearchBox
          :input-id="`ava-membership-${idx}`"
          input-label="Membership Status"
          :input-dropdown-options="[
            {
              id: 0,
              text: 'active',
            },
            {
              id: 1,
              text: 'inactive',
            },
          ]"
          @value-selected="(id) => setMembershipStatus(id, idx)"
        >
        </InputsGenericInputSearchBox>
      </div>

      <div class="grid gap-x-8 grid-cols-2">
        <InputsGenericDateInput
          :input-id="`ava-cv-start-${idx}`"
          input-place-holder="e.g. 2021-01-01"
          input-label="Cover Period Starts"
          :input-required="true"
          v-model="clientVehicles[idx]!.start_date"
        ></InputsGenericDateInput>

        <InputsGenericDateInput
          :input-id="`ava-cv-end-${idx}`"
          input-place-holder="e.g. 2022-01-01"
          input-label="Cover Period Ends"
          :input-required="true"
          v-model="clientVehicles[idx]!.end_date"
        ></InputsGenericDateInput>
      </div>
    </template>

    <button
      class="btn btn-soft btn-primary"
      aria-label="Soft Icon Button"
      type="button"
      @click="addNewVehicle"
    >
      <span
        class="icon-[material-symbols--add-2-rounded] size-4.5 shrink-0"
      ></span>
      <span>Add Another Vehicle</span>
    </button>

    <div
      class="card border-primary text-primary border bg-transparent shadow-none w-1/3"
    >
      <div class="card-body">
        <h5 class="card-title text-primary mb-2">Vehicles To Add</h5>
        <p class="text-2xl text-base-content">
          {{ clientVehicles.length }}
        </p>
      </div>
    </div>

    <InputsGenericSubmitButton
      button-text="Create Membership"
      :submit-loading="creatingMembership"
      class="w-1/3"
    ></InputsGenericSubmitButton>
  </form>
</template>
