<script setup lang="ts">
definePageMeta({
  name: "cv-iprs-verification",
});

const { get } = useStandardizedApi();
const search = ref("");
const idData: Ref<IPRSIDCheckData | null> = ref(null);
const searchLoading = ref(false);

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
    // TODO: Show error toast here!
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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
          repellat corrupti provident distinctio omnis. Expedita, deleniti
          officiis modi reprehenderit maiores consequuntur eius iusto minus
          provident. Fugit vitae impedit eos alias?
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
  </div>
</template>
