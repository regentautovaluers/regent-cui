<script setup lang="ts">
import { GoogleMap, CustomMarker, Polyline } from "vue3-google-map";
definePageMeta({
  name: "tracking-detailed-analysis-view",
  displayName: "Nesting Area - Detailed Analysis",
});

const {
  customPickCalendarOpen,
  dateRangeForAnalysis,
  nestingAreas,
  deviceMovement,
  loadingDeviceHistory,
  availableTimelines,
  activeSearchTimeline,
  combinedDeviceMovement,
  activeTripPin,
  deriveDateRange,
} = useNestingAnalysis();
const { public: pubConf } = useRuntimeConfig();
const trackedVehiclesStore = useTrackedVehiclesStore();
const activeDeviceReg = ref("");

onMounted(async () => {
  const { query } = useRoute();
  if (query.device) {
    const { registration, id, fromDate, toDate, activeTimeline } = JSON.parse(
      await decompress(base64ToArrayBuffer(query.device as string), "deflate"),
    );

    // set the values that cause the analysis to start loading
    trackedVehiclesStore.openVehicleId = id;
    dateRangeForAnalysis.fromDate = fromDate;
    dateRangeForAnalysis.toDate = toDate;
    activeSearchTimeline.value = activeTimeline as FilterTimelines;

    // then load the other vehicles for searching
    await trackedVehiclesStore.loadTrackedVehicles(true);

    // set active reg
    activeDeviceReg.value = registration;
  }
});
</script>

<template>
  <div class="flex-1 flex flex-col gap-8">
    <!-- top controls -->
    <div class="card block w-full col-span-2 h-fit">
      <div class="gap-0 p-4 flex items-center justify-between any-border-b">
        <div class="space-y-1">
          <h2 class="font-bold text-3xl">Route Visualization</h2>
          <span class="text-sm">Historical Movement And Nesting Analysis</span>
        </div>
        <div class="w-82">
          <InputsGenericInputSearchBox
            input-id="cal-select-side2"
            input-label="Select A Vehicle"
            :input-disabled="trackedVehiclesStore.allVehicles.length == 0"
            :input-data-loading="trackedVehiclesStore.isLoading"
            :input-dropdown-options="
              trackedVehiclesStore.getSumVehicles
                .filter((e) => e.wrapperStatus != 'Expired')
                .map((e) => ({
                  id: e.id,
                  text: `${e.name} - ${e.wrapperStatus?.toString()}`,
                }))
            "
            @value-selected="
              (id: number) => (trackedVehiclesStore.openVehicleId = id)
            "
          >
          </InputsGenericInputSearchBox>
        </div>
      </div>
      <div class="flex p-4 items-center justify-between min-h-25 h-fit">
        <p class="inline-flex items-center space-x-1">
          <span class="icon-[material-symbols--calendar-month] size-5"></span>
          <span class="font-semibold">Analysis Period</span>
        </p>

        <div class="size-fit flex flex-col space-y-4">
          <div class="join">
            <button
              type="button"
              :class="[
                'btn btn-soft join-item h-13 min-w-32 inline-flex items-center space-x-2 any-border',
                t.id == activeSearchTimeline ? 'btn-primary' : 'bg-transparent',
              ]"
              v-for="t in availableTimelines"
              @click="deriveDateRange(t.id)"
              :key="t.id"
            >
              <span
                v-show="t.id == activeSearchTimeline"
                class="size-3 rounded-full bg-primary"
              ></span>
              <span>{{ t.text }}</span>
            </button>
          </div>

          <form v-show="customPickCalendarOpen" class="flex space-x-4">
            <InputsGenericDateInput
              input-id="val-start-date"
              input-wrapper-styles="flex-1"
              input-place-holder="Pick start date"
              input-min-date="last_three_months"
              v-model="dateRangeForAnalysis.fromDate"
            ></InputsGenericDateInput>
            <InputsGenericDateInput
              input-id="val-end-date"
              input-wrapper-styles="flex-1"
              input-place-holder="Pick end date"
              input-min-date="last_three_months"
              v-model="dateRangeForAnalysis.toDate"
            ></InputsGenericDateInput>
          </form>
        </div>
      </div>
    </div>

    <!-- stats card -->
    <div class="w-full col-span-2 h-fit grid gap-8 grid-cols-4">
      <div class="card h-32 overflow-clip">
        <div class="size-full p-6 flex items-center justify-between">
          <div class="grow">
            <h1 class="text-lg">Registration</h1>
            <h3 class="inline-flex flex-col mt-1">
              <span class="font-semibold text-xl">{{
                trackedVehiclesStore.getActiveVehicle?.name ?? activeDeviceReg
              }}</span>
              <span class="text-sm">Currently Being Viewed</span>
            </h3>
          </div>
          <div class="size-16 btn btn-info btn-soft">
            <span class="icon-[material-symbols--bus-map-pin] size-7"></span>
          </div>
        </div>
      </div>
      <div class="card h-32 overflow-clip">
        <div class="size-full p-6 flex items-center justify-between">
          <div class="grow">
            <h1 class="text-lg">Total Trips</h1>
            <h3 class="inline-flex flex-col mt-1">
              <span class="font-semibold text-xl">{{
                deviceMovement.reduce(
                  (accum, curr) => accum + curr.totalTrips,
                  0,
                )
              }}</span>
              <span class="text-sm text-success">Over this Time Period</span>
            </h3>
          </div>
          <div class="size-16 btn btn-success btn-soft">
            <span class="icon-[material-symbols--route-outline] size-7"></span>
          </div>
        </div>
      </div>
      <div class="card h-32 overflow-clip">
        <div class="size-full p-6 flex items-center justify-between">
          <div class="grow">
            <h1 class="text-lg">Total Distance</h1>
            <h3 class="inline-flex flex-col mt-1">
              <span class="font-semibold text-xl"
                >{{
                  Math.trunc(
                    deviceMovement.reduce(
                      (accum, curr) => accum + curr.cummTotalDistance,
                      0,
                    ),
                  )
                }}Km</span
              >
              <span class="text-sm">Over this Time Period</span>
            </h3>
          </div>
          <div class="size-16 btn btn-primary btn-soft">
            <span class="icon-[material-symbols--route-outline] size-7"></span>
          </div>
        </div>
      </div>
      <div class="card h-32 overflow-clip">
        <div class="size-full p-6 flex items-center justify-between">
          <div class="grow">
            <h1 class="text-lg">Total Stops</h1>
            <h3 class="inline-flex flex-col mt-1">
              <span class="font-semibold text-xl">{{
                deviceMovement.reduce(
                  (accum, curr) => accum + curr.totalTrips,
                  0,
                )
              }}</span>
              <span class="text-sm text-error">Over this Time Period</span>
            </h3>
          </div>
          <div class="size-16 btn btn-error btn-soft">
            <span
              class="icon-[material-symbols--stop-circle-outline] size-7"
            ></span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-8 items-stretch"
    >
      <NestingAreaCard
        custom-class="h-210 max-h-210"
        title="Nesting Area Prediction"
        sub-title="Locations where vehicle spent most idle time"
        ><template #with-pad>
          <!-- when loading -->
          <template v-if="loadingDeviceHistory">
            <SkeletonsTrackedVehicleNestingAreaCardSkeleton
              v-for="a in 6"
              :key="a"
            ></SkeletonsTrackedVehicleNestingAreaCardSkeleton>
          </template>

          <!-- when there nothing -->
          <h1 v-else-if="!loadingDeviceHistory && nestingAreas.length < 1">
            Nothing to show! Select a timeline to trigger computations.
          </h1>

          <!-- when there is something -->
          <template v-else>
            <TrackedVehicleNestingAreaCard
              v-for="(e, idx) in nestingAreas"
              :key="idx"
              :idx="idx"
              :time-spent="e.location_time_hours"
              :time-spent-frac="e.location_time_hours_fraction"
              :visit-times="e.appearances"
              :ordinates="{
                lat: e.representative_lat,
                lng: e.representative_lng,
              }"
            ></TrackedVehicleNestingAreaCard> </template></template
      ></NestingAreaCard>
      <div class="h-210 max-h-210 card">
        <div class="flex flex-col size-full">
          <div class="p-4 space-y-1 any-border-b h-21">
            <h3 class="font-semibold text-lg">Route Visualization</h3>
            <h4 class="text-sm">Selected trip route details</h4>
          </div>
          <div class="p-4 any-border-b h-20 flex space-x-4 items-center">
            <p class="inline-flex items-center space-x-1">
              <span class="size-4 bg-success rounded-full"></span>
              <span>Trip Start</span>
            </p>
            <p class="inline-flex items-center space-x-1">
              <span class="size-4 bg-error rounded-full"></span>
              <span>Trip Stop</span>
            </p>
            <p class="inline-flex items-center space-x-1">
              <span class="size-4 bg-primary rounded-full"></span>
              <span>Trip Route</span>
            </p>
            <p class="inline-flex items-center space-x-1">
              <span class="size-4 bg-pink-500 rounded-full"></span>
              <span>Active Trip Route</span>
            </p>
          </div>
          <div class="grow flex flex-col p-4">
            <div class="h-25 flex items-center space-x-16">
              <p class="inline-flex flex-col">
                <span>Trip Date</span>
                <span class="text-lg font-semibold">{{
                  activeTripPin?.tripDate ?? "-"
                }}</span>
              </p>
              <p class="inline-flex flex-col">
                <span>Trip Duration</span>
                <span class="text-lg font-semibold">{{
                  activeTripPin?.tripDuration ?? "-"
                }}</span>
              </p>
              <p class="inline-flex flex-col">
                <span>Distance Covered</span>
                <span class="text-lg font-semibold"
                  >{{ activeTripPin?.distanceCovered ?? "-" }}Km</span
                >
              </p>
            </div>
            <div class="grow rounded-lg overflow-clip any-border">
              <GoogleMap
                ref="mapRef"
                :api-key="pubConf.GOOGLE_MAPS_API_KEY"
                :styles="googleMapStyle"
                :center="{ lat: -1.2687054, lng: 36.8069326 }"
                style="width: 100%; height: 100%"
                :map-type-control="false"
                :zoom="13"
                :zoom-control="true"
                :fullscreen-control="false"
                :street-view-control="false"
                ><!-- our head office -->
                <CustomMarker
                  :options="{
                    position: {
                      lat: -1.2685284532098227,
                      lng: 36.80946458168313,
                    },
                    anchorPoint: 'BOTTOM_CENTER',
                  }"
                >
                  <div class="myloc-box any-border text-center">
                    <h3 class="text-base font-semibold">Our Head Office</h3>
                    <span>TRV Plaza, Muthithi Road</span>
                  </div>
                </CustomMarker>

                <!-- info for active trip -->
                <template v-if="activeTripPin">
                  <!-- start marker -->
                  <CustomMarker
                    :options="{
                      position: {
                        lat: activeTripPin.startPin.lat,
                        lng: activeTripPin.startPin.lng,
                      },
                      anchorPoint: 'BOTTOM_CENTER',
                    }"
                  >
                    <div class="myloc-box any-border">
                      <h3
                        class="any-border-b w-full h-12 p-3 text-base font-semibold inline-flex items-center space-x-2"
                      >
                        <span class="inline-flex items-center space-x-1">
                          <span class="size-4 bg-success rounded-full"></span>
                          <span>Trip Start</span></span
                        >
                        <span>&middot;</span>
                        <span>{{
                          trackedVehiclesStore.getActiveVehicle!.name ??
                          activeDeviceReg
                        }}</span>
                      </h3>
                      <div
                        class="grid grid-cols-[30%_70%] gap-y-4 text-base p-3"
                      >
                        <span class="font-semibold text-start">Location</span>
                        <span class="text-sm text-end">{{
                          activeTripPin.startPin.name
                        }}</span>
                        <span class="font-semibold text-start">Lat</span>
                        <span class="text-sm text-end">{{
                          activeTripPin.startPin.lat
                        }}</span>
                        <span class="font-semibold text-start">Lng</span>
                        <span class="text-sm text-end">{{
                          activeTripPin.startPin.lng
                        }}</span>
                        <span class="font-semibold text-start">Time</span>
                        <span class="text-sm text-end">{{
                          activeTripPin.startPin.time
                        }}</span>
                        <span class="font-semibold text-start">Event</span>
                        <span class="text-sm text-end">Start of Trip</span>
                      </div>
                    </div>
                  </CustomMarker>

                  <!-- stop marker -->
                  <CustomMarker
                    :options="{
                      position: {
                        lat: activeTripPin.stopPin.lat,
                        lng: activeTripPin.stopPin.lng,
                      },
                      anchorPoint: 'BOTTOM_CENTER',
                    }"
                  >
                    <div class="myloc-box any-border">
                      <h3
                        class="any-border-b w-full h-12 p-3 text-base font-semibold inline-flex items-center space-x-2"
                      >
                        <span class="inline-flex items-center space-x-1">
                          <span class="size-4 bg-error rounded-full"></span>
                          <span>Trip Stop</span></span
                        >
                        <span>&middot;</span>
                        <span>{{
                          trackedVehiclesStore.getActiveVehicle!.name ??
                          activeDeviceReg
                        }}</span>
                      </h3>
                      <div
                        class="grid grid-cols-[30%_70%] gap-y-4 text-base p-3"
                      >
                        <span class="font-semibold text-start">Location</span>
                        <span class="text-sm text-end">{{
                          activeTripPin.stopPin.name
                        }}</span>
                        <span class="font-semibold text-start">Lat</span>
                        <span class="text-sm text-end">{{
                          activeTripPin.stopPin.lat
                        }}</span>
                        <span class="font-semibold text-start">Lng</span>
                        <span class="text-sm text-end">{{
                          activeTripPin.stopPin.lng
                        }}</span>
                        <span class="font-semibold text-start">Time</span>
                        <span class="text-sm text-end">{{
                          activeTripPin.stopPin.time
                        }}</span>
                        <span class="font-semibold text-start">Event</span>
                        <span class="text-sm text-end">Stop of Trip</span>
                      </div>
                    </div>
                  </CustomMarker>

                  <!-- polyline for active trip -->
                  <Polyline
                    :options="{
                      path: activeTripPin.routePins,
                      geodesic: true,
                      strokeColor: '#e60076',
                      strokeOpacity: 1.0,
                      strokeWeight: 5,
                    }"
                  />
                </template>

                <!-- general device movement -->
                <template v-if="combinedDeviceMovement">
                  <Polyline
                    :options="{
                      path: combinedDeviceMovement,
                      geodesic: true,
                      strokeColor: '#155dfc',
                      strokeOpacity: 0.8,
                      strokeWeight: 10,
                    }"
                /></template>
              </GoogleMap>
            </div>
          </div>
        </div>
      </div>

      <NestingAreaCard
        custom-class="h-210 max-h-210"
        title="Trip History"
        sub-title="'Start' the start of a trip, and 'Stop' marks the end of the trip."
      >
        <!-- when loading -->
        <template v-if="loadingDeviceHistory">
          <SkeletonsTrackedVehicleNestingTripsCardSkeleton
            v-for="a in 6"
            :key="a"
          ></SkeletonsTrackedVehicleNestingTripsCardSkeleton>
        </template>

        <!-- when there nothing -->
        <h1 v-else-if="!loadingDeviceHistory && nestingAreas.length < 1">
          Nothing to show! Select a timeline to trigger computations.
        </h1>

        <!-- when there is something -->
        <template v-else>
          <TrackedVehicleNestingTripsCard
            v-for="(e, idx) in deviceMovement"
            :key="idx"
            :event-date="e.date"
            :movement="e.movement"
            @show-pin-clicked="(pin) => (activeTripPin = pin)"
          ></TrackedVehicleNestingTripsCard>
        </template>
      </NestingAreaCard>
    </div>
  </div>
</template>
