<script setup lang="ts">
definePageMeta({
  name: "cv-collateral-verification",
  displayName: "Collateral Check",
});

const { get } = useStandardizedApi();
const regNo = ref("");
const engineNo = ref("");
const chassisNo = ref("");
const colVerData: Ref<CollateralVerificationEntry[] | null> = ref(null);
const searchLoading = ref(false);
const { $showToast } = useNuxtApp();
const tokenStore = useCollateralVerificationsTokenStore();

async function loadIPRSId() {
  try {
    searchLoading.value = true;
    const response = await get<
      GenericCollateralVerificationResponse<CollateralVerificationEntry[]>
    >(`/api/col-v/search-collateral`, {
      searchTerms: `${regNo.value},${chassisNo.value},${engineNo.value}`,
    });

    if (response.success) {
      const data: CollateralVerificationEntry[] = (
        response as StandardSuccessResponse<
          GenericCollateralVerificationResponse<CollateralVerificationEntry[]>
        >
      ).data.data;

      colVerData.value = data;
    }
  } catch (ex) {
    $showToast({
      title: "Search Failed!",
      description: "Something went wrong. Please try again!",
      color: "error",
    });
  } finally {
    searchLoading.value = false;
  }
}
</script>

<template>
  <div>
    <HeadboardAnnouncer
      announcer-title="How It Works"
      highlight-text="Search Through IPRS"
    >
      <template #description
        ><p class="text-base-content/80 mt-2 text-base font-normal">
          Find out if a client's vehicle appears in our database of previous
          collateral incidents e.g. loan evasion. For a higher chance of
          retrieval, provide an engine, chassis and registration number,
          although at least only one is needed.
          <span class="font-semibold"
            >You have {{ tokenStore.getTokenBalance }} search tokens left.</span
          >
        </p>
      </template>

      <template #aside>
        <div
          class="flex grow items-center justify-center max-sm:mt-5 max-sm:justify-start"
        >
          <div class="inline-flex items-center flex-col space-y-1 text-primary">
            <span
              class="icon-[material-symbols--feature-search-rounded] size-12"
            ></span>
            <span class="font-semibold text-lg">Collateral Search</span>
          </div>
        </div>
      </template>
    </HeadboardAnnouncer>

    <ul
      class="timeline timeline-snap-icon timeline-compact timeline-vertical w-full"
    >
      <!-- timeline item 1-->
      <li>
        <div class="timeline-middle">
          <span class="badge badge-primary size-4.5 rounded-full p-0">
            <span
              class="icon-[tabler--check] text-primary-content size-3.5"
            ></span>
          </span>
        </div>
        <div class="timeline-end ms-2 m-3 w-full rounded-lg">
          <div
            class="text-base-content pt-0.5 mb-3 flex gap-2 font-bold max-sm:flex-col-reverse sm:items-center sm:justify-between"
          >
            Input At Least One Search Parameter.
            <span class="text-base-content/50 text-sm font-normal">Step 1</span>
          </div>

          <form class="space-y-5" @submit.prevent="loadIPRSId">
            <div class="grid gap-x-8 grid-cols-3">
              <InputsGenericInput
                input-id="colver-reg-no"
                input-place-holder="e.g. KAA1224"
                input-label="Registration Number"
                input-helpertext="Uppercase with no spaces"
                :input-required="false"
                v-model="regNo"
              ></InputsGenericInput>

              <InputsGenericInput
                input-id="colver-engine-no"
                input-place-holder="e.g. ENGINE123"
                input-helpertext="Exactly as it appears, in UPPERCASE"
                input-label="Engine Number"
                :input-required="false"
                v-model="engineNo"
              ></InputsGenericInput>

              <InputsGenericInput
                input-id="colver-chassis-no"
                input-place-holder="e.g. CHASSIS123"
                input-label="Chassis Number"
                input-helpertext="Exactly as it appears, in UPPERCASE"
                :input-required="false"
                v-model="chassisNo"
              ></InputsGenericInput>
            </div>
            <InputsGenericSubmitButton
              button-text="Perform Search"
              :submit-loading="searchLoading"
              class="w-1/3"
            ></InputsGenericSubmitButton>
          </form>
        </div>
        <hr class="bg-primary" />
      </li>

      <!-- timeline item 1-->
      <li>
        <div class="timeline-middle">
          <span class="badge badge-primary size-4.5 rounded-full p-0">
            <span
              class="icon-[tabler--check] text-primary-content size-3.5"
            ></span>
          </span>
        </div>
        <div class="timeline-end ms-2 m-3 w-full rounded-lg">
          <div
            class="text-base-content pt-0.5 mb-3 flex gap-2 font-bold max-sm:flex-col-reverse sm:items-center sm:justify-between"
          >
            Available Results Will Show Here
            <span class="text-base-content/50 text-sm font-normal">Step 2</span>
          </div>

          <div
            class="alert alert-soft"
            role="alert"
            v-if="!colVerData || colVerData.length == 0 || searchLoading"
          >
            Nothing to show! Do a search above and your results will show here!
          </div>

          <template v-else>
            <CollIPRSSearchResultsGrid
              v-for="(e, idx) in colVerData"
              :key="idx"
              :results="[
                {
                  title: 'Registration Number',
                  value: e.registrationNumber,
                },
                {
                  title: 'Chasis Number',
                  value: e.chassisNumber,
                },
                {
                  title: 'Engine Number',
                  value: e.engineNumber,
                },
                {
                  title: 'Color',
                  value: e.color || null,
                },
                {
                  title: 'Make & Model',
                  value: `${e.make} ${e.model}`,
                },
                {
                  title: 'Year of Manufacture',
                  value: e.yearOfManufacture,
                },
                {
                  title: 'Date of Incident',
                  value: e.dateOfIncident,
                },
                {
                  title: 'Defaulted Amount',
                  value: e.amountDefaulted,
                },
                {
                  title: 'Incident Description',
                  value: e.description
                    ? formatNumberWithCommas(Number(e.amountDefaulted))
                    : '',
                },
              ]"
            ></CollIPRSSearchResultsGrid>
          </template>
        </div>
        <hr class="bg-primary" />
      </li>
    </ul>
  </div>
</template>
