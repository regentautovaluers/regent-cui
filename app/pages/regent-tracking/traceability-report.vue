<script setup lang="ts">
definePageMeta({
  name: "tracking-traceability-reports",
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
const addCommentLoading = ref(false);
const newVehicleComment = ref("");
const { post } = useStandardizedApi();
const { $showToast } = useNuxtApp();

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

function openAddCommentModal(id: number) {
  // set tracked vehicle
  trackedVehiclesStore.openVehicleId = id;

  // open the modal
  triggerModal();
}

function closeViewVehiclesModal() {
  // close the modal
  triggerModal();
}

async function addVehicleComment() {
  try {
    addCommentLoading.value = true;
    await post("/api/regent-tracking/add-device-comment", {
      id: trackedVehiclesStore.getActiveVehicle?.id,
      comment: newVehicleComment.value,
    });
  } catch (ex) {
    $showToast({
      title: "Success!",
      description: "Comment added!",
      color: "error",
    });
  } finally {
    addCommentLoading.value = false;
  }
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
      :sub-title="`${trackedVehiclesStore.allVehicles.length} Total Vehicles`"
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
            trackedVehiclesStore.allVehicles.map((e) => ({
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
                  <span class="font-semibold">Installed:</span>
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
              <td class="max-w-70 space-y-1">
                <template
                  v-if="device.comment && device.comment.length"
                  v-for="c in device.comment.slice(0, 2)"
                >
                  <div
                    class="text-base-content p-2 flex flex-col items-start min-h-15 text-wrap h-fit badge badge-soft badge-info rounded-lg"
                  >
                    <h4 class="font-bold text-sm">{{ c.username }}</h4>
                    <p class="text-start text-xs">{{ c.comment }}</p>
                  </div>
                </template>
                <p
                  v-else
                  class="badge badge-soft badge-info rounded-lg text-base-content h-10"
                >
                  No Comment for this device
                </p>
              </td>
              <td>
                <button
                  class="btn btn-soft btn-primary"
                  tye="button"
                  @click="openAddCommentModal(device.id)"
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

  <Teleport to="#modal-body">
    <div class="w-screen h-screen flex items-center justify-center">
      <div class="w-1/3 h-2/3 card flex flex-col overflow-clip">
        <div class="flex items-center justify-between p-4 h-18 any-border-b">
          <div class="flex space-x-2">
            <div class="size-12 badge badge-soft badge-primary">
              <span class="icon-[material-symbols--chat] size-8"></span>
            </div>
            <div>
              <h3 class="font-bold">Add Your Comment</h3>
              <span class="text-sm"
                >Vehicle {{ trackedVehiclesStore.getActiveVehicle?.name }}</span
              >
            </div>
          </div>
          <button
            type="button"
            class="btn btn-text [--btn-color:#000] size-10"
            aria-label="Soft Icon Button"
            @click="closeViewVehiclesModal()"
          >
            <span
              class="icon-[material-symbols--close-rounded] size-6 shrink-0 text-base-content"
            ></span>
          </button>
        </div>
        <form class="flex flex-col grow" @submit.prevent="addVehicleComment">
          <div class="grow">
            <div class="h-fit p-3 bg-secondary/10 rounded-lg m-4">
              <h4 class="font-bold mb-2">Vehicle Information</h4>
              <div class="grid gap-4 grid-cols-2">
                <!-- registration -->
                <div class="flex flex-col">
                  <p class="inline-flex items-center space-x-2">
                    <span
                      class="icon-[material-symbols--barcode] size-5"
                    ></span>
                    <span>Registration</span>
                  </p>
                  <span class="font-semibold">{{
                    trackedVehiclesStore.getActiveVehicle?.name ?? "-"
                  }}</span>
                </div>

                <!-- phone number -->
                <div class="flex flex-col">
                  <p class="inline-flex items-center space-x-2">
                    <span
                      class="icon-[material-symbols--phone-forwarded-rounded] size-5"
                    ></span>
                    <span>Phone</span>
                  </p>
                  <span class="font-semibold">{{
                    trackedVehiclesStore.getActiveVehicle?.driver_data.phone ??
                    "-"
                  }}</span>
                </div>

                <!-- client name -->
                <div class="flex flex-col">
                  <p class="inline-flex items-center space-x-2">
                    <span
                      class="icon-[material-symbols--account-circle] size-5"
                    ></span>
                    <span>Client Name</span>
                  </p>
                  <span class="font-semibold">{{
                    trackedVehiclesStore.getActiveVehicle?.driver_data.name ??
                    "-"
                  }}</span>
                </div>

                <!-- status -->
                <div class="flex flex-col">
                  <p class="inline-flex items-center space-x-2">
                    <span
                      class="icon-[material-symbols--android-wifi-3-bar-rounded] size-5"
                    ></span>
                    <span>Status</span>
                  </p>
                  <span
                    :class="[
                      'font-semibold',
                      trackedVehiclesStore.getActiveVehicle?.wrapperStatus ==
                        'Offline' && 'text-warning',
                      trackedVehiclesStore.getActiveVehicle?.wrapperStatus ==
                        'Online' && 'text-success',
                    ]"
                    >{{
                      trackedVehiclesStore.getActiveVehicle?.wrapperStatus ??
                      "-"
                    }}</span
                  >
                </div>
              </div>
            </div>
            <div class="h-fit rounded-lg anyborder grow m-4 overflow-clip">
              <h4 class="font-bold mb-1">Previous Comments</h4>
              <div class="h-33 space-y-1 any-border rounded-lg p-4">
                <template
                  v-if="
                    trackedVehiclesStore.getActiveVehicle?.comment &&
                    trackedVehiclesStore.getActiveVehicle?.comment.length
                  "
                  ><div
                    v-for="c in trackedVehiclesStore.getActiveVehicle?.comment.slice(
                      0,
                      2,
                    )"
                    :key="c.id"
                  >
                    <p class="inline-flex items-center space-x-1 w-1/2">
                      <span class="icon-[material-symbols--account-box]"></span>
                      <span class="font-semibold">{{ c.username }}</span>
                    </p>
                    <p class="text-sm">
                      {{ c.comment }}
                    </p>
                  </div></template
                >
                <h3 v-else>No comment trail available!</h3>
              </div>
            </div>
            <div class="m-4">
              <InputsGenericTextArea
                input-id="cal-extra-instructions"
                input-label="Provide Some Comment"
                input-place-holder="Write here anything extra you would like us to know. Supports up to 256 characters only!"
                :input-default-row-num="4"
                v-model="newVehicleComment"
              >
              </InputsGenericTextArea>
            </div>
          </div>
          <div class="h-20 flex items-center justify-end any-border-t px-4">
            <InputsGenericSubmitButton
              button-text="Save Comment"
              :submit-loading="addCommentLoading"
              class="w-1/3"
            ></InputsGenericSubmitButton>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
