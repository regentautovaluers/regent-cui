<script setup lang="ts">
definePageMeta({
  name: "ra-incidents",
  displayName: "Road Rescue Incidents",
  layout: "ava-tables",
});

type IncidentEntry = (TowingEntry | FuelDeliveryEntry | TyreChangeEntry) & {
  incidentType: "towing" | "fueldelivery" | "tyrechange" | "jumpstarting";
};

const config = useRuntimeConfig();
const store = usePrincipalStore();
const page = ref(0);

const formFilters = reactive({
  startDate: "" as string,
  endDate: "" as string,
  completed: false as boolean,
  regNo: "" as string,
});
const activeFilters = reactive({
  startDate: "" as string,
  endDate: "" as string,
  // isVehicleTampered: false,
  completed: false as boolean,
  regNo: "" as string,
});
const query = computed(() => ({
  size: config.public.PAGE_SIZE,
  page: page.value,
  ...activeFilters,
}));
const { data, status, refresh } = useApiData<GetIncidentsWrapper>(
  computed(
    () => `client-ava-roadside-incidents-${JSON.stringify(toValue(query))}`,
  ),
  "/api/roadside-assistance/load-roadside-incidents",
  {
    query,
    lazy: false,
    // Keep previous data visible while fetching the next page for seamless UX
    dedupe: "defer",
  },
);
const processedIncidents = computed(() => {
  const rawData = toValue(data);

  // Default structure if data hasn't loaded yet
  if (!rawData) {
    return {
      data: [],
      distribution: {
        towing: 0,
        fueldelivery: 0,
        tyrechange: 0,
        jumpstarting: 0,
      },
    };
  }

  const distribution = {
    towing: rawData.towing?.data?.length || 0,
    fueldelivery: rawData.fueldelivey?.data?.length || 0,
    tyrechange: rawData.tyrechange?.data?.length || 0,
    jumpstarting: rawData.jumpstarting?.data?.length || 0,
  };

  // Tag entries with their type and combine into a single array
  const combinedData: IncidentEntry[] = [
    ...(rawData.towing?.data || []).map((item) => ({
      ...item,
      incidentType: "towing" as const,
    })),
    ...(rawData.fueldelivey?.data || []).map((item) => ({
      ...item,
      incidentType: "fueldelivery" as const,
    })),
    ...(rawData.tyrechange?.data || []).map((item) => ({
      ...item,
      incidentType: "tyrechange" as const,
    })),
    ...(rawData.jumpstarting?.data || []).map((item) => ({
      ...item,
      incidentType: "jumpstarting" as const,
    })),
  ];

  // Sort descending by date (newest first)
  combinedData.sort(
    (a, b) =>
      new Date(b.date_created).getTime() - new Date(a.date_created).getTime(),
  );

  return {
    data: combinedData,
    distribution,
  };
});
</script>

<template>
  <div class="flex-1 flex flex-col gap-8">
    <div class="card block w-full col-span-2 h-fit">
      <div class="gap-0 p-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="avatar avatar-placeholder">
            <div class="bg-primary text-error-content w-20 rounded-full">
              <span class="text-2xl uppercase">{{
                getInitials(store.username)
              }}</span>
            </div>
          </div>
          <div>
            <h3
              class="font-semibold inline-flex items-center text-primary space-x-2"
            >
              <span>Hi, {{ store.username }}</span
              ><span
                class="icon-[material-symbols--hand-gesture-rounded] rotate-45"
              ></span>
            </h3>
            <h4 class="capitalize">
              Welcome to your Roadside Incidents Dashboard
            </h4>
          </div>
        </div>
        <NuxtLink
          class="uppercase btn-primary btn h-13"
          :to="{ name: 'ra-onboard-single-member' }"
        >
          Add AVA Member
        </NuxtLink>
      </div>
    </div>

    <div
      class="flex-1 grid grid-cols-1 lg:grid-cols-[4fr_1fr] gap-8 items-stretch"
    >
      <div class="flex flex-col min-h-270">
        <GenericTableFilters
          :disable-filters="status === 'pending'"
          :disable-submit-button="status == 'pending'"
          v-model="formFilters.regNo"
        ></GenericTableFilters>
        <div class="grow">
          <template v-if="processedIncidents?.data?.length">
            <GrowableCard :show-padding="false">
              <template #no-padding>
                <GenericTable
                  :headers="[
                    'Reg',
                    'Booking Date',
                    'Client',
                    'type',
                    'Location',
                    'Cost',
                    '',
                  ]"
                  :dataLoading="status == 'pending'"
                >
                  <tr v-for="entry in processedIncidents.data" :key="entry.id">
                    <td class="text-primary font-semibold">
                      {{ entry.registration_no || "-" }}
                    </td>
                    <td class="font-semibold">
                      {{ formatDateToWords(entry.date_created) }}
                    </td>
                    <td class="space-y-1">
                      <div>{{ entry.user_name }}</div>
                      <div class="btn btn-soft btn-sm btn-accent">
                        {{
                          entry.user_phone
                            ? censorString(entry.user_phone, "CENTER")
                            : "-"
                        }}
                      </div>
                    </td>
                    <td class="font-semibold capitalize text-warning">
                      {{ entry.incidentType }}
                    </td>
                    <td>{{ entry.pickup_location }}</td>
                    <td class="font-semibold text-accent">
                      {{
                        entry.total_cost
                          ? formatNumberWithCommas(entry.total_cost)
                          : "-"
                      }}
                    </td>
                    <td>
                      <GenericTableActionButton
                        :action-id="`incident-${''}-action`"
                      ></GenericTableActionButton>
                    </td>
                  </tr>
                </GenericTable>
              </template>
            </GrowableCard>
          </template>
        </div>
      </div>
      <div class="flex flex-col space-y-8">
        <div class="h-1/2">
          <GrowableCard>
            <template #no-padding>
              <div class="flex flex-col w-full h-full p-4">
                <h3 class="h-16 font-bold text-xl">Distribution</h3>
                <div class="grow">
                  <ClientOnly>
                    <ChartsGenericDonutChart
                      :data="[
                        {
                          name: 'Towing',
                          value: processedIncidents.distribution.towing,
                        },
                        {
                          name: 'Fuel Delivery',
                          value: processedIncidents.distribution.fueldelivery,
                        },
                        {
                          name: 'Jumpstarting',
                          value: processedIncidents.distribution.jumpstarting,
                        },
                        {
                          name: 'Tyre Change',
                          value: processedIncidents.distribution.tyrechange,
                        },
                      ]"
                      :height="250"
                      :hide-legend="false"
                      :inner-hole-width="50"
                      :total="
                        processedIncidents.distribution.towing +
                        processedIncidents.distribution.fueldelivery +
                        processedIncidents.distribution.jumpstarting +
                        processedIncidents.distribution.tyrechange
                      "
                    >
                    </ChartsGenericDonutChart>
                  </ClientOnly>
                </div>
              </div> </template
          ></GrowableCard>
        </div>

        <div class="h-1/2">
          <GrowableCard>
            <template #no-padding
              ><div class="flex flex-col w-full h-full p-4">
                <h3 class="h-16 font-bold text-xl">Recent Vehicles</h3>
              </div></template
            ></GrowableCard
          >
        </div>
      </div>
    </div>
  </div>
</template>
