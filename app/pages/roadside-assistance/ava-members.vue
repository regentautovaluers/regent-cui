<script setup lang="ts">
definePageMeta({
  name: "ra-ava-members",
  displayName: "AVA Members",
});

const {
  page,
  avaMembers,
  status,
  getActiveDescription,
  activeDescription,
  activeAVAMember,
  loadingMemberVehicles,
  memberVehicleEntries,
  transformDistribution,
  triggerLoadMemberVehicles,
} = useAVAMembers();
const paginationInfo = computed(() => ({
  totalPages: avaMembers.value?.totalPages || 1,
  totalItems: avaMembers.value?.totalCount || 0,
  currentPage: page.value,
}));
const { triggerModal } = useModal();
const store = usePrincipalStore();

function handlePageChange(newPage: number) {
  const maxPages = paginationInfo.value.totalPages;
  if (newPage >= 0 && newPage < maxPages) {
    page.value = newPage;
  }
}

function closeViewVehiclesModal() {
  // close the modal
  triggerModal();

  // after some time clear the storage
  setTimeout(
    () =>
      // remove loaded vehicles
      (memberVehicleEntries.value = {
        membershipVehicles: [],
        pagination: null,
      }),
    200, //ms
  );
}

function navigateToBulkUpload() {
  // close the modal
  triggerModal();

  // after some time navigate
  setTimeout(
    () =>
      navigateTo({
        name: "ra-onboard-bulk",
      }),
    200, //ms
  );
}

async function navigateToSingleUpload(
  username: string,
  phone: string | null,
  email: string | null,
  modalOpen: boolean = false,
) {
  if (modalOpen) {
    // close the modal
    triggerModal();
  }

  // after some time navigate
  const queryPayload = arrayBufferToBase64(
    await compress(JSON.stringify({ username, phone, email }), "deflate"),
  );

  navigateTo({
    name: "ra-onboard-single-member",
    query: {
      client: queryPayload,
    },
  });
}
</script>

<template>
  <div
    class="w-full h-full min-h-full grid grid-rows-[auto_1fr] grid-cols-[80%_20%] gap-8"
  >
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
            <h4>
              You Have {{ avaMembers?.totalCount ?? 0 }} Registered Members
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

    <div>
      <template v-if="avaMembers?.memberships?.length">
        <GrowableCard :show-padding="false">
          <template #no-padding>
            <GenericTable
              :headers="[
                'Number',
                'Client',
                'Contacts',
                'Vehicles',
                'Created At',
                '',
              ]"
              :dataLoading="status == 'pending'"
            >
              <tr
                v-for="membership in avaMembers.memberships"
                :key="membership.id"
              >
                <td class="font-semibold">{{ membership.id }}</td>
                <td>
                  <div class="font-semibold w-fit">
                    {{ membership.full_name }}
                  </div>
                  <div class="btn btn-soft btn-sm btn-accent">
                    {{ membership.category }}
                  </div>
                </td>
                <td class="space-y-1 flex flex-col">
                  <div class="badge badge-soft badge-info">
                    Email: {{ membership.userEmail ?? "-" }}
                  </div>
                  <div class="badge badge-soft badge-success">
                    Phone:
                    {{
                      !membership.phone_number
                        ? "-"
                        : censorString(membership.phone_number, "END")
                    }}
                  </div>
                </td>
                <td>
                  <div class="join">
                    <div class="btn btn-soft btn-primary join-item">
                      {{ membership.membershipVehicleCount }}
                    </div>
                    <button
                      type="button"
                      class="btn btn-soft btn-primary join-item"
                      @click="
                        triggerLoadMemberVehicles(
                          membership.full_name,
                          membership.userEmail,
                          membership.phone_number,
                        )
                      "
                    >
                      <span
                        class="icon-[material-symbols--open-in-full-rounded] size-4"
                      >
                      </span>
                      <span>View</span>
                    </button>
                  </div>
                </td>
                <td>
                  {{ formatDateToWords(membership.createdAt) }}
                </td>
                <td>
                  <GenericTableActionButton
                    :action-id="`member-${membership.id}-action`"
                  >
                    <li>
                      <button
                        class="dropdown-item"
                        type="button"
                        @click="
                          navigateToSingleUpload(
                            membership.full_name,
                            membership.phone_number,
                            membership.userEmail,
                          )
                        "
                      >
                        Add Vehicle
                      </button>
                    </li>
                    <li>
                      <button class="dropdown-item">Edit Details</button>
                    </li>
                  </GenericTableActionButton>
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
          heading="Onboard AVA Member"
          sub-heading="As One Or Many"
          to-page="ra-onboard-single-member"
        >
        </GenericNoTableDataCTA>
      </template>
    </div>
    <div class="grid grid-cols-1 gap-8">
      <div class="h-130 card block rounded-lg">
        <div class="flex flex-col w-full h-full">
          <div class="h-16 p-4 flex items-center justify-between">
            <h3 class="font-bold text-2xl">About</h3>
            <GenericTableActionButton action-id="about-ra-switcher"
              ><li>
                <button
                  type="button"
                  class="dropdown-item"
                  target="_blank"
                  @click="() => (activeDescription = 0)"
                >
                  Roadside Assistance
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="dropdown-item"
                  target="_blank"
                  @click="() => (activeDescription = 1)"
                >
                  Emergency Evacuation
                </button>
              </li></GenericTableActionButton
            >
          </div>
          <div class="grow flex flex-col items-center px-4">
            <div class="avatar avatar-placeholder">
              <div class="bg-primary text-error-content w-30 rounded-full">
                <span
                  class="icon-[material-symbols--group-rounded] size-12 font-semibold"
                ></span>
              </div>
            </div>
            <h2 class="text-2xl font-bold mt-2">Our Membership</h2>
            <h3>{{ getActiveDescription.name }}</h3>
            <p class="text-start mt-4">
              {{ getActiveDescription.description }}
            </p>
          </div>
          <div class="h-16 p-4 flex items-center justify-between border-t">
            <a
              href="https://regentautovaluers.com/roadside-assistance/"
              target="_blank"
              class="text-primary inline-flex items-center space-x-2"
              ><span>Learn More</span
              ><span
                class="icon-[material-symbols--double-arrow-rounded] size-4.5"
              ></span
            ></a>
          </div>
        </div>
      </div>
      <div class="h-130 card block rounded-lg">
        <div class="flex flex-col w-full h-full">
          <h3 class="h-16 p-4 font-bold text-2xl">Data Chart</h3>
          <div class="grow px-10 mt-4">
            <ClientOnly>
              <ChartsGenericDonutChart
                :data="transformDistribution.distribution"
                :height="250"
                :hide-legend="false"
                :inner-hole-width="50"
                :total="transformDistribution.total"
              >
              </ChartsGenericDonutChart>
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Teleport to="#modal-body">
    <div class="w-screen h-screen flex items-center justify-center">
      <div class="w-1/3 h-2/3">
        <GrowableCard>
          <template #no-padding>
            <div class="h-full flex flex-col w-full">
              <form class="relative border-b w-full h-[20%]">
                <InputsGenericInput
                  input-id="search-reg-no"
                  input-place-holder="Search registration number"
                ></InputsGenericInput>
                <button
                  type="button"
                  class="absolute right-2 top-1.5 btn btn-text [--btn-color:#000] size-10"
                  aria-label="Soft Icon Button"
                  @click="closeViewVehiclesModal()"
                >
                  <span
                    class="icon-[material-symbols--close-rounded] size-6 shrink-0"
                  ></span>
                </button>

                <div class="px-4">
                  <h3 class="my-2 text-lg font-bold">Actions</h3>
                  <div class="w-full h-fit space-x-2">
                    <button
                      class="btn btn-soft btn-sm btn-success"
                      type="button"
                      @click="
                        navigateToSingleUpload(
                          activeAVAMember!.full_name,
                          activeAVAMember!.full_name,
                          activeAVAMember!.userEmail,
                          true,
                        )
                      "
                    >
                      <span
                        class="icon-[material-symbols--add-2-rounded]"
                      ></span>
                      Add Vehicle
                    </button>
                    <button
                      class="btn btn-soft btn-sm btn-primary"
                      type="button"
                      @click="navigateToBulkUpload()"
                    >
                      <span
                        class="icon-[material-symbols--file-present]"
                      ></span>
                      Add Multiple Vehicles
                    </button>
                  </div>
                </div>
              </form>
              <div
                class="h-[80%] max-h-[80%] w-full overflow-y-auto thin-scrollbar"
              >
                <template v-if="loadingMemberVehicles">
                  <div class="w-full grid p-3 gap-3 grid-cols-2 h-fit">
                    <SkeletonsMembershipVehicleCardSkeleton
                      v-for="a in 5"
                      :key="a"
                    ></SkeletonsMembershipVehicleCardSkeleton>
                  </div>
                </template>

                <template
                  v-else-if="
                    !loadingMemberVehicles &&
                    !memberVehicleEntries.membershipVehicles.length
                  "
                >
                  <GenericNoTableDataCTA
                    heading="Onboard A Member"
                    sub-heading="One Or Many"
                    to-page="ra-onboard-single-member"
                  >
                  </GenericNoTableDataCTA>
                </template>
                <template v-else>
                  <div class="w-full grid grid-cols-2 p-3 gap-3 h-fit">
                    <MembershipVehicleCard
                      v-for="e in memberVehicleEntries.membershipVehicles"
                      :key="e.id"
                      :registration="e.registration"
                      :membership-name="e.membershipType.membership_name"
                      :start-date="e.start_date"
                      :end-date="e.end_date"
                    ></MembershipVehicleCard>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </GrowableCard>
      </div>
    </div>
  </Teleport>
</template>
