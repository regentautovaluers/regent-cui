<script setup lang="ts">
definePageMeta({
  name: "cv-collateral-list",
  displayName: "Your Collateral List",
});

const config = useRuntimeConfig();
const size = config.public.PAGE_SIZE;
const page = ref(0);

const query = computed(() => {
  return {
    size,
    page: page.value,
  };
});

const { data, status, refresh } = useApiData<
  GenericCollateralVerificationResponse<CollateralVerificationEntry[]>
>(
  computed(() => `collateral-list-${JSON.stringify(toValue(query))}`),
  "/api/col-v/load-collateral-list",
  {
    query,
    lazy: false,
    // Keep previous data visible while fetching the next page for seamless UX
    dedupe: "defer",
    watch: [query],
  },
);

const paginationInfo = computed(() => ({
  totalPages: data.value?.pagination?.totalPages || 1,
  totalItems: data.value?.pagination?.totalRecords || 0,
  currentPage: data.value?.pagination?.currentPage || 0,
}));

function handlePageChange(newPage: number) {
  const maxPages = paginationInfo.value.totalPages;
  if (newPage >= 0 && newPage < maxPages) {
    page.value = newPage;
  }
}
</script>

<template>
  <div class="h-full min-h-full">
    <GrowableCard>
      <template #no-padding>
        <GenericTable
          :headers="[
            'Reg',
            'Vehicle IDs',
            'Vehicle',
            'Added By',
            'Incident On',
            'Amount',
            '',
          ]"
          :dataLoading="status == 'pending'"
        >
          <template v-if="data?.data.length">
            <tr v-for="entry in data.data" :key="entry.id">
              <td class="font-semibold">{{ entry.registrationNumber }}</td>
              <td class="space-y-1">
                <div class="flex space-x-1">
                  <span class="font-semibold"> Engine: </span>
                  <span>{{ entry.engineNumber }}</span>
                </div>
                <div class="flex space-x-1">
                  <span class="font-semibold"> Chassis: </span>
                  <span>{{ entry.chassisNumber }}</span>
                </div>
              </td>
              <td class="space-y-1">
                <div>{{ entry.make }} {{ entry.model }}</div>
                <div class="btn btn-soft btn-sm btn-accent">
                  {{ entry.color ?? "Color N/A" }}
                </div>
              </td>
              <td class="space-y-1">
                <div>{{ entry.corporateClientName }}</div>
                <div class="badge badge-soft badge-success">
                  {{ entry.corpClientEmail }}
                </div>
              </td>
              <td class="font-semibold">{{ entry.dateOfIncident }}</td>
              <td class="font-semibold text-accent">
                {{
                  entry.amountDefaulted
                    ? formatNumberWithCommas(Number(entry.amountDefaulted))
                    : ""
                }}
              </td>
              <td>
                <GenericPageActionButton :action-id="`colv-${entry.id}-action`">
                </GenericPageActionButton>
              </td>
            </tr>
          </template>
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
  </div>
</template>
