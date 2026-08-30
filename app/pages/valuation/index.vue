<script setup lang="ts">
const config = useRuntimeConfig();
const { get } = useStandardizedApi();
const fleetEntries: Ref<FleetEntry[]> = ref([]);
const loadingFleets = ref(false);
const page = ref(0);
const formFilters = reactive({
  startDate: "" as string,
  endDate: "" as string,
  // isVehicleTampered: false,
  completed: false as boolean,
  regNo: "" as string,
  fleetId: null as null | string,
});
const activeFilters = reactive({
  startDate: "" as string,
  endDate: "" as string,
  // isVehicleTampered: false,
  completed: false as boolean,
  regNo: "" as string,
  fleetId: null as null | string,
});
const query = computed(() => ({
  size: config.public.PAGE_SIZE,
  page: page.value,
  ...activeFilters,
}));

const { data, status, refresh } = useApiData<
  GenericResponse<ValuationBooking[]>
>(
  computed(() => `api-client-valuations-${JSON.stringify(toValue(query))}`),
  "/api/vehicle-valuation/load-client-valuations",
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

function allowAccessReport(
  currentStage: ValuationStages | null,
  reportURL: string | null,
): boolean {
  if (currentStage) {
    if (["INVOICING", "COMPLETED"].includes(currentStage) && reportURL) {
      return true;
    }
  }

  return false;
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
  formFilters.completed = false;
  formFilters.regNo = "";
  formFilters.fleetId = null;

  // Copy defaults into active filters
  Object.assign(activeFilters, formFilters);

  // Reset pagination
  page.value = 0;

  // Trigger API refresh with defaults
  refresh();
}

async function loadFleets() {
  if (fleetEntries.value.length > 0) return;

  try {
    loadingFleets.value = true;
    const fleets = await get<GenericResponse<FleetEntry[]>>(
      "/api/vehicle-valuation/get-fleets",
    );
    if (fleets.success) {
      const response = fleets as StandardSuccessResponse<
        GenericResponse<FleetEntry[]>
      >;
      fleetEntries.value = response.data.data;
    }
  } catch (ex) {
    // TODO: Put error toast here
  } finally {
    loadingFleets.value = false;
  }
}
</script>

<template>
  <GenericTableFilters
    :disable-filters="status === 'pending'"
    :disable-submit-button="status == 'pending'"
    v-model="formFilters.regNo"
    @reset-filters="resetFilters()"
    @execute-filters="applyFilters()"
    @extra-filters-open="loadFleets()"
  >
    <template #float-left>
      <nav
        class="tabs tabs-bordered flex-1"
        aria-label="Tabs"
        role="tablist"
        aria-orientation="horizontal"
      >
        <button
          type="button"
          @click="
            () => {
              formFilters.completed = true;
              applyFilters();
            }
          "
          :class="['tab active-tab:tab-active', query.completed && 'active']"
          id="tabs-basic-item-1"
          data-tab="#tabs-basic-1"
          aria-controls="tabs-basic-1"
          role="tab"
          aria-selected="true"
        >
          Completed
        </button>
        <button
          type="button"
          @click="
            () => {
              formFilters.completed = false;
              applyFilters();
            }
          "
          :class="[
            'tab active-tab:tab-active',
            !formFilters.completed && 'active',
          ]"
          id="tabs-basic-item-2"
          data-tab="#tabs-basic-2"
          aria-controls="tabs-basic-2"
          role="tab"
          aria-selected="false"
        >
          Ongoing
        </button>
      </nav>
    </template>
    <InputsGenericDateInput
      input-id="val-start-date"
      input-label="Start Period"
      input-wrapper-styles="flex-1"
      v-model="formFilters.startDate"
    ></InputsGenericDateInput>
    <InputsGenericDateInput
      input-id="val-end-date"
      input-label="End Period"
      input-wrapper-styles="flex-1"
      v-model="formFilters.endDate"
    ></InputsGenericDateInput>
    <!-- fleet -->
    <InputsGenericInputSearchBox
      input-id="cal-select-fleet"
      input-label="Select Fleet"
      :input-dropdown-options="
        fleetEntries.map((e) => ({
          id: e.id,
          text: e.fleetName,
        }))
      "
      :input-data-loading="loadingFleets"
      input-wrapper-styles="flex-1"
      :input-disabled="loadingFleets || fleetEntries.length == 0"
      @value-selected="(id) => (formFilters.fleetId = id)"
    >
    </InputsGenericInputSearchBox>
  </GenericTableFilters>

  <template v-if="data?.data?.length">
    <GrowableCard :show-padding="false">
      <template #no-padding>
        <GenericTable
          :headers="[
            'Reg',
            'Client',
            'Progress',
            'Source',
            'Report Timeline',
            'Assessed Value',
            'Note',
            'Remarks',
            '',
          ]"
          :dataLoading="status == 'pending'"
        >
          <tr v-for="booking in data.data" :key="booking.valuationId">
            <td class="font-semibold">{{ booking.regNo }}</td>
            <td class="space-y-1">
              <div>{{ booking.clientName }}</div>
              <div>{{ booking.clientEmail || "-" }}</div>
            </td>
            <td>
              <div class="font-semibold w-fit">
                {{
                  normalizeValuationStage(booking.valuationStage).wrapperName
                }}
              </div>
              <div class="w-fit badge badge-warning">
                {{
                  normalizeValuationStage(booking.valuationStage).wrapperStage
                }}/5
              </div>
            </td>
            <td class="space-y-1">
              <div>
                {{ normalizeValuationBookingSource(booking.bookingSource!) }}
              </div>
              <a
                v-if="booking.bookingSource == 'AUTHORITY_LETTER'"
                class="btn btn-soft btn-sm btn-info"
                href="#"
                target="_self"
              >
                <span
                  class="icon-[material-symbols--arrow-cool-down-rounded]"
                ></span>
                Download Letter
              </a>
            </td>
            <td class="space-y-1 flex flex-col">
              <div class="badge badge-soft badge-info">
                Start: {{ formatDateToWords(booking.bookingDate) }}
              </div>
              <div class="badge badge-soft badge-success">
                End: {{ formatDateToWords(booking.approvalDate) }}
              </div>
            </td>
            <td class="font-semibold text-accent">
              {{
                booking.vehicleValue?.assessedValue
                  ? formatNumberWithCommas(booking.vehicleValue.assessedValue)
                  : "-"
              }}
            </td>
            <td class="max-w-60 text-wrap">
              {{ booking.inspectionNote || "-" }}
            </td>
            <td class="max-w-60 text-wrap">
              {{ booking.inspectionRemarks || "-" }}
            </td>
            <td>
              <GenericPageActionButton
                :action-id="`vb-${booking.valuationId}-action`"
              >
                <template
                  v-show="
                    allowAccessReport(booking.valuationStage, booking.reportURL)
                  "
                >
                  <li>
                    <a :href="booking.reportURL!">Download Report</a>
                  </li>
                  <li>
                    <NuxtLink :to="`/valuation/report-${booking.valuationId}`">
                      Open Report
                    </NuxtLink>
                  </li>
                </template>
              </GenericPageActionButton>
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
    ></GenericTablePageSwitcher>
  </template>

  <template v-else>
    <GenericNoTableDataCTA
      heading="Create A Request"
      sub-heading="Via Authority Letter"
      to-page="valuations-create-authorization-letter"
    >
    </GenericNoTableDataCTA>
  </template>
</template>
