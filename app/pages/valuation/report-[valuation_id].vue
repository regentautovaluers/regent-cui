<script setup lang="ts">
definePageMeta({
  name: "valuation-open-report",
});

const route = useRoute();
const { data } = useApiData<SlimmedValuationReport>(
  `valuation-report-${route.params.valuation_id}`,
  "/api/vehicle-valuation/get-valuation-report",
  {
    query: {
      valuationId: route.params.valuation_id,
    },
    lazy: false,
    dedupe: "defer",
  },
);

const computedValues: ComputedRef<{ value: number; name: string }[]> = computed(
  () => {
    const v: { value: number; name: string }[] = [];
    const report = data.value;

    if (report) {
      const vehicleValue = report.vehicleValue;
      if (vehicleValue.marketValue != null) {
        v.push({ value: vehicleValue.marketValue, name: "Market Value" });
      }

      if (vehicleValue.assessedValue != null) {
        v.push({ value: vehicleValue.assessedValue, name: "Assessed Value" });
      }

      if (vehicleValue.forcedSaleValue != null) {
        v.push({
          value: vehicleValue.forcedSaleValue,
          name: "Forced Sale Value",
        });
      }

      if (vehicleValue.windscreenValue != null) {
        v.push({
          value: vehicleValue.windscreenValue,
          name: "Windscreen Value",
        });
      }

      if (vehicleValue.windscreenDealersPriceValue != null) {
        v.push({
          value: vehicleValue.windscreenDealersPriceValue,
          name: "W/Screen D.P. Value",
        });
      }

      if (vehicleValue.radioValue != null) {
        v.push({ value: vehicleValue.radioValue, name: "Radio Value" });
      }

      if (vehicleValue.infotainmentValue != null) {
        v.push({
          value: vehicleValue.infotainmentValue,
          name: "Infotainment Value",
        });
      }

      if (vehicleValue.twoWayRadioValue != null) {
        v.push({
          value: vehicleValue.twoWayRadioValue,
          name: "Two-Way Radio Value",
        });
      }

      if (vehicleValue.dutyFree != null) {
        v.push({ value: vehicleValue.dutyFree, name: "Duty Free Value" });
      }

      if (vehicleValue.dutyPaid != null) {
        v.push({ value: vehicleValue.dutyPaid, name: "Duty Paid Value" });
      }
    }

    return v;
  },
);
</script>

<template>
  <div class="grid grid-cols-4 gap-10">
    <div
      class="col-span-4 laptop:col-span-2 shadow-lg border overflow-clip h-123 flex flex-col rounded-2xl"
    >
      <div class="border-b w-full p-8 inline-flex justify-between">
        <div>
          <h1>{{ data?.valuationId }}</h1>
          <h2 class="text-base-content text-3xl font-bold">
            {{ data?.regNo }}
          </h2>
        </div>
        <a
          :href="data?.reportURL!"
          target="_blank"
          class="btn btn-primary h-14 text-lg rounded-2xl"
          type="button"
        >
          Download Report
        </a>
      </div>
      <div class="h-full grow p-5">
        <div class="h-60 p-5 flex items-end space-x-10">
          <NuxtImg
            :src="data?.vehiclePhotos[0]"
            densities="x1 x2"
            class="object-cover size-35 laptop:size-40 laptop-lg:size-48 rounded-2xl"
            :placeholder="[192, 192, 75, 5]"
          />
          <div class="grow flex flex-col justify-end">
            <span class="font-bold text-xl">{{ data?.clientName }}</span
            ><span>{{ data?.vehicleMake }}</span>
            <div class="my-1"></div>
            <span class="text-sm">{{ data?.vehicleType }}</span
            ><span class="text-sm">{{ data?.policyNumber || "-" }}</span>
          </div>
        </div>
        <div class="grid grid-cols-4 place-items-center">
          <div class="p-4">
            <h2 class="font-semibold">Chassis No</h2>
            <h3 class="text-sm">{{ data?.chassisNumber }}</h3>
          </div>
          <div class="p-4">
            <h2 class="font-semibold">Engine No</h2>
            <h3 class="text-sm">{{ data?.engineNumber }}</h3>
          </div>
          <div class="p-4">
            <h2 class="font-semibold">Mileage</h2>
            <h3 class="text-sm">
              {{ data?.mileage.reading }} {{ data?.mileage.units }}
            </h3>
          </div>
        </div>
      </div>
    </div>
    <div
      class="col-span-4 laptop:col-span-2 shadow-lg border overflow-clip h-123 flex flex-col space-y-6 rounded-2xl p-8"
    >
      <div
        class="flex items-start space-x-4"
        v-for="(e, idx) in data?.sectionComments"
        :key="idx"
      >
        <div
          :class="[
            `h-8 min-h-8 max-h-8 w-2 min-w-2 max-w-2 rounded-full bg-${e.chipColor}-500`,
          ]"
        ></div>
        <div>
          <h3 class="font-bold">{{ e.name }}</h3>
          <template v-if="Array.isArray(e.value)">
            <span v-for="(i, idx) in e.value" :key="idx" class="text-sm"
              >{{ i }},</span
            >
          </template>
          <template v-else>
            <span class="text-sm">{{ e.value }}</span>
          </template>
        </div>
      </div>
    </div>

    <!-- the values -->
    <div
      class="col-span-2 laptop-lg:col-span-1 items-center shadow-lg border h-25 p-5 space-x-7 rounded-2xl flex"
      v-for="(v, idx) in computedValues"
      :key="idx"
    >
      <div
        class="size-16 bg-info rounded-full flex items-center justify-center"
      >
        <span
          class="icon-[material-symbols--account-balance-wallet] size-9"
        ></span>
      </div>
      <div>
        <h3 class="font-semibold text-base-content">{{ v.name }}</h3>
        <h4 class="font-bold text-2xl text-info">
          {{ formatNumberWithCommas(v.value) }}
        </h4>
      </div>
    </div>

    <div
      id="info"
      data-carousel='{ "loadingClasses": "opacity-0", "isInfiniteLoop": true, "slidesQty": 1 }'
      class="relative w-full col-span-4 h-200"
    >
      <div class="carousel h-full">
        <div class="carousel-body h-full opacity-0">
          <!-- Slide 1 -->
          <div
            class="carousel-slide"
            v-for="(v, idx) in data?.vehiclePhotos"
            :key="idx"
          >
            <div class="flex h-full justify-center">
              <NuxtImg
                :src="v"
                densities="x1 x2"
                class="object-cover size-full"
                preload
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Previous Slide -->
      <button
        type="button"
        class="carousel-prev start-5 max-sm:start-3 carousel-disabled:opacity-50 size-9.5 bg-base-100 flex items-center justify-center rounded-full shadow-base-300/20 shadow-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          class="size-8"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="m10.8 12l3.9 3.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-4.6-4.6q-.15-.15-.212-.325T8.425 12t.063-.375t.212-.325l4.6-4.6q.275-.275.7-.275t.7.275t.275.7t-.275.7z"
          />
        </svg>
        <span class="sr-only">Previous</span>
      </button>
      <!-- Next Slide -->
      <button
        type="button"
        class="carousel-next end-5 max-sm:end-3 carousel-disabled:opacity-50 size-9.5 bg-base-100 flex items-center justify-center rounded-full shadow-base-300/20 shadow-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          class="size-8"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z"
          />
        </svg>
        <span class="sr-only">Next</span>
      </button>
      <div
        class="carousel-info absolute bottom-3 start-[50%] inline-flex -translate-x-1/2 justify-center rounded-lg bg-base-100 px-4"
      >
        <span class="carousel-info-current me-1"></span>
        /
        <span class="ms-1">{{ data?.vehiclePhotos.length }}</span>
      </div>
    </div>
  </div>
</template>
