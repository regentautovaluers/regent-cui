<script setup lang="ts">
type RoadRescueModes = "tow" | "fd" | "jstart" | "tyrec";
interface RoadRescueModesSelector {
  short: RoadRescueModes;
  long: String;
}

definePageMeta({
  layout: "no-pad",
  displayName: "Request Road Rescue",
});
const availableRoadRescueModes: readonly RoadRescueModesSelector[] = [
  {
    short: "tow",
    long: "Towing",
  },
  {
    short: "fd",
    long: "Fuel Delivery",
  },
  {
    short: "jstart",
    long: "Jumpstarting",
  },
  {
    short: "tyrec",
    long: "Tyrechange",
  },
];
const fuelType: { id: number; text: "Diesel" | "Petrol" }[] = [
  { id: 0, text: "Diesel" },
  { id: 1, text: "Petrol" },
];
const tyreType: { id: number; text: "tube" | "tubeless" | "unknown" }[] = [
  { id: 0, text: "tube" },
  { id: 1, text: "tubeless" },
  { id: 2, text: "unknown" },
];
const { post } = useStandardizedApi();
const { $showToast } = useNuxtApp();
const activeDisplay: Ref<"registered" | "unregistered"> = ref("registered");
const requestMode: Ref<"tow" | "fd" | "jstart" | "tyrec"> = ref("tow");
const submittingRequest = ref(false);
const requestData = reactive<RequestRoadsideAssistanceMerged>({
  appUserName: "",
  corporate_client: "",
  appUserPhone: "",
  appUserEmail: "",
  appServiceType: "Fuel Delivery",
  appRegistration: "",
  vehicleMake: "",
  vehicleModel: "",
  appDuration: 0,
  appCost: 0,
  appPickupPoint: "",
  appPickupLat: 0,
  requestRemarks: "",
  appPickupLon: 0,
  appDestinationPoint: "",
  appDestinationLat: 0,
  appDestinationLon: 0,
  appDistance: 0,
  currentFreeDistance: 0,
  vehicleType: 0,
  vehicleClass: 0,
  fuelType: "",
  fuelAmount: "",
  tyreType: "",
  hasSpareTyre: "",
});
const formTitle = computed(() => {
  let basic = `${activeDisplay.value == "registered" ? "Registered Client" : "Unregistered Client"}`;

  switch (requestMode.value) {
    case "fd": {
      basic += " Fuel Delivery Request";
      break;
    }
    case "tow": {
      basic += " Towing Request";
      break;
    }
    case "tyrec": {
      basic += " Tyrechange Request";
      break;
    }
    case "jstart": {
      basic += " Jumpstarting Request";
      break;
    }
  }
  return basic;
});
// const staticServiceCost: ComputedRef<number> = computed(() => {
//   if (serviceCharges.value) {
//     switch (route.name) {
//       case "ra-jumpstarting-request":
//         return pickServiceToSourceCharge(serviceCharges.value, "Jumpstarting")
//           .charge;
//       case "ra-fueldelivery-request":
//         return pickServiceToSourceCharge(serviceCharges.value, "Fuel Delivery")
//           .charge;
//       case "ra-tyrechange-request":
//         return pickServiceToSourceCharge(serviceCharges.value, "Tyre Change")
//           .charge;
//     }
//   } else {
//     return 0;
//   }
// });
const {
  data: avaVehicleClasses,
  status,
  refresh,
} = useApiData<SlimmedAvaVehicleTypes[]>(
  computed(() => `available-ava-vehicle-classes`),
  "/api/roadside-assistance/load-ava-vehicle-classes",
  {
    lazy: false,
    // Keep previous data visible while fetching the next page for seamless UX
    dedupe: "defer",
  },
);

function calculateTowingChargeNonMember(
  basePrice: number,
  distance: number,
  chargePerExtraKm: number,
): number {
  if (distance < 10) {
    return basePrice;
  }

  return Math.ceil(basePrice + (distance - 10) * chargePerExtraKm);
}

function calculateTowingChargeMember(
  basePrice: number,
  distance: number,
  chargePerExtraKm: number,
  freeDistanceBenefit: number,
  thresholdDistance: number,
): number {
  if (freeDistanceBenefit <= 0) {
    if (distance < thresholdDistance) {
      return basePrice;
    } else {
      return Math.ceil(
        basePrice + (distance - thresholdDistance) * chargePerExtraKm,
      );
    }
  }

  const distanceAboveBenefit = distance - freeDistanceBenefit;
  if (distanceAboveBenefit >= 0) {
    return Math.ceil(0 + distanceAboveBenefit * chargePerExtraKm);
  } else {
    return 0;
  }
}

async function requestRoadsideAssistance() {
  try {
    submittingRequest.value = true;
    await post("/api/roadside-assistance/create-ra-request", requestData);
    $showToast({
      title: "Success!",
      description: "Road rescue request submitted successfully!",
      color: "success",
    });
  } catch (ex) {
    $showToast({
      title: "Something Went Wrong!",
      description: "Unable to make request!",
      color: "error",
    });
  } finally {
    submittingRequest.value = false;
  }
}
</script>

<template>
  <div class="h-full min-h-full bg-red-500">
    <h1>Hello world</h1>
    {{ avaVehicleClasses }}
  </div>
  <div class="h-full min-h-full p-20 space-y-8">
    <div class="w-full">
      <div
        class="tabs tabs-bordered"
        aria-label="Tabs"
        role="tablist"
        aria-orientation="horizontal"
      >
        <button
          type="button"
          :class="[
            'tab active-tab:tab-active w-fit',
            activeDisplay == 'registered' && 'active',
          ]"
          id="tabs-basic-item-1"
          data-tab="#tabs-basic-1"
          @click="() => (activeDisplay = 'registered')"
        >
          Registered Client
        </button>
        <button
          type="button"
          :class="[
            'tab active-tab:tab-active w-fit',
            activeDisplay == 'unregistered' && 'active',
          ]"
          id="tabs-basic-item-2"
          data-tab="#tabs-basic-2"
          @click="() => (activeDisplay = 'unregistered')"
        >
          Unregistered Client
        </button>
      </div>

      <h1 class="my-10 text-base-content text-xl">
        {{ formTitle }}
      </h1>
    </div>

    <!-- client details -->
    <form>
      <h3 class="mb-5 text-base-content text-lg">Client Details</h3>
      <div class="grid gap-8 grid-cols-2">
        <div class="col-span-full">
          <InputsGenericInput
            input-id="rra-client-name"
            input-place-holder="e.g. Jane Doe"
            input-label="Client Name"
            :input-required="true"
          ></InputsGenericInput>
        </div>

        <InputsGenericInput
          input-id="rra-client-email"
          input-place-holder="e.g. janedoe@gmail.com"
          input-label="Client Email"
          input-helpertext="Required for notifications with the client."
          :input-required="true"
        ></InputsGenericInput>

        <InputsGenericInput
          input-id="rra-client-phone"
          input-place-holder="e.g. 254701020304"
          input-label="Client Phone"
          input-helpertext="Required - start with country code without '+'"
          :input-required="true"
        ></InputsGenericInput>
      </div>
    </form>

    <!-- client details -->
    <form>
      <h3 class="mb-5 text-base-content text-lg">Vehicle Details</h3>
      <div class="grid gap-8 grid-cols-2">
        <div class="col-span-full">
          <InputsGenericInput
            input-id="rra-vehicle-reg"
            input-place-holder="e.g. KAA123X"
            input-label="Vehicle Registration"
            :input-required="true"
          ></InputsGenericInput>
        </div>

        <InputsGenericInput
          input-id="rra-vehicle-make"
          input-place-holder="e.g. Toyota"
          input-label="Make"
          :input-required="true"
        ></InputsGenericInput>

        <InputsGenericInput
          input-id="rra-vehicle-model"
          input-place-holder="e.g. Corolla"
          input-label="Model"
          :input-required="true"
        ></InputsGenericInput>
      </div>
    </form>

    <!-- service type -->
    <div>
      <h3 class="mb-5 text-base-content text-lg">Select A Service Type</h3>
      <ul
        class="border-base-content/25 divide-base-content/25 rounded-box flex w-full flex-col border *:w-full *:cursor-pointer max-sm:divide-y sm:flex-row sm:divide-x"
      >
        <li v-for="mode in availableRoadRescueModes" :key="mode.short">
          <label class="flex items-center gap-2 p-3">
            <input
              :id="`road-rescue-mode-${mode.short}`"
              :value="mode.short"
              v-model="requestMode"
              type="radio"
              name="radio-14"
              class="radio radio-primary ms-3"
            />
            <span class="label-text text-base">
              {{ mode.long }}
            </span>
          </label>
        </li>
      </ul>
    </div>

    <!-- other fields that change depending on request type -->
    <form
      class="grid grid-cols-1 gap-8"
      @submit.prevent="requestRoadsideAssistance()"
    >
      <!-- vehicle type -->
      <InputsGenericInputSearchBox
        input-id="rra-vehicle-class"
        input-label="Vehicle Class"
        :input-dropdown-options="
          avaVehicleClasses?.map((e) => ({
            id: e.id,
            text: e.description,
          })) || []
        "
        :input-required="true"
      >
      </InputsGenericInputSearchBox>

      <!-- fuel delivery fuel-type -->
      <template v-if="requestMode == 'fd'">
        <InputsGenericInputSearchBox
          input-id="rra-fuel-type"
          input-label="Fuel Type"
          :input-dropdown-options="fuelType"
          :input-required="true"
        >
        </InputsGenericInputSearchBox>
      </template>

      <!-- tyre change -> tyre type and if has spare tyre -->
      <template v-if="requestMode == 'tyrec'">
        <div class="grid grid-cols-1 gap-8">
          <!-- tyre type -->
          <InputsGenericInputSearchBox
            input-id="rra-tyre-type"
            input-label="Tyre Type"
            :input-dropdown-options="tyreType"
            :input-required="true"
          >
          </InputsGenericInputSearchBox>

          <!-- has spare tyre -->
          <div>
            <span class="mb-1 label-text text-base">
              Client has spare tyre?
            </span>
            <ul
              class="border-base-content/25 divide-base-content/25 rounded-box flex w-full flex-col border *:w-full *:cursor-pointer max-sm:divide-y sm:flex-row sm:divide-x"
            >
              <li>
                <label class="flex items-center gap-2 p-3">
                  <input
                    id="rra-has-spare-tyre"
                    :value="true"
                    v-model="requestMode"
                    type="radio"
                    name="radio-14"
                    class="radio radio-primary ms-3"
                  />
                  <span class="label-text text-base"> Has spare tyre. </span>
                </label>
              </li>
              <li>
                <label class="flex items-center gap-2 p-3">
                  <input
                    id="rra-has-spare-tyre2"
                    :value="true"
                    v-model="requestMode"
                    type="radio"
                    name="radio-14"
                    class="radio radio-primary ms-3"
                  />
                  <span class="label-text text-base"> Has No spare tyre. </span>
                </label>
              </li>
            </ul>
          </div>
        </div></template
      >

      <!-- cost estimator -->
      <div class="grid grid-cols-3 gap-8"></div>

      <InputsGenericSubmitButton
        :button-text="`Submit Request`"
        :submit-loading="submittingRequest"
        class="w-1/3"
      ></InputsGenericSubmitButton>
    </form>
  </div>
</template>
