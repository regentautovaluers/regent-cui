<script setup lang="ts">
definePageMeta({
  name: "cv-iprs-verification",
  displayName: "IPRS Check",
});

const { get } = useStandardizedApi();
const search = ref("");
const idData: Ref<IPRSIDCheckData | null> = ref(null);
const searchLoading = ref(false);
const { $showToast } = useNuxtApp();

async function loadIPRSId() {
  try {
    searchLoading.value = true;
    const response = await get<GenericIPRSQueryResponse<IPRSIDCheckData>>(
      `/api/col-v/load-id-iprs?idNumber=${search.value}`,
    );

    if (response.success) {
      const data: IPRSIDCheckData = (
        response as StandardSuccessResponse<
          GenericIPRSQueryResponse<IPRSIDCheckData>
        >
      ).data.data;

      idData.value = data;
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
          Verify critical details about your client through our portal. Search
          for national IDs, birth certificates, tax PINs e.t.c.
          <span class="font-semibold">Currently supports National ID only</span
          >. More search parameters coming soon.
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
            <span class="font-semibold text-lg">IPRS Search</span>
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
            Input The Full National ID To Search
            <span class="text-base-content/50 text-sm font-normal">Step 1</span>
          </div>

          <form class="space-y-5" @submit.prevent="loadIPRSId">
            <InputsGenericInput
              input-id="iprs-search-input"
              input-place-holder="enter only one e.g. 00000000"
              input-label="Enter national ID"
              :input-required="true"
              v-model="search"
            ></InputsGenericInput>
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
            v-if="!idData || searchLoading"
          >
            Nothing to show! Do a search above and your results will show here!
          </div>

          <template v-else>
            <CollIPRSSearchResultsGrid
              :results="[
                {
                  title: 'First Name',
                  value: idData.First_Name,
                },
                {
                  title: 'Other Name',
                  value: idData.Other_Name,
                },
                {
                  title: 'Surname',
                  value: idData.Surname,
                },
                {
                  title: 'Date of Birth',
                  value: idData.Date_of_Birth,
                },
                {
                  title: 'Gender',
                  value: idData.Gender,
                },
                {
                  title: 'Date of Issue',
                  value: idData.Date_of_Issue,
                },
                {
                  title: 'Place of Birth',
                  value: idData.Place_of_Birth,
                },
                {
                  title: 'Citizenship',
                  value: idData.Citizenship,
                },
                {
                  title: 'Serial Number',
                  value: idData.Serial_Number,
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
