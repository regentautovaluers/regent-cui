<script setup lang="ts">
import {
  GoogleMap,
  Polyline,
  CustomMarker,
  MarkerCluster,
} from "vue3-google-map";

type DeviceCommands = "start" | "stop";

definePageMeta({
  name: "tracking-home",
  layout: "tracking",
});

const { public: publicConf } = useRuntimeConfig();
const { post } = useStandardizedApi();
const mapRef: Ref<any> = ref(null);
const markerCluster: Ref<any> = ref(null);
const activeVehicle: Ref<any> = ref(null);
const trackedVehiclesStore = useTrackedVehiclesStore();
const principalStore = usePrincipalStore();
const authToken = useCookie<string | null>("tracking_auth_token");
const startDeviceCommandLoading = ref(false);
const stopDeviceCommandLoading = ref(false);

/**
 * Executes boot flow: Initial snapshot -> Route check -> Start SSE
 */
async function bootTrackingFlow() {
  if (!authToken.value) return;

  // 1. Load initial REST snapshot
  await trackedVehiclesStore.loadTrackedVehicles(true);

  // 2. Enable live stream
  trackedVehiclesStore.initializeFrequentUpdateSSE();
}

async function triggerDeviceCommand(commandType: DeviceCommands) {
  const url = `/api/regent-tracking/publish-command?api_hash=${authToken.value}&type=${commandType == "stop" ? "engineStop" : "engineResume"}&message=${commandType == "stop" ? "Engine Stop" : "Engine Resume"}&device_id=${trackedVehiclesStore.getActiveVehicle!.id}`;
  try {
    if (commandType == "start") {
      startDeviceCommandLoading.value = true;
    } else if (commandType == "stop") {
      stopDeviceCommandLoading.value = true;
    }

    const response = await post<StandardResponse>(url);
    if (response.success) {
      // TODO: Show toast message here
    }
  } catch (err: any) {
    // TODO: Show toast message here
  } finally {
    startDeviceCommandLoading.value = false;
    stopDeviceCommandLoading.value = false;
  }
}

// Reactively start boot flow when token is ready or available
watch(
  authToken,
  () => {
    if (import.meta.client) {
      bootTrackingFlow();
    }
  },
  { immediate: true },
);

// Clean up SSE connection when component unmounts or user navigates away
onUnmounted(() => {
  if (import.meta.client) {
    trackedVehiclesStore.stopSSEUpdates();
  }
});
</script>

<template>
  <div class="relative flex-1 w-full min-h-screen">
    <!-- side panel -->
    <div
      class="absolute top-24 left-4 z-20 h-[90%] flex shadow-md border rounded-sm border-accent-content bg-base-100"
    >
      <div class="w-120 flex flex-col p-4 space-y-4 min-h-full">
        <h1 class="text-base-content font-semibold">
          {{ principalStore.corpName }} Fleet
        </h1>
        <h2 class="inline-flex justify-between">
          <span class="inline-flex items-center space-x-2">
            <span class="font-bold">{{
              trackedVehiclesStore.allVehicles.length
            }}</span>
            <span>Total Vehicles</span>
          </span>
          <span class="inline-flex items-center space-x-2">
            <span class="size-4 bg-success rounded-full"></span>
            <span>Online</span>
          </span>
          <span class="inline-flex items-center space-x-2">
            <span class="size-4 bg-warning rounded-full"></span>
            <span>Offline</span>
          </span>
          <span class="inline-flex items-center space-x-2">
            <span class="size-4 bg-error rounded-full"></span>
            <span>Expired</span>
          </span>
        </h2>
        <form class="h-fit space-y-2" @submit.prevent="() => {}">
          <InputsGenericInput
            input-id="search-vehicles"
            input-place-holder="search registration here"
            :model-value="trackedVehiclesStore.searchRegNo"
          ></InputsGenericInput>
          <div class="join flex">
            <button
              class="btn btn-soft btn-primary join-item flex-1"
              type="button"
              @click="() => (trackedVehiclesStore.activeView = null)"
            >
              All Vehicles
            </button>
            <button
              class="btn btn-soft btn-primary join-item flex-1"
              type="button"
              @click="() => (trackedVehiclesStore.activeView = 'Online')"
            >
              Online
            </button>
            <button
              class="btn btn-soft btn-primary join-item flex-1"
              type="button"
              @click="() => (trackedVehiclesStore.activeView = 'Offline')"
            >
              Offline
            </button>

            <button
              class="btn btn-soft btn-primary join-item flex-1"
              type="button"
              @click="() => (trackedVehiclesStore.activeView = 'Expired')"
            >
              Expired
            </button>
          </div>
        </form>
        <div class="grow overflow-y-auto thin-scrollbar space-y-5">
          <template v-if="trackedVehiclesStore.isLoading">
            <SkeletonsTrackedVehicleCardSkeleton
              v-for="a in 12"
              :key="a"
            ></SkeletonsTrackedVehicleCardSkeleton>
          </template>

          <template
            ref="infiniScrollEl"
            v-else-if="
              !trackedVehiclesStore.isLoading &&
              trackedVehiclesStore.allVehicles.length > 0 &&
              trackedVehiclesStore.getSumVehicles
            "
          >
            <TrackedVehicleCard
              v-for="e in trackedVehiclesStore.getSumVehicles"
              :id="e.id"
              :reg-no="e.name"
              :driver-name="e.driver_data.name || 'Name N/A'"
              :device-time="e.time"
              :device-expiration-date="e.device_data.expiration_date"
              :device-speed="e.speed"
              :units-of-speed="e.distance_unit_hour"
              :wrapped-status="e.wrapperStatus!"
              @vehicle-open-request="
                (id) => (trackedVehiclesStore.openVehicleId = id)
              "
            ></TrackedVehicleCard>
          </template>
        </div>
      </div>
      <div
        class="w-105 min-h-full flex flex-col p-4 space-y-5.5 border-l border-l-base-content/25"
        v-if="
          trackedVehiclesStore.openVehicleId &&
          trackedVehiclesStore.getActiveVehicle
        "
      >
        <div class="flex justify-between items-center">
          <h3 class="inline-flex flex-col">
            <span class="font-bold">{{
              trackedVehiclesStore.getActiveVehicle!.name
            }}</span>
            <span class="text-base-content"
              >Updated -
              {{
                trackedVehiclesStore.lastUpdateTime &&
                getTimeAgo(trackedVehiclesStore.lastUpdateTime)
              }}</span
            >
          </h3>
          <button
            class="size-10 rounded-lg btn-square border border-base-content/50 inline-flex items-center justify-center"
            type="button"
            @click="() => (trackedVehiclesStore.openVehicleId = null)"
          >
            <span class="icon-[material-symbols--close-rounded] size-5"></span>
          </button>
        </div>

        <TrackedVehicleStatus
          :device-speed="trackedVehiclesStore.getActiveVehicle!.speed"
          :units-of-speed="
            trackedVehiclesStore.getActiveVehicle!.distance_unit_hour
          "
          :wrapped-online-status="
            trackedVehiclesStore.getActiveVehicle!.wrapperStatus!
          "
        ></TrackedVehicleStatus>

        <div class="join flex">
          <button
            class="btn btn-soft btn-primary join-item flex-1"
            type="button"
          >
            Details
          </button>
          <button
            class="btn btn-soft btn-primary join-item flex-1"
            type="button"
          >
            History
          </button>
        </div>

        <div
          class="border border-base-content/50 grid grid-cols-[30%_auto] p-4 py-5 rounded-lg gap-y-4 shadow-md"
        >
          <div class="col-span-2">
            <h3 class="text-base-content text-xl font-bold">
              Vehicle Information
            </h3>
          </div>
          <div
            class="p-2 rounded-lg col-span-2 bg-success-content border border-success"
          >
            <div class="flex items-center justify-between">
              <h4 class="text-base-content font-semibold text-lg">Location</h4>
              <button></button>
            </div>
            <p>Location information here!!</p>
          </div>
          <template
            v-for="e in trackedVehiclesStore.getVehicleMetadata"
            :key="e.name"
          >
            <div class="flex space-x-1 items-center border-r px-1">
              <span :class="[e.icon, 'size-5']"></span>
              <span>{{ e.name }}</span>
            </div>
            <p class="px-2">
              {{ e.data }}
            </p>
          </template>
        </div>

        <div
          class="border border-base-content/50 grid grid-cols-2 p-4 py-5 rounded-lg gap-4 shadow-md"
        >
          <div class="col-span-2">
            <h3 class="text-base-content text-xl font-bold">
              Vehicle Commands
            </h3>
          </div>
          <InputsGenericSubmitButton
            id="vc-stop-engine"
            icon="icon-[material-symbols--stop-circle-outline-rounded]"
            button-text="Stop Engine"
            button-mode="btn-error"
            button-type="button"
            emit-with-value="stop"
            :submit-loading="stopDeviceCommandLoading"
            @button-clicked="
              (command: DeviceCommands) => triggerDeviceCommand(command)
            "
          >
          </InputsGenericSubmitButton>
          <InputsGenericSubmitButton
            id="vc-stop-engine"
            icon="icon-[material-symbols--not-started-rounded]"
            button-text="Start Engine"
            button-mode="btn-success"
            button-type="button"
            emit-with-value="start"
            :submit-loading="startDeviceCommandLoading"
            @button-clicked="
              (command: DeviceCommands) => triggerDeviceCommand(command)
            "
          >
          </InputsGenericSubmitButton>
        </div>
      </div>
    </div>

    <!-- the map -->
    <GoogleMap
      ref="mapRef"
      :api-key="publicConf.GOOGLE_MAPS_API_KEY"
      :styles="googleMapStyle"
      style="width: 100%; height: 100%; position: absolute"
      :map-type-control="true"
      :zoom-control="true"
      :fullscreen-control="false"
      :street-view-control="true"
    >
    </GoogleMap>
  </div>
</template>
