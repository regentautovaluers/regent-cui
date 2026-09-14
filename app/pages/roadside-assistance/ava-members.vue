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
  refresh,
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
                      @click="triggerModal()"
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
      <div class="h-130"><GrowableCard> </GrowableCard></div>
    </div>
  </div>

  <Teleport to="#modal-body">
    <h1>Hello world</h1>
  </Teleport>
</template>
