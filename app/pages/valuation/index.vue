<script setup lang="ts">
const config = useRuntimeConfig();
const size = config.public.PAGE_SIZE;
const store = usePrincipalStore();
const startDate: Ref<string | null> = ref(null);
const endDate: Ref<string | null> = ref(null);
const regNo: Ref<string | null> = ref(null);
const corpBranchId: Ref<string | null> = ref(null);

const query = computed(() => ({
  size,
  page: 0,
  corpId: store.corpId,
  startDate: startDate.value,
  endDate: endDate.value,
  regNo: regNo.value,
  corpBranchId: corpBranchId.value,
}));

const { data, pending, status, refresh } = useApiData<
  GenericResponse<ValuationBooking[]>
>(
  null, // Active key auto-generated from endpoint + query inside wrapper
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
  if (newPage >= 1 && newPage <= (paginationInfo.value?.totalPages ?? 1)) {
    paginationInfo.value.currentPage = newPage;
  }
}
</script>

<template>
  <GenericTable
    :headers="[
      'Reg',
      'Client',
      'Source',
      'Report Timeline',
      'Assessed Value',
      'Note',
      'Remarks',
      '',
    ]"
    :dataLoading="status == 'pending'"
  >
    <template v-if="data?.data.length">
      <tr v-for="booking in data.data">
        <td class="font-semibold">{{ booking.regNo }}</td>
        <td class="space-y-1">
          <div>{{ booking.clientName }}</div>
          <div>{{ booking.clientEmail || "-" }}</div>
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
        <td>{{ booking.vehicleValue?.assessedValue || "-" }}</td>
        <td>
          <div>{{ booking.inspectionNote || "-" }}</div>
        </td>
        <td>
          <div>{{ booking.inspectionRemarks || "-" }}</div>
        </td>
        <td>
          <button
            class="btn btn-circle btn-text btn-sm"
            aria-label="Action button"
          >
            <span class="icon-[material-symbols--more-vert] size-6"></span>
          </button>
        </td>
      </tr>
    </template>
  </GenericTable>

  <div class="flex mt-10 justify-between items-center">
    <span class="text-base-content/80 text-base">
      Showing {{ paginationInfo.currentPage + 1 }} of
      {{ paginationInfo.totalPages }} pages ({{ paginationInfo.totalItems }}
      items)
    </span>
    <div class="flex space-x-2">
      <button
        class="btn btn-primary h-12 rounded-2xl text-lg"
        type="button"
        @click="handlePageChange(paginationInfo.currentPage - 1)"
      >
        <span
          class="icon-[material-symbols--chevron-backward-rounded] size-4"
        ></span>
        Prev
      </button>

      <button
        class="btn btn-primary h-12 rounded-2xl text-lg"
        type="button"
        @click="handlePageChange(paginationInfo.currentPage + 1)"
      >
        Next
        <span
          class="icon-[material-symbols--chevron-forward-rounded] size-4"
        ></span>
      </button>
    </div>
  </div>
</template>
