<script setup lang="ts">
definePageMeta({
  name: "valuations-mobi-reports",
  displayName: "Legacy Mobi Reports",
});

const config = useRuntimeConfig();
const { triggerModal } = useModal();
const page = ref(0);
const formFilters = reactive({
  startDate: "" as string,
  endDate: "" as string,
  searchTerm: "" as string,
});
const activeFilters = reactive({
  startDate: "" as string,
  endDate: "" as string,
  searchTerm: "" as string,
});
const activeLegacyReport = ref<LegacyValuation | null>(null);
const query = computed(() => ({
  size: config.public.PAGE_SIZE,
  page: page.value,
  ...activeFilters,
}));
const { data, status, refresh } = useApiData<
  GenericResponse<LegacyValuation[]>
>(
  computed(() => `api-mobi-valuations-${JSON.stringify(toValue(query))}`),
  "/api/vehicle-valuation/get-legacy-reports",
  {
    query,
    lazy: false,
    // Keep previous data visible while fetching the next page for seamless UX
    dedupe: "defer",
  },
);
const paginationInfo = computed(() => ({
  totalPages: data.value?.requestExtras?.totalPages || 1,
  totalItems: data.value?.requestExtras?.totalItems || 0,
  currentPage: data.value?.requestExtras?.currentPage || 0,
}));
function handlePageChange(newPage: number) {
  const maxPages = paginationInfo.value.totalPages;
  if (newPage >= 0 && newPage < maxPages) {
    page.value = newPage;
  }
}
function applyFilters() {
  // Copy form values into active filters
  Object.assign(activeFilters, formFilters);

  // Reset pagination to first page
  page.value = 0;

  // manually trigger the refresh
  refresh();
}
function resetFilters() {
  // Reset form filters to defaults
  formFilters.startDate = "";
  formFilters.endDate = "";

  // Copy defaults into active filters
  applyFilters();
}
function closeViewMoreModal() {
  // close the modal
  triggerModal();

  // after some time clear the storage
  setTimeout(
    () =>
      // remove holded legacy report
      (activeLegacyReport.value = null),
    200, //ms
  );
}
function cleanAwardedValues(
  values: LegacyVehicleValue | undefined,
): { name: string; id: number; value: string }[] | null {
  if (!values) {
    return null;
  }

  const cleanedValues: { name: string; id: number; value: string }[] = [];
  if (
    values.market_value != null &&
    values.market_value != "" &&
    values.market_value != "0"
  ) {
    cleanedValues.push({
      name: "Market Value",
      id: 0,
      value: values.market_value,
    });
  }

  if (
    values.assessed_value != null &&
    values.assessed_value != "" &&
    values.assessed_value != "0"
  ) {
    cleanedValues.push({
      name: "Assessed Value",
      id: 1,
      value: values.assessed_value,
    });
  }

  if (
    values.forced_sale_value != null &&
    values.forced_sale_value != "" &&
    values.forced_sale_value != "0"
  ) {
    cleanedValues.push({
      name: "Forced Sale Value",
      id: 2,
      value: values.forced_sale_value,
    });
  }

  if (
    values.windscreen_value != null &&
    values.windscreen_value != "" &&
    values.windscreen_value != "0"
  ) {
    cleanedValues.push({
      name: "Windscreen Value",
      id: 3,
      value: values.windscreen_value,
    });
  }

  if (
    values.radio_value != null &&
    values.radio_value != "" &&
    values.radio_value != "0"
  ) {
    cleanedValues.push({
      name: "Radio Value",
      id: 4,
      value: values.radio_value,
    });
  }

  if (
    values.auction_value != null &&
    values.auction_value != "" &&
    values.auction_value != "0"
  ) {
    cleanedValues.push({
      name: "Auction Value",
      id: 5,
      value: values.auction_value,
    });
  }

  return cleanedValues;
}
function openViewMoreModal(report: LegacyValuation) {
  activeLegacyReport.value = report;

  // open the modal
  triggerModal();
}
</script>

<template>
  <div class="flex-1 flex flex-col">
    <GenericTableFilters
      :disable-filters="status === 'pending'"
      :disable-submit-button="status == 'pending'"
      v-model="formFilters.searchTerm"
      @reset-filters="resetFilters()"
      @execute-filters="applyFilters()"
      ><InputsGenericDateInput
        input-id="val-start-date"
        input-label="Start Period"
        input-wrapper-styles="flex-1"
        input-place-holder="Select a start date"
        v-model="formFilters.startDate"
      ></InputsGenericDateInput>
      <InputsGenericDateInput
        input-id="val-end-date"
        input-label="End Period"
        input-wrapper-styles="flex-1"
        input-place-holder="Select an end date"
        v-model="formFilters.endDate"
      ></InputsGenericDateInput
    ></GenericTableFilters>

    <template v-if="data?.data?.length">
      <GrowableCard :show-padding="false">
        <template #no-padding>
          <GenericTable
            :headers="[
              'Reg',
              'Report Timeline',
              'Location',
              'Vehicle Info',
              'Regent Branch',
              'Assessed Value',
              'Note',
              '',
            ]"
            :dataLoading="status == 'pending'"
          >
            <tr v-for="booking in data.data" :key="booking.booking_no">
              <td class="font-semibold">{{ booking.reg_no }}</td>
              <td class="space-y-1 flex flex-col">
                <div class="badge badge-soft badge-info">
                  Start:
                  {{
                    booking.booking_date
                      ? formatDateToWords(booking.booking_date)
                      : "-"
                  }}
                </div>
                <div class="badge badge-soft badge-success">
                  Seen:
                  {{
                    booking.inspection_date
                      ? formatDateToWords(booking.inspection_date)
                      : "-"
                  }}
                </div>
              </td>
              <td>{{ booking.valuation_location ?? "-" }}</td>
              <td class="space-y-1 flex flex-col">
                <div class="flex items-center space-x-1">
                  <span class="font-semibold">Chassis No:</span>
                  <span>{{ booking.chassisNumber ?? "-" }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <span class="font-semibold">Engine No:</span>
                  <span>{{ booking.engineNumber ?? "-" }}</span>
                </div>
              </td>
              <td class="font-semibold">
                {{ booking.regent_branch?.branchName ?? "-" }}
              </td>
              <td class="font-semibold text-accent">
                {{
                  booking.vehicle_value?.assessed_value
                    ? formatNumberWithCommas(
                        Number(booking.vehicle_value.assessed_value),
                      )
                    : "-"
                }}
              </td>
              <td class="max-w-60 text-wrap">
                {{ booking.inspection_note ?? "-" }}
              </td>
              <td>
                <GenericTableActionButton
                  :action-id="`vb-${booking.booking_no}-action`"
                  ><li>
                    <button
                      class="dropdown-item"
                      type="button"
                      @click="openViewMoreModal(booking)"
                    >
                      View More
                    </button>
                  </li></GenericTableActionButton
                >
              </td>
            </tr>
          </GenericTable>
        </template>
      </GrowableCard>
      <GenericTablePageSwitcher
        :current-page="paginationInfo.currentPage"
        :total-pages="paginationInfo.totalPages"
        :total-items="paginationInfo.totalItems"
        :scroll-back-disabled="page <= 0 || status === 'pending'"
        :scroll-forward-disabled="
          page >= paginationInfo.totalPages - 1 || status === 'pending'
        "
        @page-change-clicked="
          (page) => {
            handlePageChange(page);
          }
        "
      ></GenericTablePageSwitcher> </template
    ><template v-else>
      <GenericNoTableDataCTA
        heading="Create A Request"
        sub-heading="Via Authority Letter"
        to-page="valuations-create-authorization-letter"
      >
      </GenericNoTableDataCTA>
    </template>
  </div>

  <Teleport to="#modal-body">
    <div class="w-screen h-screen flex items-center justify-center">
      <div class="w-1/3 h-2/3">
        <GrowableCard
          ><template #no-padding>
            <div class="flex flex-col h-full">
              <div
                class="any-border-b w-full h-14 inline-flex items-center px-3"
              >
                <h1 class="font-bold">{{ activeLegacyReport?.reg_no }}</h1>
                <button
                  type="button"
                  class="absolute right-2 top-1.5 btn btn-text [--btn-color:#000] size-10"
                  aria-label="Soft Icon Button"
                  @click="closeViewMoreModal()"
                >
                  <span
                    class="icon-[material-symbols--close-rounded] size-6 shrink-0 text-base-content"
                  ></span>
                </button>
              </div>
              <div class="grow flex-1 w-full space-y-4 p-3">
                <div
                  class="alert alert-soft alert-warning flex items-start gap-4"
                >
                  <span
                    class="icon-[material-symbols--warning-rounded] shrink-0 size-6"
                  ></span>
                  <div class="flex flex-col gap-1">
                    <h5 class="font-semibold">
                      Note provided for this vehicle
                    </h5>
                    <p>{{ activeLegacyReport?.inspection_note ?? "-" }}</p>
                  </div>
                </div>

                <div
                  class="grid grid-cols-[1fr_3fr] any-border rounded-lg p-4 gap-4"
                >
                  <h3 class="font-semibold any-border-r">Make & Model</h3>
                  <span
                    >{{ activeLegacyReport?.vehicleMake ?? "-" }}
                    {{ activeLegacyReport?.vehicleType ?? "-" }}</span
                  >
                  <h3 class="font-semibold any-border-r">Inspection Date</h3>
                  <span>{{
                    activeLegacyReport?.inspection_date
                      ? formatDateToWords(activeLegacyReport?.inspection_date)
                      : "-"
                  }}</span>
                  <h3 class="font-semibold any-border-r">Seen At</h3>
                  <span>{{
                    activeLegacyReport?.valuation_location ?? "-"
                  }}</span>
                  <h3 class="font-semibold any-border-r">Chassis Number</h3>
                  <span>{{ activeLegacyReport?.chassisNumber ?? "-" }}</span>
                  <h3 class="font-semibold any-border-r">Engine Number</h3>
                  <span>{{ activeLegacyReport?.engineNumber ?? "-" }}</span>
                  <div class="col-span-full">
                    <h3 class="font-semibold">Extras</h3>
                    <p>
                      <template
                        v-if="
                          activeLegacyReport?.vehicle_value.extras_value &&
                          activeLegacyReport?.vehicle_value.extras_value.length
                        "
                      >
                        <span
                          v-for="extra in activeLegacyReport?.vehicle_value
                            .extras_value"
                          class="text-sm"
                          >{{ extra }},</span
                        ></template
                      >
                      <span v-else>-</span>
                    </p>
                  </div>
                </div>

                <!-- values -->
                <div class="grid grid-cols-3 gap-4">
                  <template
                    v-if="cleanAwardedValues(activeLegacyReport?.vehicle_value)"
                    v-for="e in cleanAwardedValues(
                      activeLegacyReport?.vehicle_value,
                    )"
                    :key="e.id"
                    ><div class="space-y-2 rounded-lg p-3 any-border">
                      <h1>{{ e.name }}</h1>
                      <span class="text-primary text-lg font-bold">{{
                        formatNumberWithCommas(Number(e.value))
                      }}</span>
                    </div></template
                  >
                </div>
              </div>
            </div>
          </template></GrowableCard
        >
      </div>
    </div>
  </Teleport>
</template>
