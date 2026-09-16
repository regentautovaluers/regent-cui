<script setup lang="ts">
definePageMeta({
  layout: "no-pad",
  displayName: "Request Road Rescue",
});
const {
  data: avaVehicleClasses,
  status: loadAvaVehicleClassesStatus,
  refresh: refreshAvaVehicleClassesStatus,
} = useApiData<SlimmedAvaVehicleTypes[]>(
  computed(() => `available-ava-vehicle-classes`),
  "/api/roadside-assistance/load-ava-vehicle-classes",
  {
    lazy: false,
    // Keep previous data visible while fetching the next page for seamless UX
    dedupe: "defer",
  },
);

const {
  data: fixedServiceCharges,
  status: loadFixedServiceChargesStatus,
  refresh: refreshFixedServiceCharges,
} = useApiData<RoadsideAssistanceFixedServiceCharges[]>(
  computed(() => `ava-vfixed-service-charges`),
  "/api/roadside-assistance/load-ava-service-charges",
  {
    lazy: false,
    // Keep previous data visible while fetching the next page for seamless UX
    dedupe: "defer",
  },
);

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
const fuelType: { id: number; text: FuelTypes }[] = [
  { id: 0, text: "Diesel" },
  { id: 1, text: "Petrol" },
];
const tyreType: { id: number; text: TyreTypes }[] = [
  { id: 0, text: "tube" },
  { id: 1, text: "tubeless" },
  { id: 2, text: "unknown" },
];
const { post, get } = useStandardizedApi();
const { $showToast } = useNuxtApp();
const { public: pubConf } = useRuntimeConfig();
const activeDisplay: Ref<"registered" | "unregistered"> = ref("registered");
const isMemberUnderEA: Ref<boolean | null> = ref(null);
const requestMode: Ref<ActiveRequestMode> = ref("tow");
const submittingRequest = ref(false);
const searchingVehicle = ref(false);
const requestData = reactive<RequestRoadsideAssistanceMerged>({
  appUserName: "",
  corporate_client: "",
  appUserPhone: "",
  appUserEmail: "",
  appServiceType: "Tow",
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
  hasSpareTyre: null,
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
const staticServiceCost: ComputedRef<number> = computed(() => {
  if (fixedServiceCharges.value) {
    const fixedCharges = unref(fixedServiceCharges.value);

    switch (requestMode.value) {
      case "jstart":
        return Number(
          pickFixedServiceCharge(fixedCharges, "Jumpstarting")!.charge,
        );
      case "fd":
        return Number(
          pickFixedServiceCharge(fixedCharges, "Fuel Delivery")!.charge,
        );
      case "tyrec":
        return Number(
          pickFixedServiceCharge(fixedCharges, "Tyre Change")!.charge,
        );
    }
  }

  return 0;
});

const computedServiceCost: ComputedRef<number> = computed(() => {
  const isMember = isMemberUnderEA.value !== undefined; // or however you track membership

  // Case 1: static service cost modes
  if (
    (["fd", "jstart", "tyrec"] as ActiveRequestMode[]).includes(
      requestMode.value,
    )
  ) {
    return isMember ? 0 : staticServiceCost.value;
  }

  // Case 2: towing cost
  const availableVehicleClasses = unref(avaVehicleClasses);
  const selectedVehicleType = availableVehicleClasses
    ? availableVehicleClasses[requestData.vehicleType]
    : null;

  if (!requestData.appDistance || !selectedVehicleType) {
    return 0;
  }

  if (isMember) {
    if (isMemberUnderEA.value === false) {
      return calculateTowingChargeMember(
        selectedVehicleType.towingRateWithinThresholdPrice,
        requestData.appDistance,
        selectedVehicleType.towingRateOverThresholdPriceMembers,
        requestData.currentFreeDistance,
        selectedVehicleType.towingRateThresholdDistance,
      );
    } else {
      return calculateTowingChargeNonMember(
        selectedVehicleType.towingRateWithinThresholdPrice,
        requestData.appDistance,
        selectedVehicleType.towingRateOverThresholdPriceNonMembers,
      );
    }
  } else {
    return (
      calculateTowingChargeNonMember(
        selectedVehicleType.towingRateWithinThresholdPrice,
        requestData.appDistance,
        selectedVehicleType.towingRateOverThresholdPriceNonMembers,
      ) || 0
    );
  }
});

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

async function searchVehicle() {
  try {
    searchingVehicle.value = true;
  } catch (ex) {
    $showToast({
      title: "Search failed!",
      description: "Please try search again!",
      color: "error",
    });
  } finally {
    searchingVehicle.value = false;
  }
}

function assignTyreType(id: number) {
  switch (id) {
    case 0: {
      requestData.tyreType = "tube";
      break;
    }

    case 1: {
      requestData.tyreType = "tubeless";
      break;
    }

    case 2: {
      requestData.tyreType = null;
      break;
    }
  }
}

function assignFuelType(id: number) {
  switch (id) {
    case 0: {
      requestData.fuelType = "Diesel";
      break;
    }

    case 1: {
      requestData.tyreType = "Petrol";
      break;
    }
  }
}

// change the type of the backend service
watch(requestMode, (newMode) => {
  switch (newMode) {
    case "fd":
      requestData.appServiceType = "Fuel Delivery";
      break;
    case "tow":
      requestData.appServiceType = "Tow";
      break;
    case "jstart":
      requestData.appServiceType = "Jumpstart";
      break;
    case "tyrec":
      requestData.appServiceType = "Tyre";
      break;
    default:
      requestData.appServiceType = "Tow";
  }
});

// distance calculator
watch(
  () => [
    requestData.appPickupLat,
    requestData.appPickupLon,
    requestData.appDestinationLat,
    requestData.appDestinationLon,
  ],
  async ([pickupLat, pickupLon, destLat, destLon]) => {
    if (pickupLat && pickupLon && destLat && destLon) {
      const directionsService = new google.maps.DirectionsService();

      const directionsRequest: google.maps.DirectionsRequest = {
        origin: new google.maps.LatLng(pickupLat, pickupLon),
        destination: new google.maps.LatLng(destLat, destLon),
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: "optimistic",
        },
      };

      directionsService.route(directionsRequest, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          const leg = result.routes[0].legs[0];
          if (leg?.distance) {
            // Store the distance (in km) directly in requestData
            requestData.appDistance = leg.distance.value / 1000;
          }
        } else {
          console.error("Failed to compute route:", status);
        }
      });
    }
  },
);

// cost calculator setup
watch(computedServiceCost, (newValue) => (requestData.appCost = newValue));

// bind google maps places picker
onMounted(() => {
  bindToLocation(
    pubConf,
    "rra-incident-location",
    1,
    "Client's Location",
    ({ lat, lng, name }) => {
      requestData.appPickupLat = lat;
      requestData.appPickupLon = lng;
      requestData.appPickupPoint = name;
    },
  );

  bindToLocation(
    pubConf,
    "rra-incident-destination",
    2,
    "Client's Destination",
    ({ lat, lng, name }) => {
      requestData.appDestinationLat = lat;
      requestData.appDestinationLon = lng;
      requestData.appDestinationPoint = name;
    },
  );
});
</script>

<template>
  <div class="h-full min-h-full bg-red-500">
    <h1>Hello world</h1>
    {{ JSON.stringify(requestData, null, 2) }}
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

    <!-- vehicle details -->
    <form class="grid grid-cols-1 gap-8">
      <!-- vehicle details -->
      <h3 class="text-base-content text-lg">Vehicle Details</h3>
      <div class="grid gap-8 grid-cols-2">
        <div class="col-span-full relative">
          <InputsGenericInput
            input-id="rra-vehicle-reg"
            input-place-holder="e.g. KAA123X"
            input-label="Vehicle Registration"
            :input-required="true"
            v-model="requestData.appRegistration"
          ></InputsGenericInput>

          <!-- trigger search vehicle button -->
          <button
            class="btn btn-square btn-soft btn-primary size-12 absolute right-[3px] top-[38px]"
            aria-label="Soft Icon Button"
            type="submit"
            disabled
            v-show="activeDisplay == 'registered'"
          >
            <span
              class="icon-[material-symbols--search-rounded] size-5 shrink-0"
            ></span>
          </button>
        </div>

        <InputsGenericInput
          input-id="rra-vehicle-make"
          input-place-holder="e.g. Toyota"
          input-label="Make"
          v-model="requestData.vehicleMake"
        ></InputsGenericInput>

        <InputsGenericInput
          input-id="rra-vehicle-model"
          input-place-holder="e.g. Corolla"
          input-label="Model"
          v-model="requestData.vehicleModel"
        ></InputsGenericInput>
      </div>

      <div class="w-full">
        <div
          class="progress h-4"
          role="progressbar"
          aria-label="50% Progressbar"
          aria-valuenow="50"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div class="progress-bar w-1/2"></div>
        </div>
        <div class="my-2 flex items-end justify-between">
          <p class="text-base-content uppercase font-semibold">
            {{
              !requestData.appRegistration ? "-" : requestData.appRegistration
            }}
          </p>
          <span class="text-base-content uppercase font-semibold text-sm"
            >{{ requestData.currentFreeDistance }} Free Towing Left</span
          >
        </div>
      </div>
    </form>

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
            v-model="requestData.appUserName"
          ></InputsGenericInput>
        </div>

        <InputsGenericInput
          input-id="rra-client-email"
          input-place-holder="e.g. janedoe@gmail.com"
          input-label="Client Email"
          input-helpertext="Required for notifications with the client."
          :input-required="true"
          v-model="requestData.appUserEmail"
        ></InputsGenericInput>

        <InputsGenericInput
          input-id="rra-client-phone"
          input-place-holder="e.g. 254701020304"
          input-label="Client Phone"
          input-helpertext="Required - start with country code without '+'"
          :input-required="true"
          v-model="requestData.appUserPhone"
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
      <!-- location stuff -->
      <div class="grid grid-cols-1 gap-8">
        <div class="flex items-end space-x-2 w-full">
          <div class="btn size-13 w-13 btn-square btn-soft btn-primary">
            <span
              class="icon-[material-symbols--person-pin-rounded] size-8"
            ></span>
          </div>
          <div class="grow">
            <InputsGenericInput
              input-id="rra-incident-location"
              input-place-holder="Type to start searching"
              input-label="Incident Location"
              :input-required="true"
            ></InputsGenericInput>
          </div>
        </div>

        <div
          class="flex items-end space-x-2 w-full"
          v-show="requestMode == 'tow'"
        >
          <div class="btn size-13 w-13 btn-square btn-soft btn-success">
            <span class="icon-[material-symbols--home-pin] size-8"></span>
          </div>
          <div class="grow">
            <InputsGenericInput
              input-id="rra-incident-destination"
              input-place-holder="Type to start searching"
              input-label="Towing Destination"
              :input-required="true"
            ></InputsGenericInput>
          </div>
        </div>
      </div>

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
        @value-selected="(id) => (requestData.vehicleClass = id)"
      >
      </InputsGenericInputSearchBox>

      <!-- fuel delivery fuel-type -->
      <template v-if="requestMode == 'fd'">
        <InputsGenericInputSearchBox
          input-id="rra-fuel-type"
          input-label="Fuel Type"
          :input-dropdown-options="fuelType"
          :input-required="true"
          @value-selected="(id) => assignFuelType(id)"
        >
        </InputsGenericInputSearchBox>
      </template>

      <!-- tyre type and if has spare tyre -->
      <template v-if="requestMode == 'tyrec'">
        <div class="grid grid-cols-1 gap-8">
          <!-- tyre type -->
          <InputsGenericInputSearchBox
            input-id="rra-tyre-type"
            input-label="Tyre Type"
            :input-dropdown-options="tyreType"
            :input-required="true"
            @value-selected="(id) => assignTyreType(id)"
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
                    v-model="requestData.hasSpareTyre"
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
                    :value="false"
                    v-model="requestData.hasSpareTyre"
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

      <!-- comment box -->
      <InputsGenericTextArea
        input-id="cal-extra-instructions"
        input-label="Provide Extra Instructions"
        input-place-holder="Write here anything extra you would like us to know. Supports up to 512 characters only!"
        :input-default-row-num="5"
        v-model="requestData.requestRemarks"
      >
      </InputsGenericTextArea>

      <!-- cost estimator -->
      <div class="grid grid-cols-3 gap-8">
        <div class="space-y-2 rounded-lg border border-primary p-4 h-23">
          <h3 class="font-semibold text-lg text-primary">Distance</h3>
          <span class="text-base-content"
            >{{ requestData.appDistance }} KM</span
          >
        </div>
        <div class="space-y-2 rounded-lg border border-primary p-4 h-23">
          <h3 class="font-semibold text-lg text-primary">Free Tow</h3>
          <span class="text-base-content"
            >{{ requestData.currentFreeDistance }} KM</span
          >
        </div>
        <div class="space-y-2 rounded-lg border border-primary p-4 h-23">
          <h3 class="font-semibold text-lg text-primary">Cost</h3>
          <span class="text-base-content">{{ requestData.appCost }} Ksh</span>
        </div>
      </div>

      <InputsGenericSubmitButton
        :button-text="`Submit Request`"
        :submit-loading="submittingRequest"
        class="w-1/3"
      ></InputsGenericSubmitButton>
    </form>
  </div>
</template>
