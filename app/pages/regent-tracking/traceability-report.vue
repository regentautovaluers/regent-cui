<script setup lang="ts">
definePageMeta({
  name: "tracking-traceability-reports",
  layout: "ava-tables",
  displayName: "Regent Tracking - Traceability Report",
});

const availableStatuses: { id: number; text: TrackerStatusWrapperName }[] = [
  {
    id: 0,
    text: "Online",
  },
  {
    id: 1,
    text: "Offline",
  },
  {
    id: 2,
    text: "Expired",
  },
];

const page: Ref<number> = ref(0);
const trackedVehiclesStore = useTrackedVehiclesStore();
const { public: pubConf } = useRuntimeConfig();
const { triggerModal } = useModal();

const computedVehicles: ComputedRef<{
  vehicles: TrackedVehicles[] | null;
  totalPages: number;
}> = computed(() => {
  const start = page.value * Number(pubConf.PAGE_SIZE);
  return {
    vehicles: trackedVehiclesStore.getSumVehicles.slice(
      start,
      start + Number(pubConf.PAGE_SIZE),
    ) as TrackedVehicles[],
    totalPages:
      Math.ceil(
        trackedVehiclesStore.getSumVehicles.length / Number(pubConf.PAGE_SIZE),
      ) || 1,
  };
});

const totalPages = computed(
  () =>
    Math.ceil(
      trackedVehiclesStore.getSumVehicles.length / Number(pubConf.PAGE_SIZE),
    ) || 1,
);

const computedStatistics: ComputedRef<{
  total_online: number;
  total_offline: number;
  total_expired: number;
  new_installations: number;
  expires_soon: number;
  total_devices: number;
  total_on_watchlist: number;
  dist: {
    online_dist: number;
    offline_dist: number;
  };
}> = computed(() => {
  if (!trackedVehiclesStore.allVehicles.length) {
    return {
      total_online: 0,
      total_offline: 0,
      total_expired: 0,
      new_installations: 0,
      expires_soon: 0,
      total_devices: 0,
      total_on_watchlist: 0,
      dist: {
        online_dist: 0,
        offline_dist: 0,
      },
    };
  } else {
    const stats = trackedVehiclesStore.allVehicles.reduce(
      (acc, v) => ({
        total_online:
          acc.total_online +
          (["ack", "engine", "online"].includes(v.online) ? 1 : 0),
        total_offline: acc.total_offline + (v.online == "offline" ? 1 : 0),
        total_expired: acc.total_expired + (v.online == "expired" ? 1 : 0),
        new_installations:
          acc.new_installations +
          (isLastMonth(v.device_data.created_at) ? 1 : 0),
        expires_soon:
          acc.expires_soon +
          (!v.device_data.expiration_date
            ? 0
            : expiresWithinXDays(v.device_data.expiration_date, 30)
              ? 1
              : 0),
        total_devices: acc.total_devices + 1,
        total_on_watchlist: acc.total_on_watchlist + (v.on_watchlist ? 1 : 0),
        dist: {
          online_dist: 0,
          offline_dist: 0,
        },
      }),
      {
        total_online: 0,
        total_offline: 0,
        total_expired: 0,
        new_installations: 0,
        expires_soon: 0,
        total_devices: 0,
        total_on_watchlist: 0,
        dist: {
          online_dist: 0,
          offline_dist: 0,
        },
      },
    );

    stats.dist = {
      online_dist: deriveDistribution(stats.total_online, stats.total_offline),
      offline_dist: deriveDistribution(stats.total_offline, stats.total_online),
    };
    return stats;
  }
});

function deriveDistribution(a: number, b: number): number {
  const total = a + b;
  return Number(((a * 100) / total).toFixed(2));
}

onMounted(async () => {
  await trackedVehiclesStore.loadTrackedVehicles(true);
});
</script>

<template>
  <div class="flex-1 flex flex-col gap-8">
    <!-- top controls -->
    <div class="card block w-full col-span-2 h-fit">
      <div class="gap-0 p-4 flex items-center justify-between">
        <div class="space-y-1">
          <h2 class="font-bold text-3xl">Traceability Report</h2>
          <span class="text-sm">Real-time Vehicle Status &amp; Monitoring</span>
        </div>
        <form>
          <InputsGenericSubmitButton
            button-text="Export Excel"
            :submit-loading="false"
          ></InputsGenericSubmitButton>
        </form>
      </div>
    </div>

    <NestingAreaCard
      title="All Vehicles"
      :sub-title="`${trackedVehiclesStore.getSumVehicles.length} Total Vehicles`"
      custom-class="min-h-250"
      :allow-scroll="false"
    >
      <form
        class="any-border-b h-25 flex items-center justify-between space-x-4 p-4"
      >
        <InputsGenericInputSearchBox
          input-id="cal-registration-number"
          input-place-holder="Search Registration"
          :input-disabled="trackedVehiclesStore.allVehicles.length == 0"
          input-wrapper-styles="w-100"
          :input-dropdown-options="
            trackedVehiclesStore.getSumVehicles.map((e) => ({
              id: e.name,
              text: `${e.name} - ${e.wrapperStatus?.toString()}`,
            }))
          "
          @value-selected="(id) => (trackedVehiclesStore.searchRegNo = id)"
          @clear-option-triggered="trackedVehiclesStore.searchRegNo == ''"
        ></InputsGenericInputSearchBox>

        <div class="w-100">
          <InputsGenericInputSearchBox
            input-id="cal-select-side2"
            :input-disabled="trackedVehiclesStore.allVehicles.length == 0"
            :input-data-loading="trackedVehiclesStore.isLoading"
            input-place-holder="Select A Status"
            :input-dropdown-options="availableStatuses"
            @value-selected="
              (id: number) => (trackedVehiclesStore.openVehicleId = id)
            "
          >
          </InputsGenericInputSearchBox>
        </div>
      </form>
      <template #with-pad>
        <div class="grow">
          <GenericTable
            :headers="[
              'Reg No',
              'Client Details',
              'Subscription',
              'Last Signal',
              'Status',
              'Notes',
            ]"
            :dataLoading="trackedVehiclesStore.isLoading"
          >
            <tr v-for="device in computedVehicles.vehicles" :key="device.id">
              <td class="font-semibold">{{ device.name }}</td>
              <td class="space-y-2">
                <div class="flex items-center space-x-1 w-fit">
                  <span
                    class="icon-[material-symbols--account-box] size-5"
                  ></span>
                  <span>{{ device.driver_data?.name ?? "Name N/A" }}</span>
                </div>
                <div class="flex items-center space-x-1 w-fit">
                  <span
                    class="icon-[material-symbols--phone-enabled-sharp] size-5"
                  ></span>
                  <span> {{ device.driver_data?.phone ?? "Phone N/A" }}</span>
                </div>
              </td>
              <td class="space-y-2">
                <div class="flex items-center space-x-1 w-fit">
                  <span class="font-semibold">Installed On:</span>
                  <span>{{
                    !device.device_data.created_at
                      ? "Name N/A"
                      : extractDate(
                          device.device_data.created_at.replace(" ", "T"),
                        )
                  }}</span>
                </div>
                <div class="flex items-center space-x-1 w-fit">
                  <span class="font-semibold">Expires:</span>
                  <span>
                    {{
                      !device.device_data.expiration_date
                        ? "Name N/A"
                        : extractDate(
                            device.device_data.expiration_date.replace(
                              " ",
                              "T",
                            ),
                          )
                    }}</span
                  >
                </div>
              </td>
              <td class="font-semibold">
                {{ device.device_data.traccar.ack_time }}
              </td>
              <td>
                <div class="flex items-center space-x-2">
                  <span
                    :class="[
                      'icon-[material-symbols--android-wifi-4-bar-rounded] size-5',
                      device.wrapperStatus == 'Online' && 'bg-success',
                      device.wrapperStatus == 'Offline' && 'bg-warning',
                      device.wrapperStatus == 'Expired' && 'bg-error',
                    ]"
                  ></span>
                  <div
                    :class="[
                      'w-fit badge badge-soft rounded-full',
                      device.wrapperStatus == 'Online' && 'badge-success',
                      device.wrapperStatus == 'Offline' && 'badge-warning',
                      device.wrapperStatus == 'Expired' && 'badge-error',
                    ]"
                  >
                    {{ device.wrapperStatus }}
                  </div>
                </div>
              </td>
              <td>
                <div class="h-full space-y-1">
                  <template
                    v-if="device.comment && device.comment.length"
                    v-for="c in device.comment.slice(0, 2)"
                  >
                    <p
                      class="inline-flex flex-col space-y-1 badge badge-soft badge-info rounded-lg"
                    >
                      <span class="font-semibold">{{ c.username }}</span>
                      <span>{{ c.comment }}</span>
                    </p>
                  </template>
                  <p v-else class="badge badge-soft badge-info rounded-lg">
                    No Comment for this device
                  </p>
                </div>
              </td>
              <td>
                <button
                  class="btn btn-soft btn-primary"
                  tye="button"
                  @click="triggerModal()"
                >
                  <span
                    class="icon-[material-symbols--add-comment-rounded]"
                  ></span
                  >Add Comment
                </button>
              </td>
            </tr>
          </GenericTable>
        </div></template
      >
    </NestingAreaCard>
  </div>
</template>
